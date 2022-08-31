import React, { ReactNode, useState } from "react";
import { Router, Routes, Route, Link } from "react-router-dom";
import Axios from "axios";

// import navbar
import Navbar from "./components/Navbar/Navbar";

// import pages
import Profile from "./pages/Profile/Profile";
import Landing from "./pages/Landing/Landing";

function App() {
  // Auth Context for Google Login
  // const AuthProvider = ({ children }: { children: ReactNode}) => {
  //   const [token, setToken] = useState<string | null>(null);

  //   const handleLogin = async () => {
  //     await Axios.get()
  //   }
  // }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
}

export default App;
