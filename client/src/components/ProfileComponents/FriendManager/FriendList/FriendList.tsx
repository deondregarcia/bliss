import React, { useState } from "react";
import { FriendListType } from "../../../../types/content";
import { imagesIndex } from "../../../../assets/images/imagesIndex";
import { useNavigate } from "react-router-dom";
import "./FriendList.css";

const FriendList = ({
  friends,
  friendManager,
}: {
  friends: FriendListType[];
  friendManager: string;
}) => {
  const navigate = useNavigate();
  const [nav, setNav] = useState(false);

  console.log(friends);

  return (
    <div
      className={
        friendManager === "friends"
          ? "friend-list-wrapper"
          : "friend-list-wrapper friend-list-deselected"
      }
    >
      <div className="friend-list-container">
        {friends.map((friend, index) => {
          return (
            // use <a> tag because the navigate doesn't work with CheckUserOrFriend Route
            <a href={`/profile/${friend?.google_id}`}>
              <div
                // onClick={() => navigate(`/profile/${friend?.google_id}`)}
                className="friend-list-profile-wrapper"
                key={index}
              >
                <img
                  src={
                    friend.google_photo_link
                      ? friend.google_photo_link
                      : imagesIndex[0]
                  }
                  alt="default profile picture"
                  className="friend-image"
                />
                <h4 className="friend-list-content-header">Wants to...</h4>
                <div className="friend-list-content-body-container">
                  <p className="friend-list-content-body">
                    {/* if wants_to >= 50, cut and add a ... ; if it is null, add default string */}
                    {friend?.wants_to
                      ? friend?.wants_to.length >= 50
                        ? `${friend?.wants_to.slice(0, 49)}...`
                        : friend?.wants_to
                      : `${friend?.first_name} hasn't added anything yet`}
                  </p>
                </div>
                <h4 className="friend-name">
                  {friend.first_name} {friend.last_name[0]}.
                </h4>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default FriendList;
