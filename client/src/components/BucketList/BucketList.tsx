import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineShareAlt } from "react-icons/ai";
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
  userID,
  triggerRefresh,
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
  userID: number;
  triggerRefresh: boolean;
}) => {
  const [viewState, setViewState] = useState(false);
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

  const handleBucketListEdit = () => {
    setArrayObject(bucketList);
    setContributorUserObjectsArray(localContributorUserObjects);
    setEditMode(true);
  };

  // copy to clipboard and alert confirmation
  const handleCopy = () => {
    navigator.clipboard.writeText(
      `localhost:3001/bucket-list/${bucketList.id}`
    );
    alert("Copied bucket list link to clipboard!");
  };

  return (
    <div className="bucket-list-wrapper">
      {bucketList.privacy_type === "public_random" && (
        <div onClick={handleCopy} className="bucket-list-public-share-button">
          <h2>Share</h2>
          <AiOutlineShareAlt size={20} />
        </div>
      )}
      {userID === bucketList.owner_id ? (
        <div onClick={handleBucketListEdit} className="bucket-list-edit-button">
          <h2>Edit</h2>
        </div>
      ) : (
        <h3 className="bucket-list-owner-text">
          Owned by{" "}
          {
            friends?.filter(
              (friend) => friend.user_id === bucketList.owner_id
            )[0]?.first_name
          }
        </h3>
      )}
      {/* display privacy types and copy to clipboard option if public_random */}
      {bucketList.privacy_type === "public_random" ? (
        <div className="bucket-list-privacy-type">
          <h4>Anyone can view</h4>
        </div>
      ) : bucketList.privacy_type === "public_friends" ? (
        <div className="bucket-list-privacy-type">
          <h4>Friends can view</h4>
        </div>
      ) : bucketList.privacy_type === "shared" ? (
        <div
          onClick={() => setViewState(!viewState)}
          className="bucket-list-privacy-type-shared"
        >
          <h4>View shared users</h4>
          {/* view shared users overlay */}
          {viewState && (
            <div className="bucket-list-shared-users-overlay">
              {localContributorUserObjects.length > 0 ? (
                localContributorUserObjects.map((user, index) => {
                  return (
                    <p key={index}>
                      {user.first_name} {user.last_name[0]}
                    </p>
                  );
                })
              ) : (
                <p>Shared with no one</p>
              )}
            </div>
          )}
        </div>
      ) : (
        // else privacyType === "private"
        <div className="bucket-list-privacy-type">
          <h4>Private</h4>
        </div>
      )}

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
