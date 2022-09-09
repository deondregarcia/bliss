import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Axios from "axios";
import useAuth from "../../hooks/useAuth";
import { List } from "../../assets/svg/List";
import LandingGraphic from "../../assets/svg/LandingGraphic";
import "./Landing.css";

const Landing = () => {
  const { auth, setAuth } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="landing-page-container">
      <div className="landing-page-header-container">
        <h1 className="page-test">Landing Page Under Construction</h1>
      </div>
      {/* <List /> */}
      <div className="landing-page-landing-graphic-wrapper">
        <LandingGraphic />
        <div className="landing-page-landing-graphic-link">
          <a href="https://www.freepik.com/free-vector/isometric-composition-with-two-workers-from-professional-cleaning-service-washing-floor-windows-study-office-room-3d-vector-illustration_23243582.htm#query=bucket%20list&amp;position=48&amp;from_view=search">
            Image by macrovector
          </a>{" "}
          on Freepik
        </div>
      </div>
    </div>
  );
};

export default Landing;
