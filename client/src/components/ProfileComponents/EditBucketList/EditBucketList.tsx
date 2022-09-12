import React, { useState, useEffect } from "react";
import { BucketListType } from "../../../types/content";
import Axios from "axios";
import "./EditBucketList.css";

const EditBucketList = ({
  setCallback,
  editState,
  setTriggerRefresh,
  triggerRefresh,
  arraySpecificObject,
}: {
  setCallback: React.Dispatch<React.SetStateAction<boolean>>;
  editState: boolean;
  setTriggerRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  triggerRefresh: boolean;
  arraySpecificObject: BucketListType | null;
}) => {
  const [newTitle, setNewTitle] = useState<string | undefined>(
    arraySpecificObject!.title
  );
  const [newDescription, setNewDescription] = useState<string | undefined>(
    arraySpecificObject!.description
  );
  const [privacyType, setPrivacyType] = useState<string | undefined>(
    arraySpecificObject!.privacy_type
  );
  const [permissions, setPermissions] = useState<string | undefined>(
    arraySpecificObject!.permissions
  );

  const deleteBucketList = () => {
    if (window.confirm("Are you sure you want to delete this?")) {
      Axios.post("/content/delete-bucket-list", {
        id: arraySpecificObject?.id,
      })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });

      setTriggerRefresh(!triggerRefresh);
      setCallback(false);
    } else {
      setCallback(false);
    }
  };

  const saveBucketList = () => {
    // check if any fields are empty
    if (!newTitle || !newDescription || !privacyType || !permissions) {
      alert("Please make sure all sections are filled out");
      return;
    }
    // if bucket list is public
    if (privacyType === "public_friends" || privacyType === "public_random") {
      Axios.put("/content/update-bucket-list", {
        id: arraySpecificObject?.id,
        privacy_type: privacyType,
        title: newTitle,
        description: newDescription,
        permissions: permissions,
      })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (privacyType === "shared") {
      // same as public but also indicating which users it's shared with
    } else {
    }

    setTriggerRefresh(!triggerRefresh);
    setCallback(false);
  };

  return (
    <div className="edit-bucket-list-wrapper">
      <div className="edit-bucket-list-container">
        <div
          onClick={deleteBucketList}
          className="edit-bucket-list-delete-button"
        >
          <h2>Delete</h2>
        </div>
        <div
          onClick={() => setCallback(false)}
          className="edit-bucket-list-exit-button"
        >
          <h1>X</h1>
        </div>
        <div className="edit-bucket-list-header">
          <h2>Edit Activity</h2>
        </div>
        <div className="edit-bucket-list-body">
          <label htmlFor="edit-bucket-list-title-input">Title:</label>
          <input
            className="edit-bucket-list-title-input"
            type="text"
            id="edit-bucket-list-title-input"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <label htmlFor="edit-bucket-list-description-input">
            Description:
          </label>
          <input
            className="edit-bucket-list-description-input"
            type="text"
            id="edit-bucket-list-description-input"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />
          <div className="edit-bucket-list-public-radio-buttons-container">
            <h2>Change Editing Permissions</h2>
            <div className="edit-bucket-list-public-radio-buttons-wrapper">
              <input
                type="radio"
                id="view"
                value={permissions}
                checked={permissions === "view" ? true : false}
                onChange={() => setPermissions("view")}
              />
              <label htmlFor="view">View only.</label>
            </div>
            <div className="edit-bucket-list-public-radio-buttons-wrapper">
              <input
                type="radio"
                id="view-and-edit"
                value={permissions}
                checked={permissions === "view_and_edit" ? true : false}
                onChange={() => setPermissions("view_and_edit")}
              />
              <label htmlFor="view-and-edit">View and edit.</label>
            </div>
          </div>
          {(privacyType === "public_friends" ||
            privacyType === "public_random") && (
            <div className="edit-bucket-list-public-radio-buttons-container">
              <h2>Select Privacy Type</h2>
              <div className="edit-bucket-list-public-radio-buttons-wrapper">
                <input
                  type="radio"
                  id="public-friends"
                  value={privacyType}
                  checked={privacyType === "public_friends" ? true : false}
                  onChange={() => setPrivacyType("public_friends")}
                />
                <label htmlFor="public-friends">
                  Only friends can see this bucket list.
                </label>
              </div>
              <div className="edit-bucket-list-public-radio-buttons-wrapper">
                <input
                  type="radio"
                  id="public-random"
                  value={privacyType}
                  checked={privacyType === "public_random" ? true : false}
                  onChange={() => setPrivacyType("public_random")}
                />
                <label htmlFor="public-random">
                  Anyone can see this bucket list.
                </label>
              </div>
            </div>
          )}
          {privacyType === "shared" && (
            <div className="edit-bucket-list-shared-container">
              <h2 className="edit-bucket-list-shared-header">
                Who do you want to share this with?
              </h2>
              <div className="edit-bucket-list-shared-selected-container"></div>
            </div>
          )}
        </div>
        <div onClick={saveBucketList} className="edit-bucket-list-save-button">
          <h2>Save</h2>
        </div>
      </div>
    </div>
  );
};

export default EditBucketList;
