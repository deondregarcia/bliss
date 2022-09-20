import React, { useState } from "react";
import { FriendRequestUserType } from "../../../../types/content";
import Axios from "axios";
import "./SampleRequestList.css";
import { SampleViewProfileButton } from "../../../../components/Buttons/Buttons";
import { imagesIndex } from "../../../../assets/images/imagesIndex";

const SampleRequestList = ({
  incomingFriendRequests,
  requestTabSelected,
}: {
  incomingFriendRequests: FriendRequestUserType[];
  requestTabSelected: boolean;
}) => {
  const [acceptedList, setAcceptedList] = useState<string[]>([]);
  const [deniedList, setDeniedList] = useState<string[]>([]);

  return (
    <div
      className={
        requestTabSelected
          ? "sample-account-request-list-wrapper"
          : "sample-account-request-list-wrapper sample-account-request-list-hidden"
      }
    >
      <div className="sample-account-request-list-container">
        {incomingFriendRequests?.map((user, index) => {
          return (
            <div key={index} className="sample-account-request-list-user-card">
              <div className="sample-account-request-list-view-profile-wrapper">
                <SampleViewProfileButton />
              </div>
              <img
                src={
                  user?.google_photo_link &&
                  user?.google_photo_link !== "undefined"
                    ? user?.google_photo_link
                    : imagesIndex[1]
                }
                referrerPolicy="no-referrer"
                className="sample-account-request-list-user-image"
                alt="profile"
              />
              <div className="sample-account-request-list-user-info">
                <h4 className="sample-account-request-list-user-username">
                  {user?.username}
                </h4>
              </div>
              <div className="sample-account-request-list-user-body">
                {acceptedList.includes(user?.username) ? (
                  <h3 className="sample-account-request-list-user-text">
                    Accepted!
                  </h3>
                ) : deniedList.includes(user?.username) ? (
                  <h3 className="sample-account-request-list-user-text">
                    Denied.
                  </h3>
                ) : (
                  <div className="sample-account-request-list-button-wrapper">
                    <div className="sample-account-request-list-request-button">
                      <h3>Accept</h3>
                    </div>
                    <div
                      className="sample-account-request-list-request-button"
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

export default SampleRequestList;
