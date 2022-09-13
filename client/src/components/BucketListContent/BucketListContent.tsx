import React, { useState, useEffect } from "react";
import { BucketListContentType } from "../../types/content";
import EditBucketListContent from "../EditBucketListContent/EditBucketListContent";
import "./BucketListContent.css";

const BucketListContent = ({
  content,
  permissions,
  setEditMode,
  setContentObject,
}: {
  content: BucketListContentType;
  permissions: string | undefined;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  setContentObject: React.Dispatch<React.SetStateAction<BucketListContentType>>;
}) => {
  const handleBucketListContentEdit = () => {
    setContentObject(content);
    setEditMode(true);
  };

  return (
    <div className="bucket-list-content-wrapper">
      <div className="bucket-list-content-container">
        <div className="bucket-list-content-bullet-point">
          <h1>-</h1>
        </div>
        <div className="bucket-list-content-activities-container">
          <h2 className="bucket-list-content-activities-header">
            {content.activity}
          </h2>
          <p className="bucket-list-content-activities-description">
            Details: {content.description}
          </p>
        </div>
        {permissions === "view_and_edit" && (
          <div
            onClick={handleBucketListContentEdit}
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
