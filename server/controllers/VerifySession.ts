import { db } from "../db";
import { OkPacket, RowDataPacket } from "mysql2";
import { SessionType } from "../types/session";
import { FriendPairType } from "../types/content";

// scans sessions table for existence of client-supplied session ID for authentication
export const verifySession = (reqSessionID: string, callback: Function) => {
  const queryString = "SELECT * FROM sessions WHERE session_id =?";

  db.query(queryString, reqSessionID, (err, result) => {
    if (err) {
      callback(err);
    }

    // should only get one row, so later on add check for length of response
    const rows = <RowDataPacket[]>result;
    const sessions: SessionType[] = [];

    rows.forEach((row) => {
      const session: SessionType = {
        session_id: row.session_id,
        expires: row.expires,
        data: row.data,
      };
      sessions.push(session);
    });
    callback(null, sessions);
  });
};

// check if ID in url user is navigating to, is a friend of logged in user
export const checkIfFriend = (
  reqUserID: string,
  urlID: string,
  callback: Function
) => {
  // friends table is [id, user_id, friend_id] so must check if (user_id, friend_id) OR (friend_id, user_id) exists
  const queryStringOne = "SELECT * FROM bliss_db.friends WHERE ";
  // check if (user_id, friend_id) exists
  const queryStringTwo =
    "(user_id=(SELECT id FROM bliss_db.users WHERE google_id=?) AND friend_id=(SELECT id FROM bliss_db.users WHERE google_id=?))";
  // check if "OR" (friend_id, user_id) exists
  const queryStringThree =
    " OR (user_id=(SELECT id FROM bliss_db.users WHERE google_id=?) AND friend_id=(SELECT id FROM bliss_db.users WHERE google_id=?))";

  // combine all query strings
  const mainQueryString: string =
    queryStringOne + queryStringTwo + queryStringThree;

  console.log(mainQueryString);
  // mainQueryString params array will be [user_id, friend_id, friend_id, user_id] where we will arbitrarily make reqSessionID = user_id and urlID = friend_id

  console.log(db.format(mainQueryString, [reqUserID, urlID, urlID, reqUserID]));
  db.query(
    mainQueryString,
    [reqUserID, urlID, urlID, reqUserID],
    (err, result) => {
      if (err) {
        callback(err);
      }

      // there should only be one, so add a check for this later
      console.log(result);
      const rows = <RowDataPacket[]>result;
      const friendPairs: FriendPairType[] = [];

      rows.forEach((row) => {
        const friendPair: FriendPairType = {
          friend_one_id: row.user_id,
          friend_two_id: row.friend_id,
        };
        friendPairs.push(friendPair);
      });
      callback(null, friendPairs);
    }
  );
};
