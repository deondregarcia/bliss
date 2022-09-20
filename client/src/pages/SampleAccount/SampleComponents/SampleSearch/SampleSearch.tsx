import React, { useState } from "react";
import {
  FriendListType,
  FriendRequestUserType,
  FullUserListType,
} from "../../../../types/content";
import "./SampleSearch.css";
import SampleSearchList from "./SampleSearchList";

const SampleSearch = ({
  friendManager,
  fullUserList,
  friends,
  outgoingFriendRequests,
  incomingFriendRequests,
}: {
  friendManager: string;
  fullUserList: FullUserListType[] | undefined;
  friends: FriendListType[];
  outgoingFriendRequests: FriendRequestUserType[];
  incomingFriendRequests: FriendRequestUserType[];
}) => {
  const [searchInput, setSearchInput] = useState<string>("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearchInput(e.target.value);
  };

  return (
    <div
      className={
        friendManager === "friends"
          ? "sample-account-search-wrapper"
          : "sample-account-search-wrapper sample-account-search-deselected"
      }
    >
      <div className="sample-account-search-container">
        <div className="sample-account-search-input-container">
          <label htmlFor="search-bar">Search:</label>
          <input
            type="text"
            value={searchInput}
            onChange={handleSearch}
            placeholder="Enter name or username"
          />
        </div>
        <div className="sample-account-search-input-content">
          <SampleSearchList
            searchInput={searchInput}
            fullUserList={fullUserList}
            friends={friends}
            outgoingFriendRequests={outgoingFriendRequests}
            incomingFriendRequests={incomingFriendRequests}
          />
        </div>
      </div>
    </div>
  );
};

export default SampleSearch;
