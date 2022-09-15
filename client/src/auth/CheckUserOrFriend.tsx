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
    // take the google id's and check if they are friends
    await Axios.get(`/user/friend/google-id/${id}`)
      .then((res) => {
        if (res.data.friendPairsInfo[0]) {
          setIsFriends(true);
          setUserStatus("friend");
        }
      })
      .catch((err) => {
        console.log(err);
      });

    // get user's google id from server for verification
    await Axios.get("/user/googleuser")
      .then((res) => {
        setGoogleID(res.data.google_user.id);
      })
      .catch((err) => {
        console.log(err);
      });

    if (googleID === id) {
      setUserStatus("owner");
      setDidCheckRun(true);
    } else if (isFriends) {
      setDidCheckRun(true);
    } else {
      setDidCheckRun(true);
    }
  };

  useEffect(() => {
    runAllChecks();
  });

  return (
    <>
      {/* if status === "owner", we are in the STATUS.owner <CheckUserOrFriend /> component */}
      {didCheckRun && status === "owner" && userStatus === status && <Outlet />}

      {/* if status === "friend", we are in the STATUS.friend <CheckUserOrFriend /> component */}
      {didCheckRun &&
        status === "friend" &&
        (userStatus === status ? (
          <Outlet />
        ) : (
          <Navigate to={`/public/${id}`} />
        ))}
      {/* if not friend, navigate to their public / nonfriend profile */}
    </>
  );
};

export default CheckUserOrFriend;
