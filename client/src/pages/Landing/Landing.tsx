import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Axios from "axios";
import useAuth from "../../hooks/useAuth";
import { LandingLoginButton } from "../../components/Buttons/Buttons";
import LandingGraphic from "../../assets/svg/LandingGraphic";
import "./Landing.css";

const Landing = () => {
  const { auth, setAuth } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="landing-page-container">
      <div className="landing-page-header-container">
        <h1 className="landing-page-title">Blissely</h1>
        <div className="landing-page-hero-text">
          <h2>Great memories start with a spark.</h2>
          <h2>Find yours here.</h2>
          <div className="landing-login-button-wrapper">
            <LandingLoginButton googleLink="https://blissely.herokuapp.com/auth/google" />
          </div>
        </div>

        {/* hero graphic */}
        <div className="landing-page-landing-graphic-wrapper">
          <LandingGraphic className="landing-page-landing-graphic" />
          <div className="landing-page-landing-graphic-link">
            <a href="https://www.freepik.com/free-vector/isometric-composition-with-two-workers-from-professional-cleaning-service-washing-floor-windows-study-office-room-3d-vector-illustration_23243582.htm#query=bucket%20list&amp;position=48&amp;from_view=search">
              Image by macrovector
            </a>{" "}
            on Freepik
          </div>
        </div>
        <div className="value-proposition-text">
          <h3>Start creating shared bucket lists with Blissely!</h3>
        </div>
      </div>
      <div className="what-is-it-container">
        <h1 className="what-is-it-header">What is Blissely, exactly?</h1>
        <div className="what-is-it-text-container">
          <h2>
            Blissely is a platform for you and your friends and family to create
            collaborative bucket lists!
          </h2>
        </div>
      </div>
    </div>
  );
};

export default Landing;
