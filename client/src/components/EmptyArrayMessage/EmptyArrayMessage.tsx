import React, { ReactNode } from "react";
import "./EmptyArrayMessage.css";

// component to display message if a particular bucketListArray is empty
// accountType determines whether the viewing user is the owner, friend, or nonfriend of the viewed account
const EmptyArrayMessage = ({ accountType }: { accountType: string }) => {
  return (
    <div className="empty-array-message-container">
      <h1 className="empty-array-message-text">
        {accountType === "owner"
          ? "Create or move a new bucket list here!"
          : "Nothing created yet."}
      </h1>
    </div>
  );
};

export default EmptyArrayMessage;
