import { db } from "../db";
import { OkPacket, RowDataPacket } from "mysql2";
import { FriendRequestUserType, UserType } from "../types/content";

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
