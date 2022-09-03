import React from "react";
import { useParams } from "react-router-dom";
import "./FriendProfile.css";

const FriendProfile = () => {
  const { id } = useParams();
  console.log(id);
  return <div>FriendProfile</div>;
};

export default FriendProfile;
