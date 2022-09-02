import React, { useState, useEffect, ReactNode } from "react";
import Axios from "axios";
import "./Profile.css";
import Cookies from "js-cookie";

// import types
import { BucketListType } from "../../types/content";

// import components
import BucketList from "../../components/BucketList/BucketList";
import EmptyArrayMessage from "../../components/EmptyArrayMessage/EmptyArrayMessage";
import ContentContainerHeader from "../../components/ContentContainerHeader/ContentContainerHeader";

const Profile = ({
  checkSessionID,
}: {
  checkSessionID: React.MouseEventHandler<HTMLButtonElement>;
}) => {
  const [userID, setUserID] = useState<number>(0);
  // separate the bucket list arrays for easier nullish checks in render
  const [publicBucketListArray, setPublicBucketListArray] = useState<
    BucketListType[]
  >([]);
  const [sharedBucketListArray, setSharedBucketListArray] = useState<
    BucketListType[]
  >([]);
  const [privateBucketListArray, setPrivateBucketListArray] = useState<
    BucketListType[]
  >([]);

  // grab bucket_list_tracker data
  const getBucketListData = () => {
    // hardcode userID for now
    // Axios.get(`http://localhost:3000/view/lists/${userID}`)
    Axios.get(`/view/lists/2`)
      .then((response) => {
        console.log(response.data.data);
        setPublicBucketListArray(
          response.data.data.filter((bucketList: BucketListType) => {
            return bucketList.privacy_type === "public";
          })
        );
        setSharedBucketListArray(
          response.data.data.filter((bucketList: BucketListType) => {
            return bucketList.privacy_type === "shared";
          })
        );
        setPrivateBucketListArray(
          response.data.data.filter((bucketList: BucketListType) => {
            return bucketList.privacy_type === "private";
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //

  useEffect(() => {
    getBucketListData();

    return () => {};
  }, []);

  return (
    <>
      <div className="home-container">
        {/* first row of elements */}
        <div className="profile-info">
          <button onClick={checkSessionID}> Console Log Cookie </button>
        </div>
        <div className="content-container public">
          <ContentContainerHeader category="Public" />
          {/* if publicBucketListArray is true, render, if null, display message */}
          {publicBucketListArray.length > 0 ? (
            publicBucketListArray.map((bucketList, index) => {
              return <BucketList bucketList={bucketList} key={index} />;
            })
          ) : (
            <EmptyArrayMessage />
          )}
        </div>
        <div className="friend-feed"></div>

        {/* second row of elements */}
        <div className="control-panel"></div>
        <div className="content-container shared">
          <ContentContainerHeader category="Shared" />
          {sharedBucketListArray.length > 0 ? (
            sharedBucketListArray.map((bucketList, index) => {
              return <BucketList bucketList={bucketList} key={index} />;
            })
          ) : (
            <EmptyArrayMessage />
          )}
        </div>
        {/* third row of elements */}
        <div className="content-container private">
          <ContentContainerHeader category="Private" />
          {privateBucketListArray.length > 0 ? (
            privateBucketListArray.map((bucketList, index) => {
              return <BucketList bucketList={bucketList} key={index} />;
            })
          ) : (
            <EmptyArrayMessage />
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
