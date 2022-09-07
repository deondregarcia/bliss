import React, { useEffect, useState } from "react";
import Axios from "axios";
import { Navigate, Outlet } from "react-router-dom";

const CheckIfNewUser = () => {
  const [didCheckNewUserRun, setDidCheckNewUserRun] = useState(false);
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

    setDidCheckNewUserRun(true);
  };

  useEffect(() => {
    checkIfGoogleIDExists();
    console.log(isNewUser ? "is new user" : "is not new user");
  }, []);

  return (
    <>
      {didCheckNewUserRun &&
        (isNewUser ? <Navigate to="account-creation" /> : <Outlet />)}
    </>
  );
};

export default CheckIfNewUser;
