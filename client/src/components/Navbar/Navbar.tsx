import React from "react";
import Axios from "axios";
import useAuth from "../../hooks/useAuth";
import "./Navbar.css";

const Navbar = () => {
  const { auth } = useAuth();

  const logout = () => {
    Axios.get("/logout")
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="navbar-container">
      <h1 className="navbar-header">Bliss</h1>

      <div className="login">
        <button onClick={logout}>Logout</button>
        <button onClick={() => console.log(auth)}>Console Log Auth</button>
        <button
          onClick={() => console.log(auth.session_info ? "true" : "false")}
        >
          Console Log Auth Boolean
        </button>
        <h3>
          <a href="http://localhost:3000/auth/google">Login with Google</a>
        </h3>
      </div>
    </div>
  );
};

export default Navbar;
