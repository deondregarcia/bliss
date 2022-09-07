import { db } from "../db";
import { OkPacket, RowDataPacket } from "mysql2";
import {
  BucketList,
  BucketListContent,
  PrivacyAndOwnerType,
  SharedListUserType,
} from "../types/content";

// view list of all bucket lists user is involved in
export const getBucketLists = (googleId: string, callback: Function) => {
  const getUserQueryString = "SELECT id FROM users WHERE google_id=?";
  // pull from bucket_list_tracker table
  const firstQueryString = `SELECT * FROM bucket_list_tracker WHERE owner_id=(${getUserQueryString}) OR `;
  // query shared_list_users table
  const secondQueryString = `id=(SELECT bucket_list_id FROM bliss_db.shared_list_users WHERE contributor_id=(${getUserQueryString}))`;
  const mainQueryString = firstQueryString + secondQueryString;

  db.query(mainQueryString, [googleId, googleId], (err, result) => {
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
        permissions: row.permissions,
      };
      lists.push(list);
    });
    callback(null, lists);
  });
};

export const getBucketListInfo = (trackerID: number, callback: Function) => {
  const queryString = "SELECT * FROM bucket_list_tracker WHERE id=?";

  db.query(queryString, trackerID, (err, result) => {
    if (err) {
      console.log(err);
    }

    const bucketListInfo = <RowDataPacket>result;
    callback(null, bucketListInfo[0]);
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

// get privacy type of BL based on bucket_list_tracker id
export const getPrivacyTypeAndOwner = (
  trackerID: number,
  callback: Function
) => {
  const queryString =
    "SELECT privacy_type, owner_id FROM bucket_list_tracker WHERE id=?";

  db.query(queryString, trackerID, (err, result) => {
    if (err) {
      callback(err);
    }

    const rows = <RowDataPacket[]>result;
    const privacyAndOwners: PrivacyAndOwnerType[] = [];
    rows.forEach((row) => {
      const privacyAndOwner: PrivacyAndOwnerType = {
        privacy_type: row.privacy_type,
        owner_id: row.owner_id,
        permissions: row.permissions,
      };
      privacyAndOwners.push(privacyAndOwner);
    });
    callback(null, privacyAndOwners);
  });
};

// given the user's google id, check if user is in shared_list_users
export const checkIfShared = (
  userID: string,
  bucketListID: number,
  callback: Function
) => {
  const queryString =
    "SELECT * FROM shared_list_users WHERE contributor_id=(SELECT id FROM users WHERE google_id=?) AND bucket_list_id=?";

  db.query(queryString, [userID, bucketListID], (err, result) => {
    if (err) {
      callback(err);
    }

    const rows = <RowDataPacket[]>result;
    const sharedListUsers: SharedListUserType[] = [];
    rows.forEach((row) => {
      const sharedListUser: SharedListUserType = {
        id: row.id,
        bucket_list_id: row.bucket_list_id,
        contributor_id: row.contributor_id,
        owner_id: row.owner_id,
      };
      sharedListUsers.push(sharedListUser);
    });
    callback(null, sharedListUsers);
  });
};

// given a friend's Google ID, return all shared lists between user and friend
export const getSharedLists = (
  userGoogleID: string,
  friendGoogleID: string,
  callback: Function
) => {
  // get user ID from Google ID
  const getUserID = "(SELECT id FROM users WHERE google_id=?)";

  // get friend ID from Google ID
  const getFriendID = "(SELECT id FROM users WHERE google_id=?)";

  // select all (contributor_id, owner_id) or (owner_id, contributor_id) pairs for user and friend
  const queryString = `SELECT bucket_list_id FROM shared_list_users WHERE (contributor_id=${getUserID} AND owner_id=${getFriendID}) OR (contributor_id=${getFriendID} AND owner_id=${getUserID})`;

  db.query(
    queryString,
    [userGoogleID, friendGoogleID, friendGoogleID, userGoogleID],
    (err, result) => {
      if (err) {
        callback(err);
      }

      const rows = <RowDataPacket[]>result;
      const bucketListIDs: number[] = [];
      rows.forEach((row) => {
        const bucketListID: number = row.bucket_list_id;
        bucketListIDs.push(bucketListID);
      });
      callback(null, bucketListIDs);
    }
  );
};

// get all of friend's public lists, and relevant shared lists
export const getFriendsLists = (
  sharedListArray: number[],
  friendGoogleID: string,
  callback: Function
) => {
  // get friend ID from Google ID
  const getFriendID = "(SELECT id FROM users WHERE google_id=?)";

  const queryString = `SELECT * FROM bucket_list_tracker WHERE owner_id=${getFriendID} AND (privacy_type="public_friends" OR privacy_type="public_random" OR id IN (?))`;

  console.log(db.format(queryString, [friendGoogleID, sharedListArray]));

  db.query(queryString, [friendGoogleID, sharedListArray], (err, result) => {
    if (err) {
      callback(err);
    }

    console.log(result);
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
        permissions: row.permissions,
      };
      lists.push(list);
    });
    callback(null, lists);
  });
};

// get user info from database from google ID
export const getUserInfo = (googleID: string, callback: Function) => {
  const queryString = "SELECT * FROM users WHERE google_id=?";

  db.query(queryString, googleID, (err, result) => {
    if (err) {
      callback(err);
    }

    const userInfo = <RowDataPacket>result;
    callback(null, userInfo);
  });
};
