import React, { useState, useEffect, ReactNode, useRef } from "react";
import Axios from "axios";
import "./Profile.css";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import { GoogleUserObjectType } from "../../types/authTypes";

// import types
import {
  BucketListType,
  RecipeContentType,
  UserType,
  FriendListType,
  FullUserListType,
  FriendRequestUserType,
} from "../../types/content";

// import components
import BucketList from "../../components/BucketList/BucketList";
import EmptyArrayMessage from "../../components/EmptyArrayMessage/EmptyArrayMessage";
import ContentContainerHeader from "../../components/ContentContainerHeader/ContentContainerHeader";
import RecipeDisplay from "../../components/ProfileComponents/RecipeDisplay/RecipeDisplay";
import RecipeInput from "../../components/ProfileComponents/RecipeInput/RecipeInput";
import { RecipeInputDefault } from "../../components/ProfileComponents/RecipeInput/RecipeInputDefault";
import useAuth from "../../hooks/useAuth";
import AddBucketList from "../../components/ProfileComponents/AddBucketList/AddBucketList";
import EditBucketList from "../../components/ProfileComponents/EditBucketList/EditBucketList";
import FriendList from "../../components/ProfileComponents/FriendManager/FriendList/FriendList";
import Search from "../../components/ProfileComponents/FriendManager/Search/Search";
import RequestList from "../../components/ProfileComponents/FriendManager/Requests/RequestList";

const Profile = () => {
  const [userID, setUserID] = useState<number>(0);
  const { auth } = useAuth();
  const [googleUserObject, setGoogleUserObject] = useState<
    GoogleUserObjectType | any
  >();
  const [friendManager, setFriendManager] = useState("friends"); // state to display friendlist or search component
  const [requestTabSelected, setRequestTabSelected] = useState(false);
  const [userObject, setUserObject] = useState<UserType | undefined>(undefined);
  const [friends, setFriends] = useState<FriendListType[]>([]);
  const [fullUserList, setFullUserList] = useState<
    FullUserListType[] | undefined
  >(undefined);

  // user objects of incoming and outgoing friend requests
  const [outgoingFriendRequests, setOutgoingFriendRequests] = useState<
    FriendRequestUserType[]
  >([]);
  const [incomingFriendRequests, setIncomingFriendRequests] = useState<
    FriendRequestUserType[]
  >([]);

  const [recipeArray, setRecipeArray] =
    useState<RecipeContentType[]>(RecipeInputDefault);
  const { id } = useParams();

  // set state to display AddBucketList component
  const [publicAdd, setPublicAdd] = useState(false);
  const [sharedAdd, setSharedAdd] = useState(false);
  const [privateAdd, setPrivateAdd] = useState(false);

  // set state to display EditBucketList component
  const [publicEdit, setPublicEdit] = useState(false);
  const [sharedEdit, setSharedEdit] = useState(false);
  const [privateEdit, setPrivateEdit] = useState(false);

  // ID's to grab when editing per each section
  const [publicEditObject, setPublicEditObject] =
    useState<BucketListType | null>(null);
  const [sharedEditObject, setSharedEditObject] =
    useState<BucketListType | null>(null);
  const [privateEditObject, setPrivateEditObject] =
    useState<BucketListType | null>(null);

  const [triggerRefresh, setTriggerRefresh] = useState(false);

  // separate the bucket list arrays for easier nullish checks in render
  const [publicBucketListArray, setPublicBucketListArray] = useState<
    BucketListType[]
  >([]);
  const [sharedBucketListArray, setSharedBucketListArray] = useState<
    BucketListType[]
  >([]);
  const [privateBucketListArray, setPrivateBucketListArray] = useState<
    BucketListType[]
  >([]);

  // grab bucket_list_tracker data
  const getBucketListData = () => {
    // google_id
    Axios.get(
      `/view/lists/${JSON.parse(auth.session_info.data).passport.user.id}`
    )
      .then((response) => {
        setPublicBucketListArray(
          response.data.data.filter((bucketList: BucketListType) => {
            return (
              bucketList.privacy_type === "public_friends" ||
              bucketList.privacy_type === "public_random"
            );
          })
        );
        setSharedBucketListArray(
          response.data.data.filter((bucketList: BucketListType) => {
            return bucketList.privacy_type === "shared";
          })
        );
        setPrivateBucketListArray(
          response.data.data.filter((bucketList: BucketListType) => {
            return bucketList.privacy_type === "private";
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // get google user info
  const getGoogleUserInfo = () => {
    Axios.get("/googleuser")
      .then((res) => {
        setGoogleUserObject(res.data.google_user);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // get user info from google id
  const getUserInfo = () => {
    Axios.get(`/view/get-user-info/${id}`)
      .then((res) => {
        setUserObject(res.data.userInfo[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // get list of friends
  const getFriendsList = () => {
    Axios.get(`/view/get-list-of-friends/${id}`)
      .then((res) => {
        setFriends(res.data.friends);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // get full list of users, excluding current user
  const getFullUserList = () => {
    Axios.get(`/view/get-full-user-list/${id}`)
      .then((res) => {
        setFullUserList(res.data.userList);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // get outgoing friend requests (user sent these)
  const getOutgoingFriendRequests = () => {
    Axios.get(`/get-outgoing-friend-requests/${id}`)
      .then((res) => {
        console.log(res.data.outgoingRequestUsers);
        setOutgoingFriendRequests(res.data.outgoingRequestUsers);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // get outgoing friend requests (user sent these)
  const getIncomingFriendRequests = () => {
    Axios.get(`/get-incoming-friend-requests/${id}`)
      .then((res) => {
        console.log(res.data.incomingRequestUsers);
        setIncomingFriendRequests(res.data.incomingRequestUsers);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // combine funcs to hopefully improve performance
  const runInitialFunctions = () => {
    getBucketListData();
    getGoogleUserInfo();
    getUserInfo();
    getFriendsList();
    getFullUserList();
    getOutgoingFriendRequests();
    getIncomingFriendRequests();
  };

  useEffect(() => {
    runInitialFunctions();

    return () => {};
  }, []);

  useEffect(() => {
    getBucketListData();
    return () => {};
  }, [triggerRefresh]);

  return (
    <>
      <div className="home-container">
        <div className="profile-info">
          <h2>{userObject?.username}</h2>
          <img
            // src={googleUserObject?.photos[0].value}
            src={userObject?.google_photo_link}
            referrerPolicy="no-referrer" // referrer policy that blocked loading of img sometimes - look into it
            alt="google profile picture"
            className="profile-pic"
          />
          <div className="profile-info-name-container">
            <h3>{userObject?.first_name}</h3>
            <h3>{userObject?.last_name}</h3>
          </div>
          <div className="profile-wants-to-container">
            <h3 className="profile-wants-to-container-header">I want to...</h3>
            <div className="profile-separator" />
            {userObject?.wants_to ? (
              <p className="profile-wants-to">{userObject?.wants_to}</p>
            ) : (
              <p className="profile-wants-to-empty">
                You haven't added anything here yet!
              </p>
            )}
          </div>
        </div>
        <div className="content-container public">
          <ContentContainerHeader
            setCallback={setPublicAdd}
            addState={publicAdd}
            category="Public"
          />
          {publicAdd && (
            <AddBucketList
              setCallback={setPublicAdd}
              addState={publicAdd}
              privacyType="public"
              setTriggerRefresh={setTriggerRefresh}
              triggerRefresh={triggerRefresh}
            />
          )}
          {publicEdit && (
            <EditBucketList
              setCallback={setPublicEdit}
              editState={publicEdit}
              setTriggerRefresh={setTriggerRefresh}
              triggerRefresh={triggerRefresh}
              arraySpecificObject={publicEditObject}
            />
          )}
          <div className="content-container-bucket-list-wrapper">
            {/* if publicBucketListArray is true, render, if null, display message */}
            {publicBucketListArray.length > 0 ? (
              publicBucketListArray.map((bucketList) => {
                return (
                  <BucketList
                    bucketList={bucketList}
                    setArrayObject={setPublicEditObject}
                    setEditMode={setPublicEdit}
                    key={bucketList.id}
                  />
                );
              })
            ) : (
              <EmptyArrayMessage />
            )}
          </div>
        </div>
        <div className="right-column-container friend-feed">
          <h2 className="side-container-header">Recent Friend Activities</h2>
          <div className="side-container-header-separator" />
        </div>

        {/* <div className="today-i-should-container">
          <h2 className="side-container-header">Today, I should...</h2>
          <div className="side-container-header-separator" />
          <p>Today I should try working out</p>
        </div> */}
        <div
          id="test3"
          className="content-container shared"
          style={sharedEdit ? { overflowY: "hidden" } : { overflowY: "scroll" }}
        >
          <ContentContainerHeader
            setCallback={setSharedAdd}
            addState={sharedAdd}
            category="Shared"
          />
          {sharedAdd && (
            <AddBucketList
              setCallback={setSharedAdd}
              addState={sharedAdd}
              privacyType="shared"
              setTriggerRefresh={setTriggerRefresh}
              triggerRefresh={triggerRefresh}
            />
          )}
          {sharedEdit && (
            <EditBucketList
              setCallback={setSharedEdit}
              editState={sharedEdit}
              setTriggerRefresh={setTriggerRefresh}
              triggerRefresh={triggerRefresh}
              arraySpecificObject={sharedEditObject}
            />
          )}
          <div className="content-container-bucket-list-wrapper">
            {sharedBucketListArray.length > 0 ? (
              sharedBucketListArray.map((bucketList) => {
                return (
                  <BucketList
                    bucketList={bucketList}
                    setArrayObject={setSharedEditObject}
                    setEditMode={setSharedEdit}
                    key={bucketList.id}
                  />
                );
              })
            ) : (
              <EmptyArrayMessage />
            )}
          </div>
        </div>
        <div className="right-column-container friend-manager">
          <div className="friend-manager-header-container">
            <div
              onClick={() => setFriendManager("friends")}
              className={
                friendManager === "friends"
                  ? "friend-manager-header-clicked my-friends"
                  : "friend-manager-header my-friends"
              }
            >
              <h2>Friends</h2>
            </div>
            <div
              onClick={() => setFriendManager("search")}
              className={
                friendManager === "search"
                  ? "friend-manager-header-clicked search"
                  : "friend-manager-header search"
              }
            >
              <h2>Search</h2>
            </div>
          </div>
          <div className="side-container-header-separator" />
          <div className="friend-manager-content-container">
            <FriendList friendManager={friendManager} friends={friends} />
            <Search
              friendManager={friendManager}
              fullUserList={fullUserList}
              friends={friends}
              outgoingFriendRequests={outgoingFriendRequests}
            />
            <div
              className={
                requestTabSelected
                  ? "friend-manager-request-tab request-tab-selected"
                  : "friend-manager-request-tab"
              }
            >
              <div
                onClick={() => setRequestTabSelected(!requestTabSelected)}
                className="friend-manager-request-tab-button"
              >
                <h3>Requests</h3>
                <div className="friend-manager-request-count">
                  <h3>
                    {incomingFriendRequests.length > 0
                      ? incomingFriendRequests.length
                      : "0"}
                  </h3>
                </div>
              </div>
              <div className="friend-manager-request-tab-bar">
                <RequestList incomingFriendRequests={incomingFriendRequests} />
              </div>
            </div>
          </div>
        </div>
        <div
          className="content-container private"
          style={
            privateEdit ? { overflowY: "hidden" } : { overflowY: "scroll" }
          }
        >
          <ContentContainerHeader
            setCallback={setPrivateAdd}
            addState={privateAdd}
            category="Private"
          />
          {privateAdd && (
            <AddBucketList
              setCallback={setPrivateAdd}
              addState={privateAdd}
              privacyType="private"
              setTriggerRefresh={setTriggerRefresh}
              triggerRefresh={triggerRefresh}
            />
          )}
          {privateEdit && (
            <EditBucketList
              setCallback={setPrivateEdit}
              editState={privateEdit}
              setTriggerRefresh={setTriggerRefresh}
              triggerRefresh={triggerRefresh}
              arraySpecificObject={privateEditObject}
            />
          )}
          <div className="content-container-bucket-list-wrapper">
            {privateBucketListArray.length > 0 ? (
              privateBucketListArray.map((bucketList) => {
                return (
                  <BucketList
                    bucketList={bucketList}
                    setArrayObject={setPrivateEditObject}
                    setEditMode={setPrivateEdit}
                    key={bucketList.id}
                  />
                );
              })
            ) : (
              <EmptyArrayMessage />
            )}
          </div>
        </div>
        <div className="right-column-container recipe-suggestions">
          <h2 className="side-container-header">Recipe Suggestions</h2>
          <div className="side-container-header-separator" />
          <RecipeInput setRecipeArray={setRecipeArray} />
          <div className="recipe-api-content">
            {recipeArray?.map((recipe, index) => {
              return (
                <div key={index}>
                  <RecipeDisplay recipe={recipe} />
                  <div className="recipe-separator" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
