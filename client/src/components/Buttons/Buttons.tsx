// exports of all buttons
import React from "react";
import "./Buttons.css";

export const LogoutButton = () => {
  return (
    <div className="logout-button">
      <h3 className="logout-button-text">Logout</h3>
    </div>
  );
};

export const LoginButton = ({ googleLink }: { googleLink: string }) => {
  return (
    <div className="login-button">
      <h3 className="login-button-text">
        <a href={googleLink}>Login with Google</a>
      </h3>
    </div>
  );
};
