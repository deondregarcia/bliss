import React, { useState, useEffect } from "react";
import Axios from "axios";
import "./SampleAccount.css";
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
  SharedListUserType,
  BucketListContentType,
} from "../../types/content";

// import components
import BucketList from "../../components/BucketList/BucketList";
import DisabledBucketList from "./SampleComponents/DisabledBucketList/DisabledBucketList";
import EmptyArrayMessage from "../../components/EmptyArrayMessage/EmptyArrayMessage";
import ContentContainerHeader from "../../components/ContentContainerHeader/ContentContainerHeader";
import RecipeDisplay from "../../components/ProfileComponents/RecipeDisplay/RecipeDisplay";
import RecipeInput from "../../components/ProfileComponents/RecipeInput/RecipeInput";
import { RecipeInputDefault } from "../../components/ProfileComponents/RecipeInput/RecipeInputDefault";
import useAuth from "../../hooks/useAuth";
import SampleAddBucketList from "./SampleComponents/SampleAddBucketList/SampleAddBucketList";
import EditBucketList from "../../components/ProfileComponents/EditBucketList/EditBucketList";
import SampleFriendList from "./SampleComponents/SampleFriendList/SampleFriendList";
import SampleSearch from "./SampleComponents/SampleSearch/SampleSearch";
import SampleRequestList from "./SampleComponents/SampleRequestList/SampleRequestList";
import SampleWantsToEdit from "./SampleComponents/SampleWantsToEdit/SampleWantsToEdit";
import RecentFriendActivities from "../../components/ProfileComponents/RecentFriendActivities/RecentFriendActivities";

// import react-icons
import { MdEdit } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { imagesIndex } from "../../assets/images/imagesIndex";

const Profile = () => {
  const [googleUserObject, setGoogleUserObject] = useState<
    GoogleUserObjectType | any
  >();
  const [friendManager, setFriendManager] = useState("friends"); // state to display friendlist or search component
  const [requestTabSelected, setRequestTabSelected] = useState(false);
  const [userObject, setUserObject] = useState<UserType>({} as UserType);
  // array of friend objects
  const [friends, setFriends] = useState<FriendListType[]>([]);
  const [fullUserList, setFullUserList] = useState<
    FullUserListType[] | undefined
  >(undefined);

  // array for recent friend activities
  const [recentFriendActivities, setRecentFriendActivities] = useState<
    BucketListContentType[]
  >([]);

  // user objects of incoming and outgoing friend requests
  const [outgoingFriendRequests, setOutgoingFriendRequests] = useState<
    FriendRequestUserType[]
  >([]);
  const [incomingFriendRequests, setIncomingFriendRequests] = useState<
    FriendRequestUserType[]
  >([]);

  const [recipeArray, setRecipeArray] =
    useState<RecipeContentType[]>(RecipeInputDefault);
  //   const { id } = useParams();

  // set state to display AddBucketList component
  const [publicAdd, setPublicAdd] = useState(false);
  const [sharedAdd, setSharedAdd] = useState(false);
  const [privateAdd, setPrivateAdd] = useState(false);

  // set state to display EditBucketList component
  const [publicEdit, setPublicEdit] = useState(false);
  const [sharedEdit, setSharedEdit] = useState(false);
  const [privateEdit, setPrivateEdit] = useState(false);

  // state to display "I want to..." editing overlay
  const [wantsToState, setWantsToState] = useState(false);
  const [didWantsToUpdate, setDidWantsToUpdate] = useState<string>("no");

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

  // bucket_list_id's and contributor id's of all shared_list_users
  const [contributorObjects, setContributorObjects] = useState<
    SharedListUserType[]
  >([]);
  // contributers' ID array to grab when editing
  const [contributorUserObjectsArray, setContributorUserObjectsArray] =
    useState<FriendListType[]>([]);

  // grab bucket_list_tracker data
  const getBucketListData = () => {
    // google_id
    Axios.get(`/view/lists/108259638600875384112`)
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

  // get list of shared_list_users user objects where owner_id=(user's ID)
  const getAllContributors = () => {
    Axios.get("/sample/all-contributors")
      .then((res) => {
        setContributorObjects(res.data.contributorObjects);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // get user info from db and google user info
  const getUserInfo = () => {
    Axios.get(`/view/user-info/108259638600875384112`)
      .then((res) => {
        setUserObject(res.data.userInfo[0]);
        Axios.get("/sample/googleuser")
          .then((responseTwo) => {
            setGoogleUserObject(responseTwo.data.google_user);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // get list of friends
  const getFriendsList = () => {
    Axios.get(`/sample/list-of-friends`)
      .then((res) => {
        setFriends(res.data.friends);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // get full list of users, excluding current user
  const getFullUserList = () => {
    Axios.get(`/view/full-user-list/108259638600875384112`)
      .then((res) => {
        setFullUserList(res.data.userList);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // get outgoing friend requests (user sent these)
  const getOutgoingFriendRequests = () => {
    Axios.get(`/sample/outgoing-friend-requests`)
      .then((res) => {
        setOutgoingFriendRequests(res.data.outgoingRequestUsers);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // get incoming friend requests (user received these)
  const getIncomingFriendRequests = () => {
    Axios.get(`/sample/incoming-friend-requests`)
      .then((res) => {
        setIncomingFriendRequests(res.data.incomingRequestUsers);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // get recently added activities from friends
  const getRecentFriendActivities = () => {
    Axios.get("/sample/recent-friend-activities").then((res) => {
      setRecentFriendActivities(res.data.data);
    });
  };

  // combine funcs to hopefully improve performance
  const runInitialFunctions = () => {
    getBucketListData();
    getAllContributors();
    getUserInfo();
    getFriendsList();
    getFullUserList();
    getOutgoingFriendRequests();
    getIncomingFriendRequests();
    getRecentFriendActivities();
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
      <div className="sample-account-disabled-message">
        <h3>
          Since this is a sample account, some elements of the "Friends and
          Search", Shared, and Private sections have been disabled.
        </h3>
      </div>
      <div className="sample-account-home-container">
        <div className="sample-account-profile-info">
          <h2>{userObject?.username}</h2>
          <img
            src={
              googleUserObject?.photos[0].value &&
              googleUserObject?.photos[0].value !== undefined
                ? googleUserObject?.photos[0].value
                : imagesIndex[1]
            }
            referrerPolicy="no-referrer" // referrer policy that blocked loading of img sometimes - look into it
            alt="google profile picture"
            className="sample-account-profile-pic"
          />
          <div className="sample-account-profile-info-name-container">
            <h3>{userObject?.first_name}</h3>
            <h3>{userObject?.last_name}</h3>
          </div>
          <div className="sample-account-profile-wants-to-container">
            <div className="sample-account-profile-wants-to-header-wrapper">
              <h3 className="sample-account-profile-wants-to-container-header">
                I want to...
              </h3>
              {wantsToState ? (
                <IoClose
                  onClick={() => setWantsToState(false)}
                  size={24}
                  className="sample-account-profile-wants-to-icon"
                />
              ) : (
                <MdEdit
                  onClick={() => setWantsToState(true)}
                  size={24}
                  className="sample-account-profile-wants-to-icon"
                />
              )}
            </div>
            <div className="sample-account-profile-separator" />
            {wantsToState ? (
              <SampleWantsToEdit
                // wantsToText={userObject?.wants_to}
                wantsToText={
                  didWantsToUpdate === "no"
                    ? userObject?.wants_to
                    : didWantsToUpdate
                }
                setWantsToState={setWantsToState}
                setDidWantsToUpdate={setDidWantsToUpdate}
              />
            ) : userObject?.wants_to ? (
              <p className="sample-account-profile-wants-to">
                {didWantsToUpdate === "no"
                  ? userObject?.wants_to
                  : didWantsToUpdate}
              </p>
            ) : (
              <p className="sample-account-profile-wants-to-empty">
                You haven't added anything here yet!
              </p>
            )}
          </div>
        </div>
        <div className="sample-account-content-container sample-account-public">
          <ContentContainerHeader
            setCallback={setPublicAdd}
            addState={publicAdd}
            category="Public"
          />
          {publicAdd && (
            <SampleAddBucketList
              setCallback={setPublicAdd}
              addState={publicAdd}
              privacyType="public"
              setTriggerRefresh={setTriggerRefresh}
              triggerRefresh={triggerRefresh}
              friends={friends}
              userObject={userObject}
            />
          )}
          {publicEdit && (
            <EditBucketList
              setCallback={setPublicEdit}
              editState={publicEdit}
              setTriggerRefresh={setTriggerRefresh}
              triggerRefresh={triggerRefresh}
              arraySpecificObject={publicEditObject}
              friends={friends}
              contributorUserObjectsArray={contributorUserObjectsArray}
              setListArray={setPublicBucketListArray}
              listArray={publicBucketListArray}
            />
          )}
          <div className="sample-account-content-container-bucket-list-wrapper">
            {/* if publicBucketListArray is true, render, if null, display message */}
            {publicBucketListArray.length > 0 ? (
              publicBucketListArray.map((bucketList) => {
                return (
                  <BucketList
                    bucketList={bucketList}
                    setArrayObject={setPublicEditObject}
                    setEditMode={setPublicEdit}
                    key={bucketList.id}
                    contributorObjects={contributorObjects}
                    friends={friends}
                    setContributorUserObjectsArray={
                      setContributorUserObjectsArray
                    }
                    privacyType="public"
                    userID={userObject.id}
                    triggerRefresh={triggerRefresh}
                  />
                );
              })
            ) : (
              <EmptyArrayMessage accountType="owner" />
            )}
          </div>
        </div>
        <div className="sample-account-right-column-container">
          <h2 className="sample-account-side-container-header">
            Friend Activity
          </h2>
          <div className="sample-account-side-container-header-separator" />
          {recentFriendActivities.length > 0 && friends.length > 0 && (
            <RecentFriendActivities
              recentFriendActivities={recentFriendActivities}
              friends={friends}
            />
          )}
        </div>
        <div className="sample-account-content-container sample-account-shared">
          <ContentContainerHeader
            setCallback={setSharedAdd}
            addState={sharedAdd}
            category="Shared"
          />
          {sharedAdd && (
            <SampleAddBucketList
              setCallback={setSharedAdd}
              addState={sharedAdd}
              privacyType="shared"
              setTriggerRefresh={setTriggerRefresh}
              triggerRefresh={triggerRefresh}
              friends={friends}
              userObject={userObject}
            />
          )}
          {sharedEdit && (
            <EditBucketList
              setCallback={setSharedEdit}
              editState={sharedEdit}
              setTriggerRefresh={setTriggerRefresh}
              triggerRefresh={triggerRefresh}
              arraySpecificObject={sharedEditObject}
              friends={friends}
              contributorUserObjectsArray={contributorUserObjectsArray}
              setListArray={setSharedBucketListArray}
              listArray={sharedBucketListArray}
            />
          )}
          <div className="sample-account-content-container-bucket-list-wrapper">
            {sharedBucketListArray.length > 0 ? (
              sharedBucketListArray.map((bucketList) => {
                return (
                  <DisabledBucketList
                    bucketList={bucketList}
                    setArrayObject={setSharedEditObject}
                    setEditMode={setSharedEdit}
                    key={bucketList.id}
                    contributorObjects={contributorObjects}
                    friends={friends}
                    setContributorUserObjectsArray={
                      setContributorUserObjectsArray
                    }
                    privacyType="shared"
                    userID={userObject.id}
                    triggerRefresh={triggerRefresh}
                  />
                );
              })
            ) : (
              <EmptyArrayMessage accountType="owner" />
            )}
          </div>
        </div>
        <div className="sample-account-right-column-container sample-account-friend-manager">
          <div className="sample-account-friend-manager-header-container">
            <div
              onClick={() => setFriendManager("friends")}
              className={
                friendManager === "friends"
                  ? "sample-account-friend-manager-header-clicked my-friends"
                  : "sample-account-friend-manager-header my-friends"
              }
            >
              <h2>Friends</h2>
            </div>
            <div
              onClick={() => setFriendManager("search")}
              className={
                friendManager === "search"
                  ? "sample-account-friend-manager-header-clicked search"
                  : "sample-account-friend-manager-header search"
              }
            >
              <h2>Search</h2>
            </div>
          </div>
          <div className="sample-account-side-container-header-separator" />
          <div className="sample-account-friend-manager-content-container">
            <SampleFriendList friendManager={friendManager} friends={friends} />
            <SampleSearch
              friendManager={friendManager}
              fullUserList={fullUserList}
              friends={friends}
              outgoingFriendRequests={outgoingFriendRequests}
              incomingFriendRequests={incomingFriendRequests}
            />
            <div
              className={
                requestTabSelected
                  ? "sample-account-friend-manager-request-tab sample-account-request-tab-selected"
                  : "sample-account-friend-manager-request-tab"
              }
            >
              <div
                onClick={() => setRequestTabSelected(!requestTabSelected)}
                className="sample-account-friend-manager-request-tab-button"
              >
                <h3>Requests</h3>
                <div className="sample-account-friend-manager-request-count">
                  <h3>
                    {incomingFriendRequests.length > 0
                      ? incomingFriendRequests.length
                      : "0"}
                  </h3>
                </div>
              </div>
              <div className="sample-account-friend-manager-request-tab-bar">
                <SampleRequestList
                  incomingFriendRequests={incomingFriendRequests}
                  requestTabSelected={requestTabSelected}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="sample-account-content-container sample-account-private">
          <ContentContainerHeader
            setCallback={setPrivateAdd}
            addState={privateAdd}
            category="Private"
          />
          {privateAdd && (
            <SampleAddBucketList
              setCallback={setPrivateAdd}
              addState={privateAdd}
              privacyType="private"
              setTriggerRefresh={setTriggerRefresh}
              triggerRefresh={triggerRefresh}
              friends={friends}
              userObject={userObject}
            />
          )}
          {privateEdit && (
            <EditBucketList
              setCallback={setPrivateEdit}
              editState={privateEdit}
              setTriggerRefresh={setTriggerRefresh}
              triggerRefresh={triggerRefresh}
              arraySpecificObject={privateEditObject}
              friends={friends}
              contributorUserObjectsArray={contributorUserObjectsArray}
              setListArray={setPrivateBucketListArray}
              listArray={privateBucketListArray}
            />
          )}
          <div className="sample-account-content-container-bucket-list-wrapper">
            {privateBucketListArray.length > 0 ? (
              privateBucketListArray.map((bucketList) => {
                return (
                  <DisabledBucketList
                    bucketList={bucketList}
                    setArrayObject={setPrivateEditObject}
                    setEditMode={setPrivateEdit}
                    key={bucketList.id}
                    contributorObjects={contributorObjects}
                    friends={friends}
                    setContributorUserObjectsArray={
                      setContributorUserObjectsArray
                    }
                    privacyType="private"
                    userID={userObject.id}
                    triggerRefresh={triggerRefresh}
                  />
                );
              })
            ) : (
              <EmptyArrayMessage accountType="owner" />
            )}
          </div>
        </div>
        <div className="sample-account-right-column-container sample-account-recipe-suggestions">
          <h2 className="sample-account-side-container-header">
            Recipe Suggestions
          </h2>
          <div className="sample-account-side-container-header-separator" />
          <RecipeInput setRecipeArray={setRecipeArray} />
          <div className="sample-account-recipe-api-content">
            {recipeArray?.map((recipe, index) => {
              return (
                <div key={index}>
                  <RecipeDisplay recipe={recipe} />
                  <div className="sample-account-recipe-separator" />
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
