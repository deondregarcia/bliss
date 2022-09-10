import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BucketListType, UserType } from "../../types/content";
import Axios from "axios";
import EmptyArrayMessage from "../../components/EmptyArrayMessage/EmptyArrayMessage";
import FriendProfileContentContainerHeader from "../../components/FriendProfileComponents/FriendProfileContentContainerHeader/FriendProfileContentContainerHeader";
import "./FriendProfile.css";
import BucketList from "../../components/BucketList/BucketList";
import FriendBucketList from "../../components/FriendProfileComponents/FriendBucketList/FriendBucketList";

const FriendProfile = () => {
  const [userObject, setUserObject] = useState<UserType | undefined>(undefined);

  // separate the bucket list arrays for easier nullish checks in render
  const [publicBucketListArray, setPublicBucketListArray] = useState<
    BucketListType[]
  >([]);
  const [sharedBucketListArray, setSharedBucketListArray] = useState<
    BucketListType[]
  >([]);
  const { id } = useParams();

  // get user info from google id
  const getUserInfo = () => {
    Axios.get(`/view/get-user-info/${id}`)
      .then((res) => {
        setUserObject(res.data.userInfo[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // verify if in any shared lists, and then pull relevant content
  const getRelevantBucketLists = () => {
    // check if user is in any of friend's shared lists and return the list ID's
    Axios.get(`/view/get-shared-lists/${id}`)
      .then((res) => {
        // get bucket lists
        Axios.post("/view/get-friend-lists", {
          sharedListArray: res.data.bucketListIDs,
          friendGoogleID: id,
        })
          .then((res) => {
            setPublicBucketListArray(
              res.data.data.filter((bucketList: BucketListType) => {
                return (
                  bucketList.privacy_type === "public_friends" ||
                  bucketList.privacy_type === "public_random"
                );
              })
            );
            setSharedBucketListArray(
              res.data.data.filter((bucketList: BucketListType) => {
                return bucketList.privacy_type === "shared";
              })
            );
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getUserInfo();
    getRelevantBucketLists();
  }, []);

  return (
    <div className="friend-profile-container">
      {/* first row of elements */}
      <div className="friend-profile-profile-info">
        <h2>{userObject?.username}</h2>
        <img
          src={userObject?.google_photo_link}
          referrerPolicy="no-referrer" // referrer policy that blocked loading of img sometimes - look into it
          alt="google profile pic"
          className="friend-profile-profile-pic"
        />
        <div className="friend-profile-profile-info-name-container">
          <h3>{userObject?.first_name}</h3>
          <h3>{userObject?.last_name}</h3>
        </div>
        <div className="friend-profile-profile-wants-to-container">
          <h3 className="friend-profile-profile-wants-to-container-header">
            Wants to...
          </h3>
          <div className="friend-profile-profile-separator" />
          {userObject?.wants_to ? (
            <p className="friend-profile-wants-to">{userObject?.wants_to}</p>
          ) : (
            <p className="friend-profile-wants-to-empty">
              {userObject?.first_name} hasn't added anything here yet!
            </p>
          )}
        </div>
      </div>
      <div className="friend-profile-content-container public">
        <FriendProfileContentContainerHeader category="Public" />
        {/* if publicBucketListArray is true, render, if null, display message */}
        {publicBucketListArray.length > 0 ? (
          publicBucketListArray.map((bucketList) => {
            return (
              <FriendBucketList bucketList={bucketList} key={bucketList.id} />
            );
          })
        ) : (
          <EmptyArrayMessage />
        )}
      </div>
      <div className="friend-profile-right-column-container friend-feed">
        <h2 className="friend-profile-side-container-header">
          Recent Friend Activities
        </h2>
        <div className="friend-profile-side-container-header-separator" />
      </div>
      {/* second row of elements */}
      <div className="friend-profile-today-i-should-container"></div>
      <div className="friend-profile-content-container shared">
        <FriendProfileContentContainerHeader category="Shared" />
        {/* if sharedBucketListArray is true, render, if null, display message */}
        {sharedBucketListArray.length > 0 ? (
          sharedBucketListArray.map((bucketList) => {
            return (
              <FriendBucketList bucketList={bucketList} key={bucketList.id} />
            );
          })
        ) : (
          <EmptyArrayMessage />
        )}
      </div>
      <div className="friend-profile-right-column-container "></div>
    </div>
  );
};

export default FriendProfile;
