import React, { useState } from "react";
import "./EditBucketListContent.css";

const EditBucketListContent = ({
  activityInput,
  descriptionInput,
  setEditMode,
}: {
  activityInput: string;
  descriptionInput: string;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [newActivity, setNewActivity] = useState(activityInput);
  const [newDescription, setNewDescription] = useState(descriptionInput);

  return (
    <div className="edit-bucket-list-content-wrapper">
      <div className="edit-bucket-list-content-container">
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
        <div className="edit-bucket-list-content-save-button">
          <h2>Save</h2>
        </div>
      </div>
    </div>
  );
};

export default EditBucketListContent;
