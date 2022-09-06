import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Axios from "axios";
import useAuth from "../../hooks/useAuth";

const Landing = () => {
  const { auth, setAuth } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  return (
    <div>
      <div>
        <h1>Landing Page Under Construction</h1>
      </div>
    </div>
  );
};

export default Landing;
