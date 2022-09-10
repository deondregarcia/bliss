import React from "react";
import "./ContentContainerHeader.css";

const ContentContainerHeader = ({
  category,
  setCallback,
  addState,
}: {
  category: string;
  setCallback: React.Dispatch<React.SetStateAction<boolean>>;
  addState: boolean;
}) => {
  return (
    <div className="content-container-header-container">
      <h1 className="content-container-header-text">{category}</h1>
      <div
        onClick={() => setCallback(!addState)}
        className="content-container-header-add-button"
      >
        <h2>Add</h2>
      </div>
    </div>
  );
};

export default ContentContainerHeader;
