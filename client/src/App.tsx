import React from "react";
import { Router, Routes, Route, Link } from "react-router-dom";

// import navbar
import Navbar from "./components/Navbar/Navbar";

// import pages
import Home from "./pages/Home/Home";
import Profile from "./pages/Profile/Profile";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Profile />} />
      </Routes>
    </>
  );
}

export default App;
