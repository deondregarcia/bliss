"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActivities = exports.getBucketLists = void 0;
const db_1 = require("../db");
// view list of all bucket lists user is involved in
const getBucketLists = (userId, callback) => {
    const queryString = `SELECT * FROM bucket_list_tracker WHERE owner_id=?`;
    db_1.db.query(queryString, userId, (err, result) => {
        if (err) {
            callback(err);
        }
        const rows = result;
        const lists = [];
        rows.forEach((row) => {
            const list = {
                id: row.id,
                owner_id: row.owner_id,
                collab_type: row.collab_type,
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
