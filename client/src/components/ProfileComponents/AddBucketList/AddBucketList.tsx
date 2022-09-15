import React, { useState } from "react";
import Axios from "axios";
import "./AddBucketList.css";
import { FriendListType, UserType } from "../../../types/content";
import SelectSharedDropdown from "../Dropdown/SelectSharedDropdown";

const AddBucketList = ({
  setCallback,
  addState,
  privacyType,
  setTriggerRefresh,
  triggerRefresh,
  friends,
  userObject,
}: {
  setCallback: React.Dispatch<React.SetStateAction<boolean>>;
  addState: boolean;
  privacyType: string;
  setTriggerRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  triggerRefresh: boolean;
  friends: FriendListType[];
  userObject: UserType;
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [publicType, setPublicType] = useState("public_friends");
  const [selectedUsers, setSelectedUsers] = useState<FriendListType[]>([]);

  // function to add users to shared_list_users based on their ID
  const addSharedListUsers = (
    ownerID: number,
    bucketListID: number,
    addArray: number[]
  ) => {
    Axios.post("/content/shared-list-users", {
      ownerID: ownerID,
      bucketListID: bucketListID,
      selectedUserIDs: addArray,
    }).catch((err) => {
      console.log(err);
    });
  };

  // add the bucket list after checks
  const addBucketList = () => {
    // if privacyType === "public", set whether its public_friends or public_random
    if (privacyType === "public") {
      Axios.post("/content/bucket-list", {
        privacy_type: publicType,
        title: title,
        description: description,
        permissions: "view_and_edit",
      })
        .then((res) => {
          setCallback(!addState);
          setTriggerRefresh(!triggerRefresh);
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (privacyType === "shared") {
      // create new bucket list and then add respective shared users
      Axios.post("/content/create", {
        privacy_type: "shared",
        title: title,
        description: description,
        permissions: "view_and_edit",
      })
        .then((res) => {
          console.log(res);
          console.log(res.data.creationId);
          let bucketListID = res.data.creationId;
          // if length is not greater than zero then no one is being added
          if (res.status === 200 && selectedUsers.length > 0) {
            // filter out the ID's from the selectedUsers objects
            let addArray: number[] = [];

            for (let i = 0; i < selectedUsers.length; i++) {
              addArray.push(selectedUsers[i].user_id);
            }

            addSharedListUsers(userObject.id, bucketListID, addArray);
          }
          setCallback(!addState);
          setTriggerRefresh(!triggerRefresh);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      Axios.post("/content/create", {
        privacy_type: "private",
        title: title,
        description: description,
        permissions: "view_and_edit",
      })
        .then((res) => {
          setCallback(!addState);
          setTriggerRefresh(!triggerRefresh);
        })
        .catch((err) => {
          console.log(err);
        });
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
          {privacyType === "shared" && (
            <div className="edit-bucket-list-shared-container">
              <h2 className="edit-bucket-list-shared-header">
                Who do you want to share this with?
              </h2>
              <div className="edit-bucket-list-shared-selected-container">
                <SelectSharedDropdown
                  friends={friends}
                  selectedUsers={selectedUsers}
                  setSelectedUsers={setSelectedUsers}
                />
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
