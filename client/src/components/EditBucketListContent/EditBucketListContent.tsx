import React, { useState } from "react";
import Axios from "axios";
import "./EditBucketListContent.css";

const EditBucketListContent = ({
  activityInput,
  descriptionInput,
  contentID,
  trackerID,
  setEditMode,
  triggerRefresh,
  setTriggerRefresh,
}: {
  activityInput: string;
  descriptionInput: string;
  contentID: number;
  trackerID: number;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  triggerRefresh: boolean;
  setTriggerRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [newActivity, setNewActivity] = useState(activityInput);
  const [newDescription, setNewDescription] = useState(descriptionInput);

  const saveContent = async () => {
    await Axios.put("/content/update-activity", {
      id: contentID,
      activity: newActivity,
      description: newDescription,
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });

    setTriggerRefresh(!triggerRefresh);
    setEditMode(false);
  };

  const deleteContent = () => {
    if (window.confirm("Are you sure you want to delete this?")) {
      Axios.post("/content/delete-activity", {
        tracker_id: trackerID,
        content_id: contentID,
      })
        .then((res) => {
          console.log(res);
          setTriggerRefresh(!triggerRefresh);
          setEditMode(false);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      return;
    }
  };

  return (
    <div className="edit-bucket-list-content-wrapper">
      <div className="edit-bucket-list-content-container">
        <div onClick={deleteContent} className="edit-bucket-list-delete-button">
          <h2>Delete</h2>
        </div>
        <div
          onClick={() => setEditMode(false)}
          className="edit-bucket-list-content-exit-button"
        >
          <h1>X</h1>
        </div>
        <div className="edit-bucket-list-content-header">
          <h2>Edit Activity</h2>
        </div>
        <div className="edit-bucket-list-content-body">
          <label htmlFor="activity-title-input">Title:</label>
          <input
            className="edit-bucket-list-content-title-input"
            type="text"
            id="activity-title-input"
            value={newActivity}
            onChange={(e) => setNewActivity(e.target.value)}
          />
          <label htmlFor="activity-description-input">Description:</label>
          <input
            className="edit-bucket-list-content-description-input"
            type="text"
            id="activity-description-input"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />
        </div>
        <div
          onClick={saveContent}
          className="edit-bucket-list-content-save-button"
        >
          <h2>Save</h2>
        </div>
      </div>
    </div>
  );
};

export default EditBucketListContent;
