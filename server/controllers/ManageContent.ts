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
  const getUserIDQueryString = "(SELECT id FROM users WHERE google_id=?)";
  const queryString = `INSERT INTO bucket_list_tracker (owner_id, privacy_type, created_at, title, description, permissions) VALUES (${getUserIDQueryString}, ?, ?, ?, ?, ?)`;

  db.query(
    queryString,
    [
      bucketList.google_id,
      bucketList.privacy_type,
      new Date(),
      bucketList.title,
      bucketList.description,
      bucketList.permissions,
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

export const deleteBucketList = (trackerID: number, callback: Function) => {
  const queryString = "DELETE FROM bucket_list_tracker WHERE id=?";

  db.query(queryString, trackerID, (err, result) => {
    if (err) {
      callback(err);
    }

    const insertId = (<OkPacket>result).insertId;
    callback(null, insertId);
  });
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

// update a bucket list's info (privacy type, title, description, and/or permissions)
export const updateBucketList = (
  updatedBucketList: BucketList,
  callback: Function
) => {
  const queryString =
    "UPDATE bucket_list_tracker SET privacy_type=?, title=?, description=?, permissions=? WHERE id=?";

  db.query(
    queryString,
    [
      updatedBucketList.privacy_type,
      updatedBucketList.title,
      updatedBucketList.description,
      updatedBucketList.permissions,
      updatedBucketList.id,
    ],
    (err, result) => {
      if (err) {
        callback(err);
      }

      const updateID = (<OkPacket>result).insertId;
      callback(null, updateID);
    }
  );
};

// add various users to shared_list_users from supplied user ID's
export const addSharedListUsers = (
  convertedArray: number[][],
  callback: Function
) => {
  const queryString =
    "INSERT INTO shared_list_users (bucket_list_id, contributor_id, owner_id) VALUES ?";

  // using converted array for bulk insertion
  db.query(queryString, [convertedArray], (err, result) => {
    if (err) {
      callback(err);
    }

    const insertID = (<OkPacket>result).insertId;
    callback(null, insertID);
  });
};

// remove various users to shared_list_users from supplied user ID's
export const removeSharedListUsers = (
  convertedArray: number[][],
  callback: Function
) => {
  const queryString =
    "DELETE FROM shared_list_users WHERE (bucket_list_id, contributor_id) IN ?";

  // using converted array for bulk insertion; this converted array needs an extra wrapped array to work
  db.query(queryString, [[convertedArray]], (err, result) => {
    if (err) {
      callback(err);
    }

    const insertID = (<OkPacket>result).insertId;
    callback(null, insertID);
  });
};

// update google photo based on google id since you can't select "FROM" the table you're updating
export const updateGooglePhoto = (
  userGoogleID: string,
  googlePhotoLink: string,
  callback: Function
) => {
  const queryString = "UPDATE users SET google_photo_link=? WHERE google_id=?";

  db.query(queryString, [googlePhotoLink, userGoogleID], (err, result) => {
    if (err) {
      callback(err);
    }

    const insertID = (<OkPacket>result).insertId;
    callback(null, insertID);
  });
};
