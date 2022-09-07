import React, { ReactNode } from "react";
import "./EmptyArrayMessage.css";

// component to display message if a particular bucketListArray is empty
const EmptyArrayMessage = () => {
  return (
    <div className="empty-array-message-container">
      <h1 className="empty-array-message-text">
        Create or move a new bucket list here!
      </h1>
    </div>
  );
};

export default EmptyArrayMessage;
