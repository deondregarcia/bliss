import React from "react";
import "./FriendProfileContentContainerHeader.css";

const FriendProfileContentContainerHeader = ({
  category,
}: {
  category: string;
}) => {
  return (
    <div className="friend-profile-content-container-header-container">
      <h1 className="friend-profile-content-container-header-text">
        {category}
      </h1>
    </div>
  );
};

export default FriendProfileContentContainerHeader;
