"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateWantsTo = exports.updateGooglePhoto = exports.checkIfFriendWithUserID = exports.checkIfFriend = exports.getUserID = exports.getIncomingFriendRequests = exports.getOutgoingFriendRequests = exports.denyRequest = exports.acceptRequest = exports.sendFriendRequest = exports.checkUsername = exports.createUser = void 0;
const db_1 = require("../db");
const createUser = (newUser, callback) => {
    const queryString = "INSERT INTO users (username, first_name, last_name, created_at, google_id, wants_to) VALUES (?,?,?,?,?,?)";
    db_1.db.query(queryString, [
        newUser.username,
        newUser.first_name,
        newUser.last_name,
        newUser.created_at,
        newUser.google_id,
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
    const getAllRequesteeIDs = `(SELECT requestee_id FROM friend_requests WHERE requestor_id=${getUserID})`;
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
    const getAllRequestorIDs = `(SELECT requestor_id FROM friend_requests WHERE requestee_id=${getUserID})`;
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
// gets user id from the google id
const getUserID = (userGoogleID, callback) => {
    const queryString = "SELECT id FROM users WHERE google_id=?";
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
    const queryStringOne = "SELECT * FROM friends WHERE ";
    // check if (user_id, friend_id) exists
    const queryStringTwo = "(user_id=(SELECT id FROM users WHERE google_id=?) AND friend_id=(SELECT id FROM users WHERE google_id=?))";
    // check if "OR" (friend_id, user_id) exists
    const queryStringThree = " OR (user_id=(SELECT id FROM users WHERE google_id=?) AND friend_id=(SELECT id FROM users WHERE google_id=?))";
    // combine all query strings
    const mainQueryString = queryStringOne + queryStringTwo + queryStringThree;
    db_1.db.query(mainQueryString, [reqUserID, urlID, urlID, reqUserID], (err, result) => {
        if (err) {
            callback(err);
        }
        // there should only be one, so add a check for this later
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
    const queryStringOne = "SELECT * FROM friends WHERE ";
    // check if (user_id, friend_id) exists
    const queryStringTwo = "(user_id=(SELECT id FROM users WHERE google_id=?) AND friend_id=?)";
    // check if "OR" (friend_id, user_id) exists
    const queryStringThree = " OR (user_id=? AND friend_id=(SELECT id FROM users WHERE google_id=?))";
    // combine all query strings
    const mainQueryString = queryStringOne + queryStringTwo + queryStringThree;
    db_1.db.query(mainQueryString, [reqUserGoogleID, secondID, secondID, reqUserGoogleID], (err, result) => {
        if (err) {
            callback(err);
        }
        // there should only be one, so add a check for this later
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
// update google photo based on google id since you can't select "FROM" the table you're updating
const updateGooglePhoto = (userGoogleID, googlePhotoLink, callback) => {
    const queryString = "UPDATE users SET google_photo_link=? WHERE google_id=?";
    db_1.db.query(queryString, [googlePhotoLink, userGoogleID], (err, result) => {
        if (err) {
            callback(err);
        }
        const insertID = result.insertId;
        callback(null, insertID);
    });
};
exports.updateGooglePhoto = updateGooglePhoto;
const updateWantsTo = (userGoogleID, wantsToText, callback) => {
    const queryString = "UPDATE users SET wants_to=? WHERE google_id=?";
    console.log(db_1.db.format(queryString, [userGoogleID, wantsToText]));
    db_1.db.query(queryString, [wantsToText, userGoogleID], (err, result) => {
        if (err) {
            callback(err);
        }
        console.log(result);
        const insertID = result.insertId;
        callback(null, insertID);
    });
};
exports.updateWantsTo = updateWantsTo;
