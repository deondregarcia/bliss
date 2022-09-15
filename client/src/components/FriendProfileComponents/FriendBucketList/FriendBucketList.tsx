import React from "react";
import "./FriendBucketList.css";
import { BucketListType, UserType } from "../../../types/content";
import { useNavigate } from "react-router-dom";

const FriendBucketList = ({
  bucketList,
  userObject,
}: {
  bucketList: BucketListType;
  userObject: UserType;
}) => {
  const navigate = useNavigate();

  return (
    <div className="friend-bucket-list-wrapper">
      {/* if friend is owner of bucket list, display so, otherwise display that user is owner */}
      {bucketList?.privacy_type === "shared" &&
        (bucketList?.owner_id === userObject?.id ? (
          <h3 className="friend-bucket-list-owner-text">
            Owned by {userObject?.first_name}
          </h3>
        ) : (
          <h3 className="friend-bucket-list-owner-text">Owned by you.</h3>
        ))}
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
