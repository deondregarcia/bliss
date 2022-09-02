import React, { ReactNode, useState } from "react";
import { Router, Routes, Route, Link } from "react-router-dom";
import Axios from "axios";
import RequireAuth from "./components/RequireAuth";
import Layout from "./pages/Layout";

// import navbar
import Navbar from "./components/Navbar/Navbar";

// import pages
import Profile from "./pages/Profile/Profile";
import Landing from "./pages/Landing/Landing";
import BucketListView from "./pages/BucketListView/BucketListView";

const checkSessionID = () => {
  Axios.get("/test")
    .then((res) => {
      console.log("cookie response below");
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
};

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Landing />} />
          <Route path="bucket-list" element={<BucketListView />} />

          {/* protected routes */}
          <Route element={<RequireAuth />}>
            <Route
              path="profile/:id"
              element={<Profile checkSessionID={checkSessionID} />}
            />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
