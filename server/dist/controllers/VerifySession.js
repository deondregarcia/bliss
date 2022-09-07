"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIfFriendWithUserID = exports.checkIfFriend = exports.getUserID = exports.verifySession = void 0;
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
// gets user id from the google id
const getUserID = (userGoogleID, callback) => {
    const queryString = "SELECT id FROM bliss_db.users WHERE google_id=?";
    db_1.db.query(queryString, userGoogleID, (err, result) => {
        if (err) {
            console.log(err);
        }
        const userID = result;
        callback(null, userID);
    });
};
exports.getUserID = getUserID;
// check if ID in url user is navigating to, is a friend of logged in user
const checkIfFriend = (reqUserID, urlID, callback) => {
    // friends table is [id, user_id, friend_id] so must check if (user_id, friend_id) OR (friend_id, user_id) exists
    const queryStringOne = "SELECT * FROM bliss_db.friends WHERE ";
    // check if (user_id, friend_id) exists
    const queryStringTwo = "(user_id=(SELECT id FROM bliss_db.users WHERE google_id=?) AND friend_id=(SELECT id FROM bliss_db.users WHERE google_id=?))";
    // check if "OR" (friend_id, user_id) exists
    const queryStringThree = " OR (user_id=(SELECT id FROM bliss_db.users WHERE google_id=?) AND friend_id=(SELECT id FROM bliss_db.users WHERE google_id=?))";
    // combine all query strings
    const mainQueryString = queryStringOne + queryStringTwo + queryStringThree;
    // console.log(mainQueryString);
    // mainQueryString params array will be [user_id, friend_id, friend_id, user_id] where we will arbitrarily make reqSessionID = user_id and urlID = friend_id
    // console.log(db.format(mainQueryString, [reqUserID, urlID, urlID, reqUserID]));
    db_1.db.query(mainQueryString, [reqUserID, urlID, urlID, reqUserID], (err, result) => {
        if (err) {
            callback(err);
        }
        // there should only be one, so add a check for this later
        // console.log(result);
        const rows = result;
        const friendPairs = [];
        rows.forEach((row) => {
            const friendPair = {
                friend_one_id: row.user_id,
                friend_two_id: row.friend_id,
            };
            friendPairs.push(friendPair);
        });
        callback(null, friendPairs);
    });
};
exports.checkIfFriend = checkIfFriend;
const checkIfFriendWithUserID = (reqUserGoogleID, secondID, callback) => {
    // friends table is [id, user_id, friend_id] so must check if (user_id, friend_id) OR (friend_id, user_id) exists
    const queryStringOne = "SELECT * FROM bliss_db.friends WHERE ";
    // check if (user_id, friend_id) exists
    const queryStringTwo = "(user_id=(SELECT id FROM bliss_db.users WHERE google_id=?) AND friend_id=?)";
    // check if "OR" (friend_id, user_id) exists
    const queryStringThree = " OR (user_id=? AND friend_id=(SELECT id FROM bliss_db.users WHERE google_id=?))";
    // combine all query strings
    const mainQueryString = queryStringOne + queryStringTwo + queryStringThree;
    // console.log(mainQueryString);
    // mainQueryString params array will be [user_id, friend_id, friend_id, user_id] where we will arbitrarily make reqSessionID = user_id and urlID = friend_id
    // console.log(db.format(mainQueryString, [reqUserGoogleID, secondID, secondID, reqUserGoogleID]));
    db_1.db.query(mainQueryString, [reqUserGoogleID, secondID, secondID, reqUserGoogleID], (err, result) => {
        if (err) {
            callback(err);
        }
        // there should only be one, so add a check for this later
        // console.log(result);
        const rows = result;
        const friendPairs = [];
        rows.forEach((row) => {
            const friendPair = {
                friend_one_id: row.user_id,
                friend_two_id: row.friend_id,
            };
            friendPairs.push(friendPair);
        });
        callback(null, friendPairs);
    });
};
exports.checkIfFriendWithUserID = checkIfFriendWithUserID;
