"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateActivity = exports.addActivity = exports.createBucketList = void 0;
// controller callback functions for CRUD operations on bucket list content
const db_1 = require("../db");
// creates the bucket list tracker
const createBucketList = (bucketList, callback) => {
    const queryString = "INSERT INTO bucket_list_tracker (owner_id, collab_type, privacy_type, created_at, title, description) VALUES (?, ?, ?, ?, ?, ?)";
    db_1.db.query(queryString, [
        bucketList.owner_id,
        bucketList.privacy_type,
        new Date(),
        bucketList.title,
        bucketList.description,
    ], (err, result) => {
        if (err) {
            callback(err);
        }
        const insertId = result.insertId; // type casting to OkPacket
        callback(null, insertId);
    });
};
exports.createBucketList = createBucketList;
// adds new activity to a bucket list corresponding to bucket_list_tracker; is_completed should be set to 0 and date_added is NULL by default
const addActivity = (activity, callback) => {
    const queryString = "INSERT INTO bucket_list_content (tracker_id, activity, description, is_completed, user_id, date_added) VALUES (?,?,?,?,?,?)";
    db_1.db.query(queryString, [
        activity.tracker_id,
        activity.activity,
        activity.description,
        activity.is_completed,
        activity.user_id,
        new Date(),
    ], (err, result) => {
        if (err) {
            callback(err);
        }
        const insertId = result.insertId; // type casting to OkPacket
        callback(null, insertId);
    });
};
exports.addActivity = addActivity;
// update an activity's description (but not is_completed status) in a bucket list
const updateActivity = (newActivity, callback) => {
    const queryString = "UPDATE bucket_list_content SET activity=?, description=? WHERE id=?";
    db_1.db.query(queryString, [newActivity.activity, newActivity.description, newActivity.id], (err, result) => {
        if (err) {
            callback(err);
        }
        const insertId = result.insertId;
        callback(null, insertId);
    });
};
exports.updateActivity = updateActivity;
