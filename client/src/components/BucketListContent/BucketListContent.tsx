import React, { useState } from "react";
import { BucketListContentType } from "../../types/content";
import EditBucketListContent from "../EditBucketListContent/EditBucketListContent";
import "./BucketListContent.css";

const BucketListContent = ({ content }: { content: BucketListContentType }) => {
  const [activity, setActivity] = useState(content.activity);
  const [description, setDescription] = useState(content.description);
  const [editMode, setEditMode] = useState(false);

  console.log(activity);

  return (
    <div className="bucket-list-content-wrapper">
      {editMode && (
        <EditBucketListContent
          activityInput={activity}
          descriptionInput={description}
          setEditMode={setEditMode}
        />
      )}
      <div className="bucket-list-content-container">
        <div className="bucket-list-content-bullet-point">
          <h1>-</h1>
        </div>
        <div className="bucket-list-content-activities-container">
          <h2 className="bucket-list-content-activities-header">{activity}</h2>
          <p className="bucket-list-content-activities-description">
            Details: {description}
          </p>
        </div>
        <div
          onClick={() => setEditMode(!editMode)}
          className="bucket-list-content-edit-button"
        >
          <p>Edit</p>
        </div>
      </div>
    </div>
  );
};

export default BucketListContent;
