import React, { useState } from "react";
import Axios from "axios";
import "./AddBucketList.css";

const AddBucketList = ({
  setCallback,
  addState,
  privacyType,
  setTriggerRefresh,
  triggerRefresh,
}: {
  setCallback: React.Dispatch<React.SetStateAction<boolean>>;
  addState: boolean;
  privacyType: string;
  setTriggerRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  triggerRefresh: boolean;
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [publicType, setPublicType] = useState("public_friends");

  // add the bucket list after checks
  const addBucketList = () => {
    // if privacyType === "public", set whether its public_friends or public_random
    if (privacyType === "public") {
      Axios.post("/content/create", {
        privacy_type: publicType,
        title: title,
        description: description,
        permissions: "view_and_edit",
      })
        .then((res) => {
          console.log(res);
          setCallback(!addState);
          setTriggerRefresh(!triggerRefresh);
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (privacyType === "shared") {
    } else {
    }
  };

  return (
    <div className="add-bucket-list-wrapper">
      <div className="add-bucket-list-container">
        <div
          onClick={() => setCallback(false)}
          className="add-bucket-list-exit-button"
        >
          <h1>X</h1>
        </div>
        <div className="add-bucket-list-header">
          <h2>Add Activity</h2>
        </div>
        <div className="add-bucket-list-body">
          <label htmlFor="title-input">Title</label>
          <input
            className="add-bucket-list-title-input"
            type="text"
            id="title-input"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label htmlFor="description-input">Description</label>
          <input
            className="add-bucket-list-description-input"
            type="text"
            id="description-input"
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {privacyType === "public" && (
            <div className="add-bucket-list-public-radio-buttons-container">
              <h2>Select Privacy Type</h2>
              <div className="add-bucket-list-public-radio-buttons-wrapper">
                <input
                  type="radio"
                  id="public-friends"
                  value={publicType}
                  checked={publicType === "public_friends" ? true : false}
                  onChange={() => setPublicType("public_friends")}
                />
                <label htmlFor="public-friends">
                  Only friends can see this bucket list.
                </label>
              </div>
              <div className="add-bucket-list-public-radio-buttons-wrapper">
                <input
                  type="radio"
                  id="public-random"
                  value={publicType}
                  checked={publicType === "public_random" ? true : false}
                  onChange={() => setPublicType("public_random")}
                />
                <label htmlFor="public-random">
                  Anyone can see this bucket list.
                </label>
              </div>
            </div>
          )}
        </div>
        <div onClick={addBucketList} className="add-bucket-list-save-button">
          <h2>Save</h2>
        </div>
      </div>
    </div>
  );
};

export default AddBucketList;
