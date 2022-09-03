import { useEffect, useState } from "react";
import { useLocation, Navigate, useNavigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Axios from "axios";

const RequireAuth = () => {
  const { auth, setAuth } = useAuth();
  const [didAuthRun, setDidAuthRun] = useState(false);

  // make request to server to check if auth credentials exist (i.e. if google login was achieved)
  const checkForAuth = async () => {
    // if user is logged in, should send session id; CHECK WHAT HAPPENS IF USER IS NOT LOGGED IN
    await Axios.get("/verify")
      .then((res) => {
        console.log(res.data);

        // if session id in response does not exist
        if (res.data) {
          setAuth(res.data);
          setDidAuthRun(true);
          // setIsLoggedIn(true);
        } else {
          return false;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    checkForAuth();
  }, []);

  return (
    <>
      {didAuthRun &&
        (auth?.session_info ? <Outlet /> : <Navigate to="unauthorized" />)}
    </>
  );
};

export default RequireAuth;
