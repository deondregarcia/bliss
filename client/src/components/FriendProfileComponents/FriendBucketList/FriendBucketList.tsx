import React from "react";
import "./FriendBucketList.css";
import { BucketListType } from "../../../types/content";
import { useNavigate } from "react-router-dom";

const FriendBucketList = ({ bucketList }: { bucketList: BucketListType }) => {
  const navigate = useNavigate();

  return (
    <div className="friend-bucket-list-wrapper">
      <div
        onClick={() => navigate(`../../bucket-list/${bucketList.id}`)}
        className="friend-bucket-list-container"
      >
        <h1 className="friend-bucket-list-title">{bucketList.title}</h1>
        <p className="friend-bucket-list-text">
          Description: {bucketList.description}
        </p>
      </div>
    </div>
  );
};

export default FriendBucketList;
