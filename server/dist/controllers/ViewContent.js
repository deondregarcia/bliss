"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findBucketLists = void 0;
const db_1 = require("../db");
// view list of all bucket lists user is involved in
const findBucketLists = (userId, callback) => {
    console.log(userId);
    const queryString = `SELECT * FROM bucket_list_tracker WHERE owner_id=${userId}`;
    db_1.db.query(queryString, (err, result) => {
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
exports.findBucketLists = findBucketLists;
