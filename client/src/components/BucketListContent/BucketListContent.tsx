import React from "react";
import { BucketListContentType } from "../../types/content";
import "./BucketListContent.css";

const BucketListContent = ({ content }: { content: BucketListContentType }) => {
  return (
    <div>
      <div>
        <h3>{content.activity}</h3>
        <p>{content.description}</p>
      </div>
    </div>
  );
};

export default BucketListContent;
