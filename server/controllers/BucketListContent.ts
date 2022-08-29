// controller callback functions for CRUD operations on bucket list content
import { db } from "../db";
import { OkPacket, RowDataPacket } from "mysql2";
import { BucketList, BucketListContent } from "../types/content";
import { callbackify } from "util";

export const createBucketList = (
  bucketList: BucketList,
  callback: Function
) => {
  const queryString =
    "INSERT INTO bucket_list_tracker (owner_id, collab_type, privacy_type, created_at, title, description) VALUES (?, ?, ?, ?, ?, ?)";

  db.query(
    queryString,
    [
      bucketList.owner_id,
      bucketList.collab_type,
      bucketList.privacy_type,
      new Date(),
      bucketList.title,
      bucketList.description,
    ],
    (err, result) => {
      if (err) {
        callback(err);
      }

      const insertId = (<OkPacket>result).insertId; // type casting to OkPacket
      callback(null, insertId);
    }
  );
};

export const addActivity = (
  activity: BucketListContent,
  callback: Function
) => {
  const queryString =
    "INSERT INTO bucket_list_content (tracker_id, activity, description, is_completed, user_id, date_added) VALUES (?,?,?,?,?,?)";

  db.query(
    queryString,
    [
      activity.tracker_id,
      activity.activity,
      activity.description,
      activity.is_completed,
      activity.user_id,
      new Date(),
    ],
    (err, result) => {
      if (err) {
        callback(err);
      }

      const insertId = (<OkPacket>result).insertId; // type casting to OkPacket
      callback(null, insertId);
    }
  );
};
