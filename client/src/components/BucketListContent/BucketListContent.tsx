import React from "react";
import { BucketListContentType } from "../../types/content";
import "./BucketListContent.css";

const BucketListContent = ({ content }: { content: BucketListContentType }) => {
  return (
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
    </div>
  );
};

export default BucketListContent;
