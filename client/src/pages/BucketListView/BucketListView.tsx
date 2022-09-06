import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Axios from "axios";
import { BucketListContentType } from "../../types/content";
import "./BucketListView.css";
import UnauthorizedBucketListView from "../../auth/Unauthorized/UnauthorizedBucketListView";
import BucketListContent from "../../components/BucketListContent/BucketListContent";

const BucketListView = () => {
  const [privacyType, setPrivacyType] = useState<string | null>(null);
  const [ownerID, setOwnerID] = useState<number | null>(null);
  const [bucketListContent, setBucketListContent] = useState<
    BucketListContentType[]
  >([]);
  const [unauthorizedType, setUnauthorizedType] = useState<string | null>(null);
  const { id } = useParams();

  // pull bucket list content based on id
  const getBucketListContent = () => {
    Axios.get(`/view/activities/${id}`)
      .then((res) => {
        setBucketListContent(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // get privacy type of bucket list for verification
  // do a lot more
  const verifyPermissions = () => {
    Axios.get(`/view/privacy-type-and-owner-google-id/${id}`)
      .then((res) => {
        setPrivacyType(res.data.data[0].privacy_type);
        setOwnerID(res.data.data[0].owner_id);

        return {
          privacy_type: res.data.data[0].privacy_type,
          owner_id: res.data.data[0].owner_id,
        };
      })
      .then((res) => {
        // check if User google_id === Owner google_id
        if (res.privacy_type === "private") {
          // get user's google id from server for verification
          Axios.get("/get-user-id")
            .then((response) => {
              // check if user is logged in
              if (!response.data.userID[0]) {
                setUnauthorizedType("not_logged_in");
              } else if (
                // if User is owner
                response.data.userID[0].id === res.owner_id
              ) {
                getBucketListContent();
              } else {
                setUnauthorizedType("private");
              }
            })
            .catch((err) => {
              console.log(err);
            });

          // check if User google_id === Owner google_id or in shared_list_users
        } else if (res.privacy_type === "shared") {
          // check if user is owner, then check if in shared_list_users
          Axios.get("/get-user-id")
            .then((response) => {
              // check if user is logged in
              if (!response.data.userID[0]) {
                setUnauthorizedType("not_logged_in");
              } else if (
                // if User is owner
                response.data.userID[0].id === res.owner_id
              ) {
                getBucketListContent();
              } else {
                // check if shared_list_user
                Axios.get(`/view/check-if-user-in-shared-list/${id}`)
                  .then((response) => {
                    console.log(response);
                    if (response.data.data[0]) {
                      getBucketListContent();
                    } else {
                      setUnauthorizedType("shared");
                    }
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }
            })
            .catch((err) => {
              console.log(err);
            });
          // check if user is owner, then check if User google_id is friends with Owner google_id
        } else if (res.privacy_type === "public_friends") {
          // check if user is owner
          Axios.get("/get-user-id")
            .then((response) => {
              // check if user is logged in
              if (!response.data.userID[0]) {
                setUnauthorizedType("not_logged_in");
              } else if (
                // if User is owner
                response.data.userID[0].id === res.owner_id
              ) {
                getBucketListContent();
              } else {
                // check if user id is friends with Owner id
                Axios.post("/check-if-friend-with-user-id", {
                  secondID: res.owner_id,
                })
                  .then((response) => {
                    // console.log(response.data);
                    // console.log(response.data.friendPairsInfo[0] ? "true" : "false");
                    // if true then they are friends; pull public_friends content
                    if (response.data.friendPairsInfo[0]) {
                      getBucketListContent();
                    } else {
                      setUnauthorizedType("public_friends");
                    }
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }
            })
            .catch((err) => {
              console.log(err);
            });

          // else privacy_type === "public_random"
        } else {
          getBucketListContent();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    verifyPermissions();
  }, []);

  return (
    <div className="bucket-list-view-wrapper">
      <div className="bucket-list-view-container">
        <div className="bucket-list-view-header-container">
          <h1 className="bucket-list-view-header">[Bucket List Title]</h1>
          <p>{unauthorizedType}</p>
          {bucketListContent ? (
            bucketListContent.map((content, index) => (
              <BucketListContent content={content} key={index} />
            ))
          ) : (
            <h1>No Content</h1>
          )}
        </div>
      </div>
    </div>
  );
};

export default BucketListView;
