// controller callback functions for CRUD operations on bucket list content
import { db } from "../db";
import { OkPacket, RowDataPacket } from "mysql2";
import {
  ActivityIDTypes,
  BucketList,
  BucketListContent,
} from "../types/content";
import { Axios } from "axios";

// creates the bucket list tracker
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

// adds new activity to a bucket list corresponding to bucket_list_tracker; is_completed should be set to 0 and date_added is NULL by default
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

export const deleteActivity = (
  activityIDs: ActivityIDTypes,
  callback: Function
) => {
  const queryString =
    "DELETE FROM bucket_list_content WHERE tracker_id=? AND id=?";

  db.query(
    queryString,
    [activityIDs.trackerID, activityIDs.contentID],
    (err, result) => {
      if (err) {
        callback(err);
      }

      const insertID = (<OkPacket>result).insertId;
      callback(null, insertID);
    }
  );
};

// update an activity's description (but not is_completed status) in a bucket list
export const updateActivity = (
  newActivity: BucketListContent,
  callback: Function
) => {
  const queryString =
    "UPDATE bucket_list_content SET activity=?, description=? WHERE id=?";

  db.query(
    queryString,
    [newActivity.activity, newActivity.description, newActivity.id],
    (err, result) => {
      if (err) {
        callback(err);
      }

      const insertId = (<OkPacket>result).insertId;
      callback(null, insertId);
    }
  );
};
