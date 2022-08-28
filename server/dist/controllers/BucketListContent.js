"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBucketList = void 0;
// controller callback functions for CRUD operations on bucket list content
const db_1 = require("../db");
const createBucketList = (bucketList, callback) => {
    const queryString = "INSERT INTO bucket_list_tracker (owner_id, collab_type, privacy_type, created_at, title, description) VALUES (?, ?, ?, ?, ?, ?)";
    db_1.db.query(queryString, [bucketList.owner_id, bucketList.collab_type, bucketList.privacy_type, "CURDATE()", bucketList.title, bucketList.description], (err, result) => {
        if (err) {
            callback(err);
        }
        const insertId = result.insertId; // type casting to OkPacket
        callback(null, insertId);
    });
};
exports.createBucketList = createBucketList;
// export const addActivity = (activity: BucketListContent) => {
//     const queryString = "INSERT INTO "
// }
