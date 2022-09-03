import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Axios from "axios";
import useAuth from "../../hooks/useAuth";

const Landing = () => {
  const { auth, setAuth } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // make request to server to check if auth credentials exist (i.e. if google login was achieved)
  const checkForAuth = async () => {
    // if user is logged in, should send session id; CHECK WHAT HAPPENS IF USER IS NOT LOGGED IN
    await Axios.get("/verify")
      .then((res) => {
        // if session id in response does not exist
        if (res.data.session_info) {
          console.log("logged in");
          setAuth(res.data);
        } else {
          console.log("not logged in");
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
    <div>
      <div>
        <h1>Landing Page Under Construction</h1>
      </div>
    </div>
  );
};

export default Landing;
