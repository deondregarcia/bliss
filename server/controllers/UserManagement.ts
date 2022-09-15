import { db } from "../db";
import { OkPacket, RowDataPacket } from "mysql2";
import {
  FriendPairType,
  FriendRequestUserType,
  UserType,
} from "../types/content";

export const createUser = (newUser: UserType, callback: Function) => {
  const queryString =
    "INSERT INTO users (username, first_name, last_name, created_at, google_id, google_photo_link, wants_to) VALUES (?,?,?,?,?,?,?)";

  db.query(
    queryString,
    [
      newUser.username,
      newUser.first_name,
      newUser.last_name,
      newUser.created_at,
      newUser.google_id,
      newUser.google_photo_link,
      newUser.wants_to,
    ],
    (err, result) => {
      if (err) {
        callback(err);
      }

      const insertID = (<OkPacket>result).insertId;
      callback(null, insertID);
    }
  );
};

export const checkUsername = (username: string, callback: Function) => {
  const queryString = "SELECT username FROM users WHERE username=?";

  db.query(queryString, username, (err, result) => {
    if (err) {
      callback(err);
    }

    const usernameExists = <RowDataPacket>result;
    callback(null, usernameExists);
  });
};

// send a friend request based on Google ID's
export const sendFriendRequest = (
  requestorGoogleID: string,
  requesteeGoogleID: string,
  callback: Function
) => {
  // get requestor and requestee user id's from google id's
  const getRequestorID = "(SELECT id FROM users WHERE google_id=?)";
  const getRequesteeID = "(SELECT id FROM users WHERE google_id=?)";
  const queryString = `INSERT INTO friend_requests (requestor_id, requestee_id) VALUES (${getRequestorID},${getRequesteeID})`;

  db.query(
    queryString,
    [requestorGoogleID, requesteeGoogleID],
    (err, result) => {
      if (err) {
        callback(err);
      }

      const insertID = (<OkPacket>result).insertId;
      callback(null, insertID);
    }
  );
};

// accept friend request -> insert into friends and delete from friend_requests
export const acceptRequest = (
  userGoogleID: string,
  friendGoogleID: string,
  callback: Function
) => {
  // get user id's from google id's
  const getUserID = "(SELECT id FROM users WHERE google_id=?)";
  const getFriendID = "(SELECT id FROM users WHERE google_id=?)";
  // insert into friends query string
  const insertQueryString = `INSERT INTO friends (user_id, friend_id) VALUES (${getUserID}, ${getFriendID})`;

  db.query(insertQueryString, [userGoogleID, friendGoogleID], (err, result) => {
    if (err) {
      callback(err);
    }

    const insertID = (<OkPacket>result).insertId;
    callback(null, insertID);
  });
};

// deny friend request -> delete from friend_requests
export const denyRequest = (
  userGoogleID: string,
  friendGoogleID: string,
  callback: Function
) => {
  // get user id's from google id's
  const getUserID = "(SELECT id FROM users WHERE google_id=?)";
  const getFriendID = "(SELECT id FROM users WHERE google_id=?)";

  const deleteQueryString = `DELETE FROM friend_requests WHERE requestee_id=${getUserID} AND requestor_id=${getFriendID}`;

  db.query(deleteQueryString, [userGoogleID, friendGoogleID], (err, result) => {
    if (err) {
      callback(err);
    }

    const deletionID = (<OkPacket>result).insertId;
    callback(null, deletionID);
  });
};

// get outgoing friend requests from a user's google id
export const getOutgoingFriendRequests = (
  userGoogleID: string,
  callback: Function
) => {
  // get user id from google id
  const getUserID = "(SELECT id FROM users WHERE google_id=?)";
  const getAllRequesteeIDs = `(SELECT requestee_id FROM bliss_db.friend_requests WHERE requestor_id=${getUserID})`;
  const queryString = `SELECT username, google_id, google_photo_link FROM users WHERE id IN ${getAllRequesteeIDs}`;

  db.query(queryString, [userGoogleID], (err, result) => {
    if (err) {
      callback(err);
    }

    const rows = <RowDataPacket[]>result;
    const outgoingRequestUsers: FriendRequestUserType[] = [];

    rows.forEach((row) => {
      const outgoingRequestUser: FriendRequestUserType = {
        username: row.username,
        google_id: row.google_id,
        google_photo_link: row.google_photo_link,
      };
      outgoingRequestUsers.push(outgoingRequestUser);
    });
    callback(null, outgoingRequestUsers);
  });
};

// get incoming friend requests from a user's google id
export const getIncomingFriendRequests = (
  userGoogleID: string,
  callback: Function
) => {
  // get user id from google id
  const getUserID = "(SELECT id FROM users WHERE google_id=?)";
  const getAllRequestorIDs = `(SELECT requestor_id FROM bliss_db.friend_requests WHERE requestee_id=${getUserID})`;
  const queryString = `SELECT username, google_id, google_photo_link FROM users WHERE id IN ${getAllRequestorIDs}`;

  db.query(queryString, [userGoogleID], (err, result) => {
    if (err) {
      callback(err);
    }

    const rows = <RowDataPacket[]>result;
    const incomingRequestUsers: FriendRequestUserType[] = [];

    rows.forEach((row) => {
      const incomingRequestUser: FriendRequestUserType = {
        username: row.username,
        google_id: row.google_id,
        google_photo_link: row.google_photo_link,
      };
      incomingRequestUsers.push(incomingRequestUser);
    });
    callback(null, incomingRequestUsers);
  });
};

// gets user id from the google id
export const getUserID = (userGoogleID: string, callback: Function) => {
  const queryString = "SELECT id FROM bliss_db.users WHERE google_id=?";

  db.query(queryString, userGoogleID, (err, result) => {
    if (err) {
      console.log(err);
    }

    const userID = <RowDataPacket>result;
    callback(null, userID);
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

  db.query(
    mainQueryString,
    [reqUserID, urlID, urlID, reqUserID],
    (err, result) => {
      if (err) {
        callback(err);
      }

      // there should only be one, so add a check for this later
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

export const checkIfFriendWithUserID = (
  reqUserGoogleID: string,
  secondID: string,
  callback: Function
) => {
  // friends table is [id, user_id, friend_id] so must check if (user_id, friend_id) OR (friend_id, user_id) exists
  const queryStringOne = "SELECT * FROM bliss_db.friends WHERE ";
  // check if (user_id, friend_id) exists
  const queryStringTwo =
    "(user_id=(SELECT id FROM bliss_db.users WHERE google_id=?) AND friend_id=?)";
  // check if "OR" (friend_id, user_id) exists
  const queryStringThree =
    " OR (user_id=? AND friend_id=(SELECT id FROM bliss_db.users WHERE google_id=?))";

  // combine all query strings
  const mainQueryString: string =
    queryStringOne + queryStringTwo + queryStringThree;

  db.query(
    mainQueryString,
    [reqUserGoogleID, secondID, secondID, reqUserGoogleID],
    (err, result) => {
      if (err) {
        callback(err);
      }

      // there should only be one, so add a check for this later
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

// update google photo based on google id since you can't select "FROM" the table you're updating
export const updateGooglePhoto = (
  userGoogleID: string,
  googlePhotoLink: string,
  callback: Function
) => {
  const queryString = "UPDATE users SET google_photo_link=? WHERE google_id=?";

  db.query(queryString, [googlePhotoLink, userGoogleID], (err, result) => {
    if (err) {
      callback(err);
    }

    const insertID = (<OkPacket>result).insertId;
    callback(null, insertID);
  });
};
