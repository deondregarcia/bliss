import React, { useState, useEffect } from "react";
import {
  BucketListType,
  FriendListType,
  SharedListUserType,
} from "../../../types/content";
import Axios from "axios";
import "./EditBucketList.css";
import SelectSharedDropdown from "../Dropdown/SelectSharedDropdown";

const EditBucketList = ({
  setCallback,
  editState,
  setTriggerRefresh,
  triggerRefresh,
  arraySpecificObject,
  friends,
  contributorUserObjectsArray,
}: {
  setCallback: React.Dispatch<React.SetStateAction<boolean>>;
  editState: boolean;
  setTriggerRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  triggerRefresh: boolean;
  arraySpecificObject: BucketListType | null;
  friends: FriendListType[];
  contributorUserObjectsArray: FriendListType[];
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
  // const [selectedUsers, setSelectedUsers] = useState<FriendListType[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<FriendListType[]>(
    contributorUserObjectsArray
  );

  const deleteBucketList = () => {
    if (window.confirm("Are you sure you want to delete this?")) {
      Axios.delete("/content/bucket-list", {
        params: {
          id: arraySpecificObject?.id,
        },
      }).catch((err) => {
        console.log(err);
      });

      setTriggerRefresh(!triggerRefresh);
      setCallback(false);
    } else {
      setCallback(false);
    }
  };

  // add array of user ID's to shared_list_users
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

  // remove array of user ID's from shared_list_users
  const removeSharedListUsers = (
    bucketListID: number,
    removeArray: number[]
  ) => {
    Axios.post("/content/delete-shared-list-users", {
      bucketListID: bucketListID,
      removedUserIDs: removeArray,
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const saveBucketList = () => {
    // check if any fields are empty
    if (!newTitle || !newDescription || !privacyType || !permissions) {
      alert("Please make sure all sections are filled out");
      return;
    }
    // if bucket list is public
    if (privacyType === "public_friends" || privacyType === "public_random") {
      Axios.patch("/content/bucket-list", {
        id: arraySpecificObject?.id,
        privacy_type: privacyType,
        title: newTitle,
        description: newDescription,
        permissions: permissions,
      }).catch((err) => {
        console.log(err);
      });
    } else if (privacyType === "shared") {
      // check if any fields are empty
      if (!newTitle || !newDescription || !permissions) {
        alert("Please make sure all sections are filled out");
        return;
      }
      // same as public but pull shared_list_users, then compare to selctedUsers, and add/remove relevant users
      Axios.patch("/content/bucket-list", {
        id: arraySpecificObject?.id,
        privacy_type: privacyType,
        title: newTitle,
        description: newDescription,
        permissions: permissions,
      })
        .then((res) => {
          if (res.status === 200) {
            // get all shared_list_users for this bucket list and compare against selectedUsers
            Axios.get(`/view/all-shared-list-users/${arraySpecificObject?.id}`)
              .then((responseTwo) => {
                // copy of shared list users to compare both arrays
                let sharedListTracker: number[] =
                  responseTwo.data.contributorIDs; // any ID's left in here, remove from shared_list_users
                let selectedUsersTracker: number[] = []; // any ID's left in here will be added to DB

                let sharedListUsersIDList: number[] =
                  responseTwo.data.contributorIDs;
                let selectedUsersIDList: number[] = [];
                for (let i = 0; i < selectedUsers.length; i++) {
                  selectedUsersIDList.push(selectedUsers[i].user_id);
                  selectedUsersTracker.push(selectedUsers[i].user_id);
                }

                // if new list and/or no one shared/selected, immediately pass on lists to be added/deleted
                if (
                  sharedListTracker.length === 0 ||
                  selectedUsersTracker.length === 0
                ) {
                  return {
                    selectedUsersTracker,
                    sharedListTracker,
                  };
                }

                // compare both lists
                // 1. If selectedUsersIDList ID in sharedListUsersIDList, remove from sharedListTracker and selectedUsersTracker
                // 2. If selectedUsersIDList ID *NOT* in sharedListUsersIDList, do nothing (ID will be added to shared_list_users in DB)
                // 3. Anything remaining in selectedUsersTracker will get added to shared_list_users, and anything remaining
                //    in sharedListTracker will get deleted from shared_list_users

                for (let i = 0; i < selectedUsersIDList.length; i++) {
                  // if condition 1. is true
                  if (sharedListUsersIDList?.includes(selectedUsersIDList[i])) {
                    let sharedListTrackerIDIndex = sharedListTracker.indexOf(
                      selectedUsersIDList[i]
                    );
                    let selectedUsersTrackerIDIndex =
                      selectedUsersTracker.indexOf(selectedUsersIDList[i]);
                    sharedListTracker.splice(sharedListTrackerIDIndex, 1);
                    selectedUsersTracker.splice(selectedUsersTrackerIDIndex, 1);
                  }
                }

                return {
                  selectedUsersTracker,
                  sharedListTracker,
                };
              })
              .then((responseThree) => {
                // if selectedUsersTracker is empty AND sharedListTracker is NOT empty, delete necessary shared users
                if (
                  responseThree.selectedUsersTracker.length === 0 &&
                  responseThree.sharedListTracker.length !== 0
                ) {
                  removeSharedListUsers(
                    arraySpecificObject?.id!,
                    responseThree.sharedListTracker
                  );
                  // else if selectedUsersTracker is NOT empty AND sharedListTracker is empty, add necessary shared users
                } else if (
                  responseThree.selectedUsersTracker.length !== 0 &&
                  responseThree.sharedListTracker.length === 0
                ) {
                  addSharedListUsers(
                    arraySpecificObject?.owner_id!,
                    arraySpecificObject?.id!,
                    responseThree.selectedUsersTracker
                  );
                  // else if both are empty, then no changes
                } else if (
                  responseThree.selectedUsersTracker.length === 0 &&
                  responseThree.sharedListTracker.length === 0
                ) {
                  return;

                  // else neither are empty, so both add and delete
                } else {
                  addSharedListUsers(
                    arraySpecificObject?.owner_id!,
                    arraySpecificObject?.id!,
                    responseThree.selectedUsersTracker
                  );
                  removeSharedListUsers(
                    arraySpecificObject?.id!,
                    responseThree.sharedListTracker
                  );
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
    } else {
      // else if privacyType is "private"
      // check if any fields are empty
      if (!newTitle || !newDescription) {
        alert("Please make sure all sections are filled out");
        return;
      }
      Axios.patch("/content/bucket-list", {
        id: arraySpecificObject?.id,
        privacy_type: privacyType,
        title: newTitle,
        description: newDescription,
        permissions: permissions,
      }).catch((err) => {
        console.log(err);
      });
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
            maxLength={50}
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
            maxLength={100}
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
        <div onClick={saveBucketList} className="edit-bucket-list-save-button">
          <h2>Save</h2>
        </div>
      </div>
    </div>
  );
};

export default EditBucketList;
