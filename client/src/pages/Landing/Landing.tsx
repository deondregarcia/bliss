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
        // console.log(res.data);

        // if session id in response does not exist
        if (res.data) {
          setAuth(res.data);
        } else {
          return false;
        }
      })
      .catch((err) => {
        console.log(err);
      });

    // setIsLoggedIn(true);
    // navigate("profile", { replace: true });
  };

  useEffect(() => {
    checkForAuth();
    // setAuth({
    //   session_info: {
    //     session_id: "hi",
    //     expires: 2,
    //     data: "hellodata",
    //   },
    // });
    // setIsLoggedIn(true);
    // console.log("i should fire only once");
    // console.log(auth);
  }, []);

  return (
    <div>
      {/* if user is logged in, redirect to profile page */}
      {isLoggedIn && <Navigate to="profile" replace={true} />}
      <div>
        <button onClick={() => setIsLoggedIn(true)}>
          Set Logged In to True
        </button>
        <h1>Landing Page Under Construction</h1>
      </div>
    </div>
  );
};

export default Landing;
