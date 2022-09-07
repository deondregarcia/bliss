"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBucketList = exports.updateActivity = exports.deleteBucketList = exports.deleteActivity = exports.addActivity = exports.createBucketList = void 0;
// controller callback functions for CRUD operations on bucket list content
const db_1 = require("../db");
// creates the bucket list tracker
const createBucketList = (bucketList, callback) => {
    const getUserIDQueryString = "(SELECT id FROM users WHERE google_id=?)";
    const queryString = `INSERT INTO bucket_list_tracker (owner_id, privacy_type, created_at, title, description, permissions) VALUES (${getUserIDQueryString}, ?, ?, ?, ?, ?)`;
    db_1.db.query(queryString, [
        bucketList.google_id,
        bucketList.privacy_type,
        new Date(),
        bucketList.title,
        bucketList.description,
        bucketList.permissions,
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
const deleteActivity = (activityIDs, callback) => {
    const queryString = "DELETE FROM bucket_list_content WHERE tracker_id=? AND id=?";
    db_1.db.query(queryString, [activityIDs.trackerID, activityIDs.contentID], (err, result) => {
        if (err) {
            callback(err);
        }
        const insertID = result.insertId;
        callback(null, insertID);
    });
};
exports.deleteActivity = deleteActivity;
const deleteBucketList = (trackerID, callback) => {
    const queryString = "DELETE FROM bucket_list_tracker WHERE id=?";
    db_1.db.query(queryString, trackerID, (err, result) => {
        if (err) {
            callback(err);
        }
        const insertId = result.insertId;
        callback(null, insertId);
    });
};
exports.deleteBucketList = deleteBucketList;
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
// update a bucket list's info (privacy type, title, description, and/or permissions)
const updateBucketList = (updatedBucketList, callback) => {
    const queryString = "UPDATE bucket_list_tracker SET privacy_type=?, title=?, description=?, permissions=? WHERE id=?";
    db_1.db.query(queryString, [
        updatedBucketList.privacy_type,
        updatedBucketList.title,
        updatedBucketList.description,
        updatedBucketList.permissions,
        updatedBucketList.id,
    ], (err, result) => {
        if (err) {
            callback(err);
        }
        const updateID = result.insertId;
        callback(null, updateID);
    });
};
exports.updateBucketList = updateBucketList;
