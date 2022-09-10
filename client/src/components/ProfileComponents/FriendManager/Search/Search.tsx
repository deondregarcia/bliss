import React, { useState } from "react";
import {
  FriendListType,
  FriendRequestUserType,
  FullUserListType,
} from "../../../../types/content";
import "./Search.css";
import SearchList from "./SearchList";

const Search = ({
  friendManager,
  fullUserList,
  friends,
  outgoingFriendRequests,
}: {
  friendManager: string;
  fullUserList: FullUserListType[] | undefined;
  friends: FriendListType[];
  outgoingFriendRequests: FriendRequestUserType[];
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
          ? "search-wrapper"
          : "search-wrapper search-deselected"
      }
    >
      <div className="search-container">
        <div className="search-input-container">
          <label htmlFor="search-bar">Search:</label>
          <input
            type="text"
            value={searchInput}
            onChange={handleSearch}
            placeholder="Enter name or username"
          />
        </div>
        <div className="search-input-content">
          <SearchList
            searchInput={searchInput}
            fullUserList={fullUserList}
            friends={friends}
            outgoingFriendRequests={outgoingFriendRequests}
          />
        </div>
      </div>
    </div>
  );
};

export default Search;
