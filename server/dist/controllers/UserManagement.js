"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIncomingFriendRequests = exports.getOutgoingFriendRequests = exports.denyRequest = exports.acceptRequest = exports.sendFriendRequest = exports.checkUsername = exports.createUser = void 0;
const db_1 = require("../db");
const createUser = (newUser, callback) => {
    const queryString = "INSERT INTO users (username, first_name, last_name, created_at, google_id, google_photo_link, wants_to) VALUES (?,?,?,?,?,?,?)";
    db_1.db.query(queryString, [
        newUser.username,
        newUser.first_name,
        newUser.last_name,
        newUser.created_at,
        newUser.google_id,
        newUser.google_photo_link,
        newUser.wants_to,
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
// send a friend request based on Google ID's
const sendFriendRequest = (requestorGoogleID, requesteeGoogleID, callback) => {
    // get requestor and requestee user id's from google id's
    const getRequestorID = "(SELECT id FROM users WHERE google_id=?)";
    const getRequesteeID = "(SELECT id FROM users WHERE google_id=?)";
    const queryString = `INSERT INTO friend_requests (requestor_id, requestee_id) VALUES (${getRequestorID},${getRequesteeID})`;
    db_1.db.query(queryString, [requestorGoogleID, requesteeGoogleID], (err, result) => {
        if (err) {
            callback(err);
        }
        const insertID = result.insertId;
        callback(null, insertID);
    });
};
exports.sendFriendRequest = sendFriendRequest;
// accept friend request -> insert into friends and delete from friend_requests
const acceptRequest = (userGoogleID, friendGoogleID, callback) => {
    // get user id's from google id's
    const getUserID = "(SELECT id FROM users WHERE google_id=?)";
    const getFriendID = "(SELECT id FROM users WHERE google_id=?)";
    // insert into friends query string
    const insertQueryString = `INSERT INTO friends (user_id, friend_id) VALUES (${getUserID}, ${getFriendID})`;
    db_1.db.query(insertQueryString, [userGoogleID, friendGoogleID], (err, result) => {
        if (err) {
            callback(err);
        }
        const insertID = result.insertId;
        callback(null, insertID);
    });
};
exports.acceptRequest = acceptRequest;
// deny friend request -> delete from friend_requests
const denyRequest = (userGoogleID, friendGoogleID, callback) => {
    // get user id's from google id's
    const getUserID = "(SELECT id FROM users WHERE google_id=?)";
    const getFriendID = "(SELECT id FROM users WHERE google_id=?)";
    const deleteQueryString = `DELETE FROM friend_requests WHERE requestee_id=${getUserID} AND requestor_id=${getFriendID}`;
    db_1.db.query(deleteQueryString, [userGoogleID, friendGoogleID], (err, result) => {
        if (err) {
            callback(err);
        }
        const deletionID = result.insertId;
        callback(null, deletionID);
    });
};
exports.denyRequest = denyRequest;
// get outgoing friend requests from a user's google id
const getOutgoingFriendRequests = (userGoogleID, callback) => {
    // get user id from google id
    const getUserID = "(SELECT id FROM users WHERE google_id=?)";
    const getAllRequesteeIDs = `(SELECT requestee_id FROM bliss_db.friend_requests WHERE requestor_id=${getUserID})`;
    const queryString = `SELECT username, google_id, google_photo_link FROM users WHERE id IN ${getAllRequesteeIDs}`;
    db_1.db.query(queryString, [userGoogleID], (err, result) => {
        if (err) {
            callback(err);
        }
        const rows = result;
        const outgoingRequestUsers = [];
        rows.forEach((row) => {
            const outgoingRequestUser = {
                username: row.username,
                google_id: row.google_id,
                google_photo_link: row.google_photo_link,
            };
            outgoingRequestUsers.push(outgoingRequestUser);
        });
        callback(null, outgoingRequestUsers);
    });
};
exports.getOutgoingFriendRequests = getOutgoingFriendRequests;
// get incoming friend requests from a user's google id
const getIncomingFriendRequests = (userGoogleID, callback) => {
    // get user id from google id
    const getUserID = "(SELECT id FROM users WHERE google_id=?)";
    const getAllRequestorIDs = `(SELECT requestor_id FROM bliss_db.friend_requests WHERE requestee_id=${getUserID})`;
    const queryString = `SELECT username, google_id, google_photo_link FROM users WHERE id IN ${getAllRequestorIDs}`;
    db_1.db.query(queryString, [userGoogleID], (err, result) => {
        if (err) {
            callback(err);
        }
        const rows = result;
        const incomingRequestUsers = [];
        rows.forEach((row) => {
            const incomingRequestUser = {
                username: row.username,
                google_id: row.google_id,
                google_photo_link: row.google_photo_link,
            };
            incomingRequestUsers.push(incomingRequestUser);
        });
        callback(null, incomingRequestUsers);
    });
};
exports.getIncomingFriendRequests = getIncomingFriendRequests;
