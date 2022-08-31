import React from "react";
import Axios from "axios";

const Landing = () => {
  const handleSubmit = () => {};

  return (
    <div>
      <div>
        <a href="http://localhost:3000/auth/google">Login with Google</a>
        <button onClick={handleSubmit}>Login with Google</button>
      </div>
    </div>
  );
};

export default Landing;
