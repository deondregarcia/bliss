import { db } from "../db";
import { OkPacket, RowDataPacket } from "mysql2";
import { SessionType } from "../types/session";

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
