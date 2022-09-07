import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Axios from "axios";
import { BucketListContentType, BucketListType } from "../../types/content";
import "./BucketListView.css";
import UnauthorizedBucketListView from "../../auth/Unauthorized/UnauthorizedBucketListView";
import BucketListContent from "../../components/BucketListContent/BucketListContent";
import AddBucketListContent from "../../components/AddBucketListContent/AddBucketListContent";

const BucketListView = () => {
  const [privacyType, setPrivacyType] = useState<string | null>(null);
  const [ownerID, setOwnerID] = useState<number | null>(null);
  const [bucketListInfo, setBucketListInfo] = useState<BucketListType | null>(
    null
  );
  const [bucketListContent, setBucketListContent] = useState<
    BucketListContentType[]
  >([]);
  const [unauthorizedType, setUnauthorizedType] = useState<string | null>(null);
  const [addMode, setAddMode] = useState(false);
  const [triggerRefresh, setTriggerRefresh] = useState(false);
  const { id } = useParams();

  // pull bucket list content based on id
  const getBucketListContent = () => {
    // get bucket list title, description, etc.
    Axios.get(`/view/bucket-list-info/${id}`)
      .then((res) => {
        setBucketListInfo(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });

    // get bucket list activities info
    Axios.get(`/view/activities/${id}`)
      .then((res) => {
        setBucketListContent(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // get privacy type and owner of bucket list, then verify based on logged in user's credentials
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
  }, [triggerRefresh]);

  return (
    <div className="bucket-list-view-wrapper">
      <div className="bucket-list-view-container">
        <div className="bucket-list-view-header-container">
          <div
            onClick={() => setAddMode(true)}
            className="bucket-list-view-add-button"
          >
            <h2>Add</h2>
          </div>
          <h1 className="bucket-list-view-header">{bucketListInfo?.title}</h1>
          <p className="bucket-list-view-description">
            {bucketListInfo?.description}
          </p>
        </div>
        <div className="bucket-list-view-content-container">
          {addMode && (
            <AddBucketListContent
              setAddMode={setAddMode}
              setTriggerRefresh={setTriggerRefresh}
              triggerRefresh={triggerRefresh}
              bucketListID={bucketListInfo?.id}
              ownerID={ownerID}
            />
          )}

          <p>{unauthorizedType}</p>
          {bucketListContent[0] ? (
            bucketListContent.map((content, index) => (
              <BucketListContent
                content={content}
                permissions={bucketListInfo?.permissions}
                key={index}
              />
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
