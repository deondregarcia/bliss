import React, { useState } from "react";
import { FriendListType } from "../../../types/content";
import { AiFillCaretUp } from "react-icons/ai";
import "./SelectSharedDropdown.css";

const SelectSharedDropdown = ({
  friends,
  selectedUsers,
  setSelectedUsers,
}: {
  friends: FriendListType[];
  selectedUsers: FriendListType[];
  setSelectedUsers: React.Dispatch<React.SetStateAction<FriendListType[]>>;
}) => {
  const [dropdownOpened, setDropdownOpened] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  // logic to add user; limit to only adding once
  const handleSelectUser = (friend: FriendListType) => {
    if (selectedUsers?.includes(friend)) {
      return;
    } else {
      setSelectedUsers((prevState) => [...prevState, friend]);
    }
  };

  return (
    <div className="shared-dropdown-container">
      <div className="shared-dropdown-input-container">
        <div
          onClick={() => setDropdownOpened(!dropdownOpened)}
          className="shared-dropdown-input-box"
        >
          <h3>Select friends</h3>
          <AiFillCaretUp
            size={22}
            color="black"
            className={
              dropdownOpened
                ? "shared-dropdown-input-box-arrow shared-dropdown-input-box-arrow-opened"
                : "shared-dropdown-input-box-arrow"
            }
          />
        </div>
        {/* increase height of wrapper for list to slide up into for dropdown visual effect */}
        <div className="shared-dropdown-options-list-background-wrapper">
          <div
            className={
              dropdownOpened
                ? "shared-dropdown-options-list"
                : "shared-dropdown-options-list shared-dropdown-options-list-closed"
            }
          >
            {friends?.length > 0 ? (
              friends?.map((friend, index) => {
                return (
                  <div
                    onClick={() => handleSelectUser(friend)}
                    key={index}
                    className={
                      selectedUsers?.includes(friend)
                        ? "shared-dropdown-options-list-user-container shared-dropdown-options-list-user-container-selected"
                        : "shared-dropdown-options-list-user-container"
                    }
                  >
                    <p>{friend.username}</p>
                  </div>
                );
              })
            ) : (
              <h3>No friends added yet.</h3>
            )}
          </div>
        </div>
      </div>
      <div className="shared-dropdown-selected-section-container">
        <h2 className="shared-dropdown-selected-section-header">
          Sharing with:
        </h2>
        <div className="shared-dropdown-selected-section">
          {selectedUsers?.map((user, index) => {
            return (
              <div
                key={index}
                className="shared-dropdown-selected-user-container"
              >
                <div
                  onClick={() =>
                    setSelectedUsers(
                      selectedUsers.filter((filteredUser) => {
                        return filteredUser.username !== user.username;
                      })
                    )
                  }
                  className="shared-dropdown-selected-user-remove"
                >
                  <p>X</p>
                </div>
                <p className="shared-dropdown-selected-user-username">
                  {user.username}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SelectSharedDropdown;
