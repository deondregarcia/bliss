import React, { useEffect, useState } from "react";
import Axios from "axios";
import "./PublicProfile.css";
import {
  FriendListType,
  FriendRequestUserType,
  UserType,
} from "../../types/content";
import { useParams } from "react-router-dom";
import { BucketListType } from "../../types/content";
import FriendBucketList from "../../components/FriendProfileComponents/FriendBucketList/FriendBucketList";
import EmptyArrayMessage from "../../components/EmptyArrayMessage/EmptyArrayMessage";
import FriendProfileContentContainerHeader from "../../components/FriendProfileComponents/FriendProfileContentContainerHeader/FriendProfileContentContainerHeader";
import useAuth from "../../hooks/useAuth";
import { imagesIndex } from "../../assets/images/imagesIndex";

const PublicProfile = () => {
  const { auth } = useAuth();
  const { id } = useParams();
  const [userObject, setUserObject] = useState<UserType>({} as UserType);
  const [publicLists, setPublicLists] = useState<BucketListType[]>([]);
  // user objects of incoming and outgoing friend requests
  const [outgoingFriendRequests, setOutgoingFriendRequests] = useState<
    FriendRequestUserType[]
  >([]);
  const [incomingFriendRequests, setIncomingFriendRequests] = useState<
    FriendRequestUserType[]
  >([]);
  // using this to force a refresh
  const [outgoingFriendRequestStateList, setOutgoingFriendRequestStateList] =
    useState<string[]>([]);
  const [requested, setRequested] = useState(false);
  const [friends, setFriends] = useState<FriendListType[]>([]);

  // state for whether incoming request was accepted or denied
  const [acceptedOrDenied, setAcceptedOrDenied] = useState("neither");

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

  // handle accept request
  const acceptRequest = (username: string) => {
    Axios.post("/user/friends", {
      google_id: id,
    })
      .then((res) => {
        if (res.status === 200) {
          // call deny request to delete from friend_requests
          Axios.delete("/user/friend-request", {
            params: {
              google_id: id,
            },
          })
            .then((res) => {
              if (res.status === 200) {
                setAcceptedOrDenied("accepted");
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
  const denyRequest = (username: string) => {
    Axios.delete("/user/friend-request", {
      params: {
        google_id: id,
      },
    })
      .then((res) => {
        if (res.status === 200) {
          setAcceptedOrDenied("denied");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // send friend request
  const sendFriendRequest = (username: string) => {
    Axios.post("/user/friend-request", {
      requesteeGoogleID: id,
    })
      .then((res) => {
        if (res.status === 200) {
          setRequested(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // get user info from google id
  const getUserInfo = () => {
    Axios.get(`/view/user-info/${id}`)
      .then((res) => {
        setUserObject(res.data.userInfo[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // get all public_random lists
  const getPublicBucketLists = () => {
    Axios.get(`/view/public-lists/${id}`)
      .then((res) => {
        setPublicLists(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // get outgoing friend requests (user sent these)
  const getOutgoingFriendRequests = () => {
    Axios.get(`/user/outgoing-friend-requests`)
      .then((res) => {
        setOutgoingFriendRequests(res.data.outgoingRequestUsers);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // get incoming friend requests (user received these)
  const getIncomingFriendRequests = () => {
    Axios.get(`/user/incoming-friend-requests`)
      .then((res) => {
        setIncomingFriendRequests(res.data.incomingRequestUsers);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // get list of friends in case user enters in /public/:id
  const getFriendsList = () => {
    Axios.get(`/view/list-of-friends`)
      .then((res) => {
        setFriends(res.data.friends);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getUserInfo();
    getPublicBucketLists();

    if (auth?.session_info) {
      getOutgoingFriendRequests();
      getIncomingFriendRequests();
      getFriendsList();
    }
  }, []);

  return (
    <div className="public-profile-container">
      <div className="public-profile-profile-container">
        <h2 className="public-profile-username">{userObject?.username}</h2>
        <img
          src={
            userObject?.google_photo_link &&
            userObject?.google_photo_link !== "undefined"
              ? userObject?.google_photo_link
              : imagesIndex[1]
          }
          referrerPolicy="no-referrer"
          alt="profile"
          className="public-profile-image"
        />
        <div className="public-profile-name-container">
          <h3>
            {userObject?.first_name}{" "}
            {userObject?.last_name ? userObject?.last_name[0] : ""}.
          </h3>
        </div>
        {/* if user is logged in and hasn't already accepted or denied a request */}
        {auth?.session_info &&
          !friendList.includes(userObject?.username) &&
          acceptedOrDenied === "neither" && (
            <div className="public-profile-request-container">
              {/* first, check if profile is in either outgoing or incoming or already requested */}
              {outgoingFriendRequestList.includes(userObject?.username) ||
              incomingFriendRequestList.includes(userObject?.username) ||
              requested ? (
                // if in either one, check if in outgoing, else it is in incoming
                outgoingFriendRequestList.includes(userObject?.username) ||
                requested ? (
                  <h3 className="public-profile-request-user-text">
                    Requested.
                  </h3>
                ) : (
                  <div className="public-profile-request-accept-or-deny-wrapper">
                    <div className="public-profile-request-header">
                      <h3>
                        {userObject?.first_name} wants to be friends with you.
                      </h3>
                    </div>
                    <div className="public-profile-request-button-wrapper">
                      <div
                        onClick={() => acceptRequest(userObject?.username)}
                        className="public-profile-request-request-button"
                      >
                        <h3>Accept</h3>
                      </div>
                      <div
                        onClick={() => denyRequest(userObject?.username)}
                        className="public-profile-request-request-button"
                        style={{ marginLeft: "10px" }}
                      >
                        <h3>Deny</h3>
                      </div>
                    </div>
                  </div>
                )
              ) : (
                <div
                  onClick={() => sendFriendRequest(userObject?.username)}
                  className="public-profile-request-request-button"
                >
                  <h3>Request</h3>
                </div>
              )}
            </div>
          )}

        {/* display only if/once user has accepted or denied a request */}
        {acceptedOrDenied !== "neither" &&
          // if not "accepted", then "denied"
          (acceptedOrDenied === "accepted" ? (
            <h3 className="public-profile-request-user-text">
              Friend Request Accepted
            </h3>
          ) : (
            // if denied
            <h3 className="public-profile-request-user-text">
              Friend Request Denied
            </h3>
          ))}
      </div>
      <div className="public-profile-list-container">
        <FriendProfileContentContainerHeader category="Public" />
        {/* if publicLists is true, render, if null, display message */}
        {publicLists.length > 0 ? (
          publicLists.map((bucketList) => {
            return (
              <FriendBucketList
                bucketList={bucketList}
                key={bucketList.id}
                userObject={userObject}
              />
            );
          })
        ) : (
          <EmptyArrayMessage accountType="public" />
        )}
      </div>
    </div>
  );
};

export default PublicProfile;
