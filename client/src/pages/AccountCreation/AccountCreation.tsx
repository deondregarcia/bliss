import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import Axios from "axios";
import "./AccountCreation.css";
import { useNavigate } from "react-router-dom";

const AccountCreation = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [isUsernameTaken, setIsUsernameTaken] = useState(false);
  const navigate = useNavigate();

  // submit form for new user creation
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // check if username is taken
    // checkUsername();
    await Axios.post("/check-if-username-exists", {
      username: username,
    })
      .then((res) => {
        // console.log(res.data.username[0]);
        // console.log(res.data.username[0] ? "exists" : "doesn't exist");
        console.log("username check ran");
        if (res.data.username[0]) {
          console.log("username true");
          alert("Username is already taken");
        } else {
          console.log("username false");
          // check if any values are empty
          if (!firstName || !lastName || !username) {
            alert("Please fill out all fields with an asterisk.");
            return;
          }
          Axios.post("/create-user", {
            firstName: firstName,
            lastName: lastName,
            username: username,
            bio: bio,
          })
            .then((res) => {
              console.log(res);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });

    navigate("/my-profile");
  };

  useEffect(() => {
    // check if logged in google user already has account
    Axios.get("/get-user-id")
      .then((res) => {
        if (res.data.userID[0]) {
          navigate("/my-profile");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="account-creation-container">
      {/* <button onClick={checkUsername}>Check Username</button> */}
      <div className="account-creation-header-container">
        <h2>Welcome to Blissely!</h2>
      </div>
      <div className="account-creation-body-container">
        <form onSubmit={handleSubmit}>
          <div className="account-creation-form-container">
            <div className="account-creation-form-input-wrapper">
              <label htmlFor="first-name">First Name*</label>
              <input
                type="text"
                id="first-name"
                maxLength={15}
                placeholder="Enter first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="account-creation-form-input-wrapper">
              <label htmlFor="last-name">Last Name*</label>
              <input
                type="text"
                id="last-name"
                maxLength={15}
                placeholder="Enter last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="account-creation-form-input-wrapper">
              <label htmlFor="username">Username*</label>
              <input
                type="text"
                id="username"
                maxLength={15}
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="account-creation-form-input-wrapper">
              <label htmlFor="bio">
                Bio<p>(Max 150 characters)</p>
              </label>

              <textarea
                maxLength={150}
                id="bio"
                placeholder="Enter bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
            <p>Fields with an asterisk * are required</p>
            <input
              type="submit"
              value="Create Account"
              className="account-creation-form-submit"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountCreation;
