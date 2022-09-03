import React from "react";
import "./ContentContainerHeader.css";

const ContentContainerHeader = ({ category }: { category: string }) => {
  return (
    <div className="content-container-header-container">
      <h1 className="content-container-header-text">{category}</h1>
    </div>
  );
};

export default ContentContainerHeader;
