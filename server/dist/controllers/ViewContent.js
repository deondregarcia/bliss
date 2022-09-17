"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecentFriendActivities = exports.getUserList = exports.getListOfFriends = exports.getUserInfo = exports.getFriendsLists = exports.getAllContributors = exports.getSharedListUsers = exports.getSharedLists = exports.checkIfShared = exports.getPrivacyTypeAndOwner = exports.getActivities = exports.getBucketListInfo = exports.getPublicBucketLists = exports.getBucketLists = void 0;
const db_1 = require("../db");
// view list of all bucket lists user is involved in
const getBucketLists = (googleId, callback) => {
    const getUserQueryString = "SELECT id FROM users WHERE google_id=?";
    // pull from bucket_list_tracker table
    const firstQueryString = `SELECT * FROM bucket_list_tracker WHERE owner_id=(${getUserQueryString}) OR `;
    // query shared_list_users table
    const secondQueryString = `id IN (SELECT bucket_list_id FROM shared_list_users WHERE contributor_id=(${getUserQueryString}))`;
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
// get all public_random bucket lists for non-friend profile pages
const getPublicBucketLists = (userGoogleID, callback) => {
    const getUserQueryString = "(SELECT id FROM users WHERE google_id=?)";
    // get only public bucket lists
    const queryString = `SELECT * FROM bucket_list_tracker WHERE owner_id=${getUserQueryString} AND privacy_type=?`;
    db_1.db.query(queryString, [userGoogleID, "public_random"], (err, result) => {
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
exports.getPublicBucketLists = getPublicBucketLists;
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
    // select all bucket_list_id's where either friend or user is the contributor_id and the other is the owner of the bucket list
    const queryString = `SELECT bucket_list_id FROM shared_list_users WHERE (contributor_id=${getUserID} AND bucket_list_id IN (SELECT id FROM bucket_list_tracker WHERE owner_id=${getFriendID})) OR (contributor_id=${getFriendID} AND bucket_list_id IN (SELECT id FROM bucket_list_tracker WHERE owner_id=${getUserID}))`;
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
// get all users in shared_list_users
const getSharedListUsers = (trackerID, callback) => {
    const queryString = "SELECT contributor_id FROM shared_list_users WHERE bucket_list_id=?";
    db_1.db.query(queryString, trackerID, (err, result) => {
        if (err) {
            callback(err);
        }
        const rows = result;
        const contributorIDs = [];
        rows.forEach((row) => {
            const contributorID = row.contributor_id;
            contributorIDs.push(contributorID);
        });
        callback(null, contributorIDs);
    });
};
exports.getSharedListUsers = getSharedListUsers;
// get all contributor's for all of user's owned, shared bucket lists
const getAllContributors = (userGoogleID, callback) => {
    const getUserID = "(SELECT id FROM users WHERE google_id=?)";
    const getRelevantBucketListIDs = `(SELECT id FROM bucket_list_tracker WHERE owner_id=${getUserID})`;
    const queryString = `SELECT bucket_list_id, contributor_id FROM shared_list_users WHERE bucket_list_id IN ${getRelevantBucketListIDs}`;
    db_1.db.query(queryString, userGoogleID, (err, result) => {
        if (err) {
            callback(err);
        }
        const rows = result;
        const contributorObjects = [];
        rows.forEach((row) => {
            const contributorObject = {
                bucket_list_id: row.bucket_list_id,
                contributor_id: row.contributor_id,
            };
            contributorObjects.push(contributorObject);
        });
        callback(null, contributorObjects);
    });
};
exports.getAllContributors = getAllContributors;
// get all of friend's public lists, and relevant shared lists
const getFriendsLists = (sharedListArray, friendGoogleID, callback) => {
    // get friend ID from Google ID
    const getFriendID = "(SELECT id FROM users WHERE google_id=?)";
    const queryString = `SELECT * FROM bucket_list_tracker WHERE owner_id=${getFriendID} AND (privacy_type="public_friends" OR privacy_type="public_random") OR id IN (?)`;
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
    const queryString = `SELECT username, first_name, last_name, google_photo_link, google_id, id, wants_to FROM users WHERE id IN (SELECT user_id FROM friends WHERE friend_id=${getUserID} UNION SELECT friend_id FROM friends WHERE user_id=${getUserID})`;
    db_1.db.query(queryString, [userGoogleID, userGoogleID], (err, result) => {
        if (err) {
            callback(err);
        }
        const rows = result;
        const friends = [];
        rows.forEach((row) => {
            const friend = {
                username: row.username,
                first_name: row.first_name,
                last_name: row.last_name,
                google_photo_link: row.google_photo_link,
                google_id: row.google_id,
                user_id: row.id,
                wants_to: row.wants_to,
            };
            friends.push(friend);
        });
        callback(null, friends);
    });
};
exports.getListOfFriends = getListOfFriends;
// get full list of users, excluding current user
const getUserList = (userGoogleID, callback) => {
    // get user id from google id
    const getUserID = "(SELECT id FROM users WHERE google_id=?)";
    const queryString = `SELECT username, first_name, last_name, google_id, google_photo_link FROM users WHERE NOT id=${getUserID}`;
    db_1.db.query(queryString, userGoogleID, (err, result) => {
        if (err) {
            callback(err);
        }
        const rows = result;
        const userList = [];
        rows.forEach((row) => {
            const user = {
                username: row.username,
                first_name: row.first_name,
                google_id: row.google_id,
                google_photo_link: row.google_photo_link,
            };
            userList.push(user);
        });
        callback(null, userList);
    });
};
exports.getUserList = getUserList;
// get user's friends' recent activities
const getRecentFriendActivities = (userGoogleID, callback) => {
    // get list of user's friends first
    const getUserID = "(SELECT id FROM users WHERE google_id=?)";
    const getFriendsQueryString = `(SELECT user_id FROM friends WHERE friend_id=${getUserID} UNION SELECT friend_id FROM friends WHERE user_id=${getUserID})`;
    const getPermittedTrackerIDs = `(SELECT id FROM bucket_list_tracker WHERE privacy_type IN ("public_random", "public_friends") OR id IN (SELECT bucket_list_id FROM shared_list_users WHERE contributor_id=${getUserID}) OR owner_id=${getUserID})`;
    const mainQueryString = `SELECT * FROM bucket_list_content WHERE user_id IN ${getFriendsQueryString} AND tracker_id IN ${getPermittedTrackerIDs} ORDER BY date_added DESC, id DESC LIMIT 10`;
    db_1.db.query(mainQueryString, [userGoogleID, userGoogleID, userGoogleID, userGoogleID], (err, result) => {
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
exports.getRecentFriendActivities = getRecentFriendActivities;
