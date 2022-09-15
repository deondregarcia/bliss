import React, { useState } from "react";
import { FriendRequestUserType } from "../../../../types/content";
import Axios from "axios";
import "./RequestList.css";
import { ViewProfileButton } from "../../../Buttons/Buttons";

const RequestList = ({
  incomingFriendRequests,
  requestTabSelected,
}: {
  incomingFriendRequests: FriendRequestUserType[];
  requestTabSelected: boolean;
}) => {
  const [acceptedList, setAcceptedList] = useState<string[]>([]);
  const [deniedList, setDeniedList] = useState<string[]>([]);

  // handle accept request
  const acceptRequest = (friendGoogleID: string, username: string) => {
    Axios.post("/user/friends", {
      google_id: friendGoogleID,
    })
      .then((res) => {
        if (res.status === 200) {
          // call deny request to delete from friend_requests
          Axios.delete("/user/friend-request", {
            params: {
              google_id: friendGoogleID,
            },
          })
            .then((res) => {
              if (res.status === 200) {
                setAcceptedList((prevState) => [...prevState, username]);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          return;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // handle deny request
  const denyRequest = (friendGoogleID: string, username: string) => {
    Axios.delete("/user/friend-request", {
      params: {
        google_id: friendGoogleID,
      },
    })
      .then((res) => {
        if (res.status === 200) {
          setDeniedList((prevState) => [...prevState, username]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div
      className={
        requestTabSelected
          ? "request-list-wrapper"
          : "request-list-wrapper request-list-hidden"
      }
    >
      <div className="request-list-container">
        {incomingFriendRequests?.map((user, index) => {
          return (
            <div key={index} className="request-list-user-card">
              <div className="request-list-view-profile-wrapper">
                <ViewProfileButton googleID={user?.google_id} />
              </div>
              <img
                src={user?.google_photo_link}
                className="request-list-user-image"
                alt="profile"
              />
              <div className="request-list-user-info">
                <h4 className="request-list-user-username">{user?.username}</h4>
              </div>
              <div className="request-list-user-body">
                {acceptedList.includes(user?.username) ? (
                  <h3 className="request-list-user-text">Accepted!</h3>
                ) : deniedList.includes(user?.username) ? (
                  <h3 className="request-list-user-text">Denied.</h3>
                ) : (
                  <div className="request-list-button-wrapper">
                    <div
                      onClick={() =>
                        acceptRequest(user?.google_id, user?.username)
                      }
                      className="request-list-request-button"
                    >
                      <h3>Accept</h3>
                    </div>
                    <div
                      onClick={() =>
                        denyRequest(user?.google_id, user?.username)
                      }
                      className="request-list-request-button"
                      style={{ marginLeft: "10px" }}
                    >
                      <h3>Deny</h3>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RequestList;
