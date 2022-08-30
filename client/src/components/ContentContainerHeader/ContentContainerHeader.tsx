import React from "react";
import "./ContentContainerHeader.css";

const ContentContainerHeader = ({ category }: { category: string }) => {
  return (
    <div className="content-container-header-container">
      <h1>{category}</h1>
    </div>
  );
};

export default ContentContainerHeader;
