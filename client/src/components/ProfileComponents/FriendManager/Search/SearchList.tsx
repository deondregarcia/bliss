import React, { useEffect, useState } from "react";
import {
  FriendListType,
  FriendRequestUserType,
  FullUserListType,
} from "../../../../types/content";
import Axios from "axios";
import "./SearchList.css";

const SearchList = ({
  searchInput,
  fullUserList,
  friends,
  outgoingFriendRequests,
  incomingFriendRequests,
}: {
  searchInput: string;
  fullUserList: FullUserListType[] | undefined;
  friends: FriendListType[];
  outgoingFriendRequests: FriendRequestUserType[];
  incomingFriendRequests: FriendRequestUserType[];
}) => {
  // using this to force a refresh
  const [outgoingFriendRequestStateList, setOutgoingFriendRequestStateList] =
    useState<string[]>([]);
  const friendList: string[] = [];
  const outgoingFriendRequestList: string[] = [];
  const incomingFriendRequestList: string[] = [];

  for (let i = 0; i < friends.length; i++) {
    friendList.push(friends[i].username);
  }

  for (let i = 0; i < outgoingFriendRequests.length; i++) {
    outgoingFriendRequestList.push(outgoingFriendRequests[i].username);
  }

  for (let i = 0; i < incomingFriendRequests.length; i++) {
    incomingFriendRequestList.push(incomingFriendRequests[i].username);
  }

  // send friend request
  const sendFriendRequest = (googleID: string, username: string) => {
    Axios.post("/user/friend-request", {
      requesteeGoogleID: googleID,
    })
      .then((res) => {
        if (res.status === 200) {
          setOutgoingFriendRequestStateList((prevState) => [
            ...prevState,
            username,
          ]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="search-list-wrapper">
      <div className="search-list-container">
        {searchInput.length > 0 &&
          fullUserList?.map((user, index) => {
            if (
              user?.username.toLowerCase().match(searchInput.toLowerCase()) ||
              user?.first_name.toLowerCase().match(searchInput.toLowerCase())
            ) {
              return (
                <div key={index} className="search-list-user-card">
                  <img
                    src={user?.google_photo_link}
                    className="search-list-user-image"
                    alt="profile"
                  />
                  <div className="search-list-user-info">
                    <h4 className="search-list-user-username">
                      {user?.username}{" "}
                    </h4>
                    <h3 className="search-list-user-name">
                      , {user?.first_name}
                    </h3>
                  </div>
                  <div className="search-list-user-body">
                    {/* check if friends if username matches that in friends list */}
                    {friendList.includes(user?.username) ? (
                      <h3 className="search-list-user-text">Friends!</h3>
                    ) : incomingFriendRequestList.includes(user?.username) ? (
                      <p className="search-list-user-text-small">
                        Has already requested you. Check the requests tab to
                        accept or deny.
                      </p>
                    ) : outgoingFriendRequestList.includes(user?.username) ||
                      outgoingFriendRequestStateList.includes(
                        user?.username
                      ) ? (
                      <h3 className="search-list-user-text">Requested.</h3>
                    ) : (
                      <div
                        onClick={() =>
                          sendFriendRequest(user?.google_id, user?.username)
                        }
                        className="search-list-request-button"
                      >
                        <h3>Request</h3>
                      </div>
                    )}
                  </div>
                  <div className="search-list-link">
                    <a href={`/profile/${user?.google_id}`}>
                      <h4 className="search-list-link-text">View profile</h4>
                    </a>
                  </div>
                </div>
              );
            }
          })}
      </div>
    </div>
  );
};

export default SearchList;
