import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BucketListType,
  FriendListType,
  SharedListUserType,
} from "../../types/content";
import "./BucketList.css";

const BucketList = ({
  bucketList,
  setArrayObject,
  setEditMode,
  contributorObjects,
  friends,
  setContributorUserObjectsArray,
  privacyType,
}: {
  bucketList: BucketListType;
  setArrayObject: React.Dispatch<React.SetStateAction<BucketListType | null>>;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  contributorObjects: SharedListUserType[];
  friends: FriendListType[];
  setContributorUserObjectsArray: React.Dispatch<
    React.SetStateAction<FriendListType[]>
  >;
  privacyType: string;
}) => {
  const navigate = useNavigate();
  let friendList: number[] = [];
  let contributorUserIDs: number[] = [];
  // this sets the contributor objects locally, per the respective Bucket List
  let localContributorUserObjects: FriendListType[] = [];

  if (privacyType === "shared") {
    for (let i = 0; i < friends.length; i++) {
      friendList.push(friends[i].user_id);
    }

    for (let i = 0; i < contributorObjects.length; i++) {
      if (contributorObjects[i].bucket_list_id === bucketList.id) {
        contributorUserIDs.push(contributorObjects[i].contributor_id);
      }
    }

    // this sets the contributor objects locally, per the respective Bucket List
    localContributorUserObjects = friends.filter((friend) => {
      if (contributorUserIDs.includes(friend.user_id)) {
        return friend;
      }
    });
  }

  console.log("log from BucketList");
  console.log(localContributorUserObjects);

  const handleBucketListEdit = () => {
    setArrayObject(bucketList);
    setContributorUserObjectsArray(localContributorUserObjects);
    setEditMode(true);
  };

  return (
    <div className="bucket-list-wrapper">
      <div onClick={handleBucketListEdit} className="bucket-list-edit-button">
        <h2>Edit</h2>
      </div>
      <div
        onClick={() => navigate(`../../bucket-list/${bucketList.id}`)}
        className="bucket-list-container"
      >
        <h1 className="bucket-list-title">{bucketList.title}</h1>
        <p className="bucket-list-text">
          Description: {bucketList.description}
        </p>
      </div>
    </div>
  );
};

export default BucketList;
