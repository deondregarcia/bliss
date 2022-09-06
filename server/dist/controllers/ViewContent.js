"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIfShared = exports.getPrivacyTypeAndOwner = exports.getActivities = exports.getBucketLists = void 0;
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
            };
            lists.push(list);
        });
        callback(null, lists);
    });
};
exports.getBucketLists = getBucketLists;
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
