import React, { useState, useEffect, ReactNode } from "react";
import Axios from "axios";
import "./Profile.css";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import { GoogleUserObjectType } from "../../types/authTypes";

// import types
import { BucketListType, RecipeContentType } from "../../types/content";

// import components
import BucketList from "../../components/BucketList/BucketList";
import EmptyArrayMessage from "../../components/EmptyArrayMessage/EmptyArrayMessage";
import ContentContainerHeader from "../../components/ContentContainerHeader/ContentContainerHeader";
import RecipeDisplay from "../../components/ProfileComponents/RecipeDisplay/RecipeDisplay";
import RecipeInput from "../../components/ProfileComponents/RecipeInput/RecipeInput";
import { RecipeInputDefault } from "../../components/ProfileComponents/RecipeInput/RecipeInputDefault";

const Profile = () => {
  const [userID, setUserID] = useState<number>(0);
  const [googleUserObject, setGoogleUserObject] = useState<
    GoogleUserObjectType | any
  >();

  const [recipeArray, setRecipeArray] =
    useState<RecipeContentType[]>(RecipeInputDefault);
  const { id } = useParams();

  console.log(id);

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
    Axios.get(`/view/lists/${id}`)
      .then((response) => {
        console.log(response.data.data);
        setPublicBucketListArray(
          response.data.data.filter((bucketList: BucketListType) => {
            return bucketList.privacy_type === "public";
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
        console.log(res.data.google_user.photos);
        setGoogleUserObject(res.data.google_user);
        console.log(googleUserObject.photos);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getBucketListData();
    getGoogleUserInfo();

    return () => {};
  }, []);

  const temp_recipe = {
    image_url: "https://spoonacular.com/recipeImages/47950-312x231.jpg",
    likes: 35,
    title: "Cinnamon Apple Crisp",
  };

  return (
    <>
      <div className="home-container">
        {/* first row of elements */}
        <div className="profile-info">
          <img
            src={googleUserObject?.photos[0].value}
            alt="google profile pic"
            className="profile-pic"
          />
          <h3>{googleUserObject?.displayName}</h3>
        </div>
        <div className="content-container public">
          <ContentContainerHeader category="Public" />
          {/* if publicBucketListArray is true, render, if null, display message */}
          {publicBucketListArray.length > 0 ? (
            publicBucketListArray.map((bucketList, index) => {
              return <BucketList bucketList={bucketList} key={index} />;
            })
          ) : (
            <EmptyArrayMessage />
          )}
        </div>
        <div className="right-column-container friend-feed">
          <h2 className="side-container-header">Recent Friend Activities</h2>
          <div className="side-container-header-separator" />
        </div>

        {/* second row of elements */}
        <div className="control-panel"></div>
        <div className="content-container shared">
          <ContentContainerHeader category="Shared" />
          {sharedBucketListArray.length > 0 ? (
            sharedBucketListArray.map((bucketList, index) => {
              return <BucketList bucketList={bucketList} key={index} />;
            })
          ) : (
            <EmptyArrayMessage />
          )}
        </div>
        <div className="right-column-container ">
          <h2 className="side-container-header">Recipe Suggestions</h2>
          <div className="side-container-header-separator" />
          <RecipeInput setRecipeArray={setRecipeArray} />
          <div className="recipe-api-content">
            {recipeArray?.map((recipe, index) => {
              return (
                <>
                  <RecipeDisplay recipe={recipe} key={index} />
                  <div className="recipe-separator" />
                </>
              );
            })}
          </div>
        </div>
        {/* third row of elements */}
        <div className="content-container private">
          <ContentContainerHeader category="Private" />
          {privateBucketListArray.length > 0 ? (
            privateBucketListArray.map((bucketList, index) => {
              return <BucketList bucketList={bucketList} key={index} />;
            })
          ) : (
            <EmptyArrayMessage />
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
