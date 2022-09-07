import React, { useState } from "react";
import { BucketListContentType } from "../../types/content";
import EditBucketListContent from "../EditBucketListContent/EditBucketListContent";
import "./BucketListContent.css";

const BucketListContent = ({
  content,
  permissions,
}: {
  content: BucketListContentType;
  permissions: string | undefined;
}) => {
  const [activity, setActivity] = useState(content.activity);
  const [description, setDescription] = useState(content.description);
  const [editMode, setEditMode] = useState(false);

  return (
    <div className="bucket-list-content-wrapper">
      {permissions === "view_and_edit" && editMode && (
        <EditBucketListContent
          activityInput={activity}
          descriptionInput={description}
          contentID={content.id}
          setEditMode={setEditMode}
          setActivity={setActivity}
          setDescription={setDescription}
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
        {permissions === "view_and_edit" && (
          <div
            onClick={() => setEditMode(!editMode)}
            className="bucket-list-content-edit-button"
          >
            <p>Edit</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BucketListContent;
