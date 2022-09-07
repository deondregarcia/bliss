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
import SetAuth from "./auth/SetAuth";
import CheckIfNewUser from "./auth/CheckIfNewUser";
import AccountCreation from "./pages/AccountCreation/AccountCreation";

const STATUS: StatusType = {
  owner: "owner",
  friend: "friend",
};

function App() {
  return (
    <>
      {/* <Navbar /> */}
      <Routes>
        <Route element={<SetAuth />}>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Landing />} />
            <Route path="unauthorized" element={<Unauthorized />} />
            {/* add route to check if owner or in shared_list_users */}
            <Route path="bucket-list">
              <Route path=":id" element={<BucketListView />} />
            </Route>

            {/* checks if user is logged in */}
            <Route element={<RequireAuth />}>
              <Route path="account-creation" element={<AccountCreation />} />
              {/* checks if logged in User's google ID is saved in db; if not, redirects to AccountCreation */}
              <Route element={<CheckIfNewUser />}>
                {/* add route to check if friends or user or something else */}
                <Route element={<CheckUserOrFriend status={STATUS.owner} />}>
                  <Route path="my-profile" element={<Profile />} />
                </Route>

                <Route element={<CheckUserOrFriend status={STATUS.friend} />}>
                  <Route path="profile/:id" element={<FriendProfile />} />
                </Route>
              </Route>
            </Route>
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
