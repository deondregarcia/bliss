import { db } from "../db";
import { OkPacket, RowDataPacket } from "mysql2";
import { BucketList, BucketListContent } from "../types/content";

// view list of all bucket lists user is involved in
export const getBucketLists = (googleId: string, callback: Function) => {
  const getUserQueryString = "SELECT id FROM users WHERE google_id=?";
  const queryString = `SELECT * FROM bucket_list_tracker WHERE owner_id=(${getUserQueryString})`;

  db.query(queryString, googleId, (err, result) => {
    if (err) {
      callback(err);
    }

    const rows = <RowDataPacket[]>result;
    const lists: BucketList[] = [];

    rows.forEach((row) => {
      const list: BucketList = {
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

// view all activities in a bucket list
export const getActivities = (trackerId: number, callback: Function) => {
  const queryString = `SELECT * FROM bucket_list_content WHERE tracker_id=?`;

  db.query(queryString, trackerId, (err, result) => {
    if (err) {
      callback(err);
    }

    const rows = <RowDataPacket[]>result;
    const activities: BucketListContent[] = [];

    rows.forEach((row) => {
      const activity: BucketListContent = {
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
