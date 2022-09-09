import React from "react";
import "./Search.css";

const Search = ({ friendManager }: { friendManager: string }) => {
  return (
    <div
      className={
        friendManager === "friends"
          ? "search-wrapper"
          : "search-wrapper search-deselected"
      }
    >
      <div className="search-container">
        <div className="search-input-container"></div>
        <div className="search-input-content"></div>
      </div>
    </div>
  );
};

export default Search;
