import React, { useState } from "react";
import { FriendListType } from "../../../../types/content";
import { imagesIndex } from "../../../../assets/images/imagesIndex";
import { useNavigate } from "react-router-dom";
import "./SampleFriendList.css";

const SampleFriendList = ({
  friends,
  friendManager,
}: {
  friends: FriendListType[];
  friendManager: string;
}) => {
  const navigate = useNavigate();
  const [nav, setNav] = useState(false);

  return (
    <div
      className={
        friendManager === "friends"
          ? "sample-account-friend-list-wrapper"
          : "sample-account-friend-list-wrapper sample-account-friend-list-deselected"
      }
    >
      <div className="sample-account-friend-list-container">
        {friends.map((friend, index) => {
          return (
            // use <a> tag because the navigate doesn't work with CheckUserOrFriend Route
            <div
              key={index}
              className="sample-account-friend-list-profile-wrapper"
            >
              <img
                src={
                  friend.google_photo_link &&
                  friend.google_photo_link !== "undefined"
                    ? friend.google_photo_link
                    : imagesIndex[1]
                }
                referrerPolicy="no-referrer"
                alt="default profile picture"
                className="sample-account-friend-image"
              />
              <h4 className="sample-account-friend-list-content-header">
                Wants to...
              </h4>
              <div className="sample-account-friend-list-content-body-container">
                <p className="sample-account-friend-list-content-body">
                  {/* if wants_to >= 50, cut and add a ... ; if it is null, add default string */}
                  {friend?.wants_to
                    ? friend?.wants_to.length >= 50
                      ? `${friend?.wants_to.slice(0, 49)}...`
                      : friend?.wants_to
                    : `${friend?.first_name} hasn't added anything yet`}
                </p>
              </div>
              <h4 className="sample-account-friend-name">
                {friend.first_name} {friend.last_name[0]}.
              </h4>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SampleFriendList;
