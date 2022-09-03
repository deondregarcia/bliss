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
        console.log("privacy_type and owner below");
        console.log(res.data.data);
        setPrivacyType(res.data.data.privacy_type);
        setOwnerID(res.data.data.owner_id);
        // let privacy_type = res.data.data.privacy_type;

        // console.log("ownerID");
        // console.log(ownerID);
        // console.log("privacyType");
        // console.log(privacyType);

        // check if User google_id === Owner google_id
        if (privacyType === "private") {
          // get user's google id from server for verification
          Axios.get("/googleuser")
            .then((res) => {
              // if User is owner
              if (res.data.google_user.id === ownerID) {
                getBucketListContent();
              } else {
                setUnauthorizedType("private");
              }
            })
            .catch((err) => {
              console.log(err);
            });

          // check if User google_id === Owner google_id or in shared_list_users
        } else if (privacyType === "shared") {
          // check google_id's first then shared_list_users
          Axios.get("/googleuser")
            .then((res) => {
              // if User is owner
              if (res.data.google_user.id === ownerID) {
                getBucketListContent();
              } else {
                // check if shared_list_user
                Axios.get(`/view/check-if-user-in-shared-list/${id}`)
                  .then((res) => {
                    if (res.data.data.sharedListUsers[0]) {
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
          // check if User google_id is friends with Owner google_id
        } else if (privacyType === "public_friends") {
          Axios.post("/check-if-friend", {
            secondID: ownerID,
          })
            .then((res) => {
              // if true then they are friends; pull public_friends content
              if (res.data.friendPairsInfo[0]) {
                getBucketListContent();
              } else {
                setUnauthorizedType("public_friends");
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
          {bucketListContent.map((content, index) => (
            <BucketListContent content={content} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BucketListView;
