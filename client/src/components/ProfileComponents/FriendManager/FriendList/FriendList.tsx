import React from "react";
import { FriendListType } from "../../../../types/content";
import { imagesIndex } from "../../../../assets/images/imagesIndex";
import { useNavigate } from "react-router-dom";
import "./FriendList.css";

const FriendList = ({ friends }: { friends: FriendListType[] }) => {
  const navigate = useNavigate();

  console.log(friends);

  return (
    <div className="friend-list-wrapper">
      <div className="friend-list-container">
        {friends.map((friend, index) => {
          return (
            <div
              onClick={() => navigate(`/profile/${friend?.google_id}`)}
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
              <h4 className="friend-name">
                {friend.first_name} {friend.last_name[0]}.
              </h4>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FriendList;
