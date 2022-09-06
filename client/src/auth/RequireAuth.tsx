import { useEffect, useState } from "react";
import { useLocation, Navigate, useNavigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = () => {
  const { auth, setAuth } = useAuth();
  // const [didAuthRun, setDidAuthRun] = useState(false);

  return (
    <>
      {/* {didAuthRun &&
        (auth?.session_info ? <Outlet /> : <Navigate to="unauthorized" />)} */}
      {auth?.session_info ? <Outlet /> : <Navigate to="unauthorized" />}
    </>
  );
};

export default RequireAuth;
