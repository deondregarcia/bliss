import React, { useEffect, useState } from "react";
import {
  FriendListType,
  FriendRequestUserType,
  FullUserListType,
} from "../../../../types/content";
import Axios from "axios";
import "./SampleSearchList.css";
import { imagesIndex } from "../../../../assets/images/imagesIndex";

const SampleSearchList = ({
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

  return (
    <div className="sample-account-search-list-wrapper">
      <div className="sample-account-search-list-container">
        {searchInput.length > 0 &&
          fullUserList?.map((user, index) => {
            if (
              user?.username.toLowerCase().match(searchInput.toLowerCase()) ||
              user?.first_name.toLowerCase().match(searchInput.toLowerCase())
            ) {
              return (
                <div
                  key={index}
                  className="sample-account-search-list-user-card"
                >
                  <img
                    src={
                      user?.google_photo_link &&
                      user?.google_photo_link !== "undefined"
                        ? user?.google_photo_link
                        : imagesIndex[1]
                    }
                    referrerPolicy="no-referrer"
                    className="sample-account-search-list-user-image"
                    alt="profile"
                  />
                  <div className="sample-account-search-list-user-info">
                    <h4 className="sample-account-search-list-user-username">
                      {user?.username}{" "}
                    </h4>
                    <h3 className="sample-account-search-list-user-name">
                      , {user?.first_name}
                    </h3>
                  </div>
                  <div className="sample-account-search-list-user-body">
                    {/* check if friends if username matches that in friends list */}
                    {friendList.includes(user?.username) ? (
                      <h3 className="sample-account-search-list-user-text">
                        Friends!
                      </h3>
                    ) : incomingFriendRequestList.includes(user?.username) ? (
                      <p className="sample-account-search-list-user-text-small">
                        Has already requested you. Check the requests tab to
                        accept or deny.
                      </p>
                    ) : outgoingFriendRequestList.includes(user?.username) ||
                      outgoingFriendRequestStateList.includes(
                        user?.username
                      ) ? (
                      <h3 className="sample-account-search-list-user-text">
                        Requested.
                      </h3>
                    ) : (
                      <div className="sample-account-search-list-request-button">
                        <h3>Request</h3>
                      </div>
                    )}
                  </div>
                  <div className="sample-account-search-list-link">
                    <h4 className="sample-account-search-list-link-text">
                      View profile
                    </h4>
                  </div>
                </div>
              );
            }
          })}
      </div>
    </div>
  );
};

export default SampleSearchList;
