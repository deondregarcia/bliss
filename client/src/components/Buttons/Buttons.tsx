// exports of all buttons
import React from "react";
import "./Buttons.css";

export const LogoutButton = ({
  logout,
}: {
  logout: React.MouseEventHandler<HTMLDivElement>;
}) => {
  return (
    <div onClick={logout} className="logout-button">
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

export const GetRecipesButton = ({
  getRecipes,
}: {
  getRecipes: React.MouseEventHandler<HTMLDivElement>;
}) => {
  return (
    <div className="outline-button get-recipes-button">
      <h3 className="get-recipes-button-text">Search</h3>
    </div>
  );
};
