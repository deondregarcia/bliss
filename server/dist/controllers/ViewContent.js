"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getListOfFriends = exports.getUserInfo = exports.getFriendsLists = exports.getSharedLists = exports.checkIfShared = exports.getPrivacyTypeAndOwner = exports.getActivities = exports.getBucketListInfo = exports.getBucketLists = void 0;
const db_1 = require("../db");
// view list of all bucket lists user is involved in
const getBucketLists = (googleId, callback) => {
    const getUserQueryString = "SELECT id FROM users WHERE google_id=?";
    // pull from bucket_list_tracker table
    const firstQueryString = `SELECT * FROM bucket_list_tracker WHERE owner_id=(${getUserQueryString}) OR `;
    // query shared_list_users table
    const secondQueryString = `id=(SELECT bucket_list_id FROM bliss_db.shared_list_users WHERE contributor_id=(${getUserQueryString}))`;
    const mainQueryString = firstQueryString + secondQueryString;
    db_1.db.query(mainQueryString, [googleId, googleId], (err, result) => {
        if (err) {
            callback(err);
        }
        const rows = result;
        const lists = [];
        rows.forEach((row) => {
            const list = {
                id: row.id,
                owner_id: row.owner_id,
                privacy_type: row.privacy_type,
                created_at: row.created_at,
                title: row.title,
                description: row.description,
                permissions: row.permissions,
            };
            lists.push(list);
        });
        callback(null, lists);
    });
};
exports.getBucketLists = getBucketLists;
const getBucketListInfo = (trackerID, callback) => {
    const queryString = "SELECT * FROM bucket_list_tracker WHERE id=?";
    db_1.db.query(queryString, trackerID, (err, result) => {
        if (err) {
            console.log(err);
        }
        const bucketListInfo = result;
        callback(null, bucketListInfo[0]);
    });
};
exports.getBucketListInfo = getBucketListInfo;
// view all activities in a bucket list
const getActivities = (trackerId, callback) => {
    const queryString = `SELECT * FROM bucket_list_content WHERE tracker_id=?`;
    db_1.db.query(queryString, trackerId, (err, result) => {
        if (err) {
            callback(err);
        }
        const rows = result;
        const activities = [];
        rows.forEach((row) => {
            const activity = {
                id: row.id,
                tracker_id: row.tracker_id,
                activity: row.activity,
                description: row.description,
                is_completed: row.boolean,
                user_id: row.user_id,
                date_added: row.date_added,
                date_completed: row.date_completed,
            };
            activities.push(activity);
        });
        callback(null, activities);
    });
};
exports.getActivities = getActivities;
// get privacy type of BL based on bucket_list_tracker id
const getPrivacyTypeAndOwner = (trackerID, callback) => {
    const queryString = "SELECT privacy_type, owner_id FROM bucket_list_tracker WHERE id=?";
    db_1.db.query(queryString, trackerID, (err, result) => {
        if (err) {
            callback(err);
        }
        const rows = result;
        const privacyAndOwners = [];
        rows.forEach((row) => {
            const privacyAndOwner = {
                privacy_type: row.privacy_type,
                owner_id: row.owner_id,
                permissions: row.permissions,
            };
            privacyAndOwners.push(privacyAndOwner);
        });
        callback(null, privacyAndOwners);
    });
};
exports.getPrivacyTypeAndOwner = getPrivacyTypeAndOwner;
// given the user's google id, check if user is in shared_list_users
const checkIfShared = (userID, bucketListID, callback) => {
    const queryString = "SELECT * FROM shared_list_users WHERE contributor_id=(SELECT id FROM users WHERE google_id=?) AND bucket_list_id=?";
    db_1.db.query(queryString, [userID, bucketListID], (err, result) => {
        if (err) {
            callback(err);
        }
        const rows = result;
        const sharedListUsers = [];
        rows.forEach((row) => {
            const sharedListUser = {
                id: row.id,
                bucket_list_id: row.bucket_list_id,
                contributor_id: row.contributor_id,
                owner_id: row.owner_id,
            };
            sharedListUsers.push(sharedListUser);
        });
        callback(null, sharedListUsers);
    });
};
exports.checkIfShared = checkIfShared;
// given a friend's Google ID, return all shared lists between user and friend
const getSharedLists = (userGoogleID, friendGoogleID, callback) => {
    // get user ID from Google ID
    const getUserID = "(SELECT id FROM users WHERE google_id=?)";
    // get friend ID from Google ID
    const getFriendID = "(SELECT id FROM users WHERE google_id=?)";
    // select all (contributor_id, owner_id) or (owner_id, contributor_id) pairs for user and friend
    const queryString = `SELECT bucket_list_id FROM shared_list_users WHERE (contributor_id=${getUserID} AND owner_id=${getFriendID}) OR (contributor_id=${getFriendID} AND owner_id=${getUserID})`;
    db_1.db.query(queryString, [userGoogleID, friendGoogleID, friendGoogleID, userGoogleID], (err, result) => {
        if (err) {
            callback(err);
        }
        const rows = result;
        const bucketListIDs = [];
        rows.forEach((row) => {
            const bucketListID = row.bucket_list_id;
            bucketListIDs.push(bucketListID);
        });
        callback(null, bucketListIDs);
    });
};
exports.getSharedLists = getSharedLists;
// get all of friend's public lists, and relevant shared lists
const getFriendsLists = (sharedListArray, friendGoogleID, callback) => {
    // get friend ID from Google ID
    const getFriendID = "(SELECT id FROM users WHERE google_id=?)";
    const queryString = `SELECT * FROM bucket_list_tracker WHERE owner_id=${getFriendID} AND (privacy_type="public_friends" OR privacy_type="public_random" OR id IN (?))`;
    db_1.db.query(queryString, [friendGoogleID, sharedListArray], (err, result) => {
        if (err) {
            callback(err);
        }
        const rows = result;
        const lists = [];
        rows.forEach((row) => {
            const list = {
                id: row.id,
                owner_id: row.owner_id,
                privacy_type: row.privacy_type,
                created_at: row.created_at,
                title: row.title,
                description: row.description,
                permissions: row.permissions,
            };
            lists.push(list);
        });
        callback(null, lists);
    });
};
exports.getFriendsLists = getFriendsLists;
// get user info from database from google ID
const getUserInfo = (googleID, callback) => {
    const queryString = "SELECT * FROM users WHERE google_id=?";
    db_1.db.query(queryString, googleID, (err, result) => {
        if (err) {
            callback(err);
        }
        const userInfo = result;
        callback(null, userInfo);
    });
};
exports.getUserInfo = getUserInfo;
// get list of friends from google id
const getListOfFriends = (userGoogleID, callback) => {
    const getUserID = "(SELECT id FROM users WHERE google_id=?)";
    const queryString = `SELECT username, google_photo_link, google_id FROM bliss_db.users WHERE id IN (SELECT user_id FROM bliss_db.friends WHERE friend_id=${getUserID} UNION SELECT friend_id FROM bliss_db.friends WHERE user_id=${getUserID})`;
    db_1.db.query(queryString, [userGoogleID, userGoogleID], (err, result) => {
        if (err) {
            callback(err);
        }
        const rows = result;
        const friends = [];
        rows.forEach((row) => {
            const friend = {
                username: row.username,
                google_photo_link: row.google_photo_link,
                google_id: row.google_id,
            };
            friends.push(friend);
        });
        callback(null, friends);
    });
};
exports.getListOfFriends = getListOfFriends;
