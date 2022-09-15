"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySession = void 0;
const db_1 = require("../db");
// scans sessions table for existence of client-supplied session ID for authentication
const verifySession = (reqSessionID, callback) => {
    const queryString = "SELECT * FROM sessions WHERE session_id =?";
    db_1.db.query(queryString, reqSessionID, (err, result) => {
        if (err) {
            callback(err);
        }
        // should only get one row, so later on add check for length of response
        const rows = result;
        const sessions = [];
        rows.forEach((row) => {
            const session = {
                session_id: row.session_id,
                expires: row.expires,
                data: row.data,
            };
            sessions.push(session);
        });
        callback(null, sessions);
    });
};
exports.verifySession = verifySession;
