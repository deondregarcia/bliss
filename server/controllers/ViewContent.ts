import { db } from "../db";
import { OkPacket, RowDataPacket } from "mysql2";
import { BucketList, BucketListContent } from "../types/content";

// view list of all bucket lists user is involved in
export const findBucketLists = (userId: number, callback: Function) => {
  console.log(userId);
  const queryString = `SELECT * FROM bucket_list_tracker WHERE owner_id=${userId}`;

  db.query(queryString, (err, result) => {
    if (err) {
      callback(err);
    }

    const rows = <RowDataPacket[]>result;
    const lists: BucketList[] = [];

    rows.forEach((row) => {
      const list: BucketList = {
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
