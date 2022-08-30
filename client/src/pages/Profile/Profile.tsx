import React, { useState, useEffect, ReactNode } from "react";
import Axios from "axios";
import "./Profile.css";

// import types
import { BucketListType } from "../../types/content";

// import components
import BucketList from "../../components/BucketList/BucketList";

const Profile = () => {
  const [userID, setUserID] = useState<number>(0);
  const [bucketListArray, setBucketListArray] = useState<BucketListType[]>([]);

  // useEffect(() => {

  //     return ()
  // })

  useEffect(() => {
    // hardcode userID for now
    // Axios.get(`http://localhost:3000/view/lists/${userID}`)
    Axios.get(`http://localhost:3000/view/lists/2`)
      .then((response) => {
        console.log(response.data.data);
        setBucketListArray(response.data.data);
      })
      .catch((err) => {
        console.log(err);
      });

    return () => {};
  }, []);

  return (
    <>
      <div className="home-container">
        {/* first row of elements */}
        <div className="profile-info"></div>
        <div className="content-container public">
          {bucketListArray
            .filter((bList) => {
              return bList.privacy_type === "public";
            })
            .map((bucketList, index) => {
              return <BucketList bucketList={bucketList} />;
            })}
        </div>
        <div className="friend-feed"></div>
        {/* second row of elements */}
        <div className="control-panel"></div>
        <div className="content-container friends"></div>

        {/* third row of elements */}
        <div className="content-container private"></div>
        <div className="test" />
        <div className="test" />
        <div className="test" />
        <div className="test" />
        <div className="test" />
        <div className="test" />
        <div className="test" />
        <div className="test" />
        <div className="test" />
        <div className="test" />
        <div className="test" />
        <div className="test" />
        <div className="test" />
        <div className="test" />
        <div className="test" />
        <div className="test" />
        <div className="test" />
      </div>
      {/* <div className="row-container first">
        <div className="box green"></div>
        <div className="content-container red">
          <div className="test-bucket-list" />
          <div className="test-bucket-list" />
          <div className="test-bucket-list" />
          <div className="test-bucket-list" />
          <div className="test-bucket-list" />
          <div className="test-bucket-list" />
        </div>
        <div className="friend-feed"></div>
      </div>
      <div className="row-container second">
        <div className="box red"></div>
        <div className="content-container"></div>
      </div>
      <div className="row-container third">
        <div className="box green"></div>
        <div className="content-container"></div>
      </div> */}
    </>
  );
};

export default Profile;
