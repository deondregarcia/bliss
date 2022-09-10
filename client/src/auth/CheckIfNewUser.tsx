import React, { useEffect, useState } from "react";
import Axios from "axios";
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const CheckIfNewUser = () => {
  // const [didCheckNewUserRun, setDidCheckNewUserRun] = useState(false);
  const { checkedIfNewUser, setCheckedIfNewUser } = useAuth();
  const [isNewUser, setIsNewUser] = useState(false);

  const checkIfGoogleIDExists = async () => {
    await Axios.get("/get-user-id")
      .then((res) => {
        if (!res.data.userID[0]) {
          setIsNewUser(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    console.log(isNewUser ? "is new user" : "is not new user");
    // setDidCheckNewUserRun(true);
    setCheckedIfNewUser(true);
  };

  useEffect(() => {
    if (!checkedIfNewUser) {
      checkIfGoogleIDExists();
    }
  }, []);

  return (
    <>
      {checkedIfNewUser &&
        (isNewUser ? <Navigate to="account-creation" /> : <Outlet />)}
    </>
  );
};

export default CheckIfNewUser;
