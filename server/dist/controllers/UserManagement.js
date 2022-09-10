"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUsername = exports.createUser = void 0;
const db_1 = require("../db");
const createUser = (newUser, callback) => {
    const queryString = "INSERT INTO users (username, first_name, last_name, created_at, google_id, bio) VALUES (?,?,?,?,?,?)";
    db_1.db.query(queryString, [
        newUser.username,
        newUser.first_name,
        newUser.last_name,
        newUser.created_at,
        newUser.google_id,
        newUser.bio,
    ], (err, result) => {
        if (err) {
            callback(err);
        }
        const insertID = result.insertId;
        callback(null, insertID);
    });
};
exports.createUser = createUser;
const checkUsername = (username, callback) => {
    const queryString = "SELECT username FROM users WHERE username=?";
    db_1.db.query(queryString, username, (err, result) => {
        if (err) {
            callback(err);
        }
        const usernameExists = result;
        callback(null, usernameExists);
    });
};
exports.checkUsername = checkUsername;
