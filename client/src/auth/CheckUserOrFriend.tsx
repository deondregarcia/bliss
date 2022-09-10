import React, { useEffect, useState } from "react";
import { Outlet, useParams, Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Axios from "axios";
import { StatusType } from "../types/authTypes";

const CheckUserOrFriend = ({ status }: { status: string }) => {
  const { auth } = useAuth();
  const { id } = useParams();
  const [didCheckRun, setDidCheckRun] = useState(false);
  const [googleID, setGoogleID] = useState<string | null>(null);
  const [userStatus, setUserStatus] = useState<string | null>(null);
  const [isFriends, setIsFriends] = useState(false);

  // combine all funcs to ensure they get called before continuing
  const runAllChecks = async () => {
    // setDidCheckRun(false);
    console.log("initial logs wrapper");
    console.log(userStatus);
    console.log(didCheckRun);
    console.log("initial logs wrapper");

    // take the google id's and check if they are friends
    await Axios.post("/check-if-friend-with-google-id", {
      // this commented out JSON.parse.... is the google id stored in session
      // secondID: JSON.parse(auth.session_info.data).passport.user.id,
      secondID: id,
    })
      .then((res) => {
        console.log(res);
        if (res.data.friendPairsInfo[0]) {
          setIsFriends(true);
          setUserStatus("friend");
          console.log("friend if statement ran");
          console.log("initial logs wrapper 3-if-friend ");
          console.log(userStatus);
          console.log(didCheckRun);
          console.log("initial logs wrapper 3-if-friend ");
        }
      })
      .catch((err) => {
        console.log(err);
      });

    // get user's google id from server for verification
    await Axios.get("/googleuser")
      .then((res) => {
        setGoogleID(res.data.google_user.id);
      })
      .catch((err) => {
        console.log(err);
      });

    // if (googleID === id) {
    //   setUserStatus("owner");
    //   setDidCheckRun(true);
    //   console.log("set owner part");
    //   console.log(userStatus);
    // } else if (isFriends) {
    //   setUserStatus("friend");
    //   setDidCheckRun(true);
    //   console.log("set friend part");
    //   console.log(userStatus);
    // }
    if (googleID === id) {
      setUserStatus("owner");
      setDidCheckRun(true);
      console.log("set owner part");
      console.log(userStatus);
    } else if (isFriends) {
      setDidCheckRun(true);
      console.log("set friend part");
      console.log(userStatus);
    } else {
      setDidCheckRun(true);
    }

    console.log("initial logs wrapper 4");
    console.log(userStatus);
    console.log(didCheckRun);
    console.log("initial logs wrapper 4");
  };

  useEffect(() => {
    runAllChecks();
    console.log("console log ran");
    console.log("initial logs wrapper 2");
    console.log(userStatus);
    console.log(didCheckRun);
    console.log("initial logs wrapper 2");

    // if (googleID === JSON.parse(auth.session_info.data).passport.user.id) {
  });

  return (
    <>
      {/* if status === "owner", we are in the STATUS.owner <CheckUserOrFriend /> component */}
      {didCheckRun && status === "owner" && userStatus === status && <Outlet />}

      {/* if status === "friend", we are in the STATUS.friend <CheckUserOrFriend /> component */}
      {didCheckRun &&
        status === "friend" &&
        (userStatus === status ? <Outlet /> : <Navigate to="unauthorized" />)}
    </>
  );
};

export default CheckUserOrFriend;
