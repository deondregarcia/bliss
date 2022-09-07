import { db } from "../db";
import { OkPacket, RowDataPacket } from "mysql2";
import { UserType } from "../types/content";

export const createUser = (newUser: UserType, callback: Function) => {
  const queryString =
    "INSERT INTO users (username, first_name, last_name, created_at, google_id, bio) VALUES (?,?,?,?,?,?)";

  db.query(
    queryString,
    [
      newUser.username,
      newUser.first_name,
      newUser.last_name,
      newUser.created_at,
      newUser.google_id,
      newUser.bio,
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
