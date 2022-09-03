import React, { ReactNode, useState } from "react";
import { Router, Routes, Route, Link } from "react-router-dom";
import Axios from "axios";
import RequireAuth from "./auth/RequireAuth";
import Layout from "./pages/Layout";

// import navbar
import Navbar from "./components/Navbar/Navbar";

// import pages
import Profile from "./pages/Profile/Profile";
import Landing from "./pages/Landing/Landing";
import BucketListView from "./pages/BucketListView/BucketListView";
import Unauthorized from "./auth/Unauthorized/Unauthorized";
import CheckUserOrFriend from "./auth/CheckUserOrFriend";
import FriendProfile from "./pages/FriendProfile/FriendProfile";
import { StatusType } from "./types/authTypes";

const STATUS: StatusType = {
  owner: "owner",
  friend: "friend",
};

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Landing />} />
          <Route path="unauthorized" element={<Unauthorized />} />

          {/* checks if user is logged in */}
          <Route element={<RequireAuth />}>
            {/* add route to check if friends or user or something else */}
            <Route element={<CheckUserOrFriend status={STATUS.owner} />}>
              <Route path="my-profile/:id" element={<Profile />} />
            </Route>

            <Route element={<CheckUserOrFriend status={STATUS.friend} />}>
              {/* <Route path="friend-profile/:id" element={<FriendProfile />} /> */}
              <Route path="profile/:id" element={<FriendProfile />} />
            </Route>

            {/* add route to check if owner or in shared_list_users */}
            <Route path="bucket-list" element={<BucketListView />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
