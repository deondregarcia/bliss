import * as dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import * as bodyParser from "body-parser";
import Axios from "axios";

// import some controllers; extract these to the controllers folder later
import {
  verifySession,
  checkIfFriend,
  checkIfFriendWithUserID,
  getUserID,
} from "./controllers/VerifySession";
import { SessionType } from "./types/session";

// import routes files
import { contentRouter } from "./routes/ManageContent";
import { viewContentRouter } from "./routes/ViewContent";

import passport from "passport";
import session from "express-session";
import { FriendPairType, FriendRequestUserType } from "./types/content";
import {
  checkUsername,
  createUser,
  getIncomingFriendRequests,
  getOutgoingFriendRequests,
  sendFriendRequest,
} from "./controllers/UserManagement";

// import packages for MySQl session store
const mysql = require("mysql2/promise");
const MySQLStore = require("express-mysql-session")(session);

const cors = require("cors");
const cookieParser = require("cookie-parser");
const url = require("url");
require("./routes/auth");

dotenv.config();

// set up express-mysql-session for sessionStore
const sessionStoreOptions = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
};

// const connection = mysql.createPool(sessionStoreOptions);
const connection = mysql.createPool(sessionStoreOptions);
const sessionStore = new MySQLStore({}, connection);

const app = express();
app.use(cors({ credentials: true }));
app.use(cookieParser());

// this middleware fires for every consecutive request to the server
app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false, // if true, resets the session cookie upon every request to the server
    saveUninitialized: false, // if by end of request the newly created session object is empty/unmodified, don't store in session store if saveUnitilized == false. Set to true if you want to identify recurring visitors
    store: sessionStore,
    // cookie: { secure: false },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use("/content", contentRouter);
app.use("/view", viewContentRouter);

// auth testing

const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  req.user ? next() : res.sendStatus(401);
};

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/failure" }),
  (req: Request, res: Response) => {
    // res.redirect(`http://localhost:3001/${req?.user?.id}`);
    // in the future, redirect to profile by /profile/:id
    res.redirect(`http://localhost:3001/my-profile/${req?.user?.id}`);
  }
);

app.get(
  "/auth/user",
  passport.authenticate("google", { scope: ["email", "profile"] }),
  (req: Request, res: Response) => {
    res.json({ user: req.user });
  }
);

app.get("/", (req: Request, res: Response) => {
  res.send('<a href="/auth/google">Authenticate with Google</a>');
});

app.get("/auth/failure", (req: Request, res: Response) => {
  res.send("something went wrong...");
});

app.get("/protected", isLoggedIn, (req: Request, res: Response) => {
  res.send(req.user);
});

// for testing client-server interactions
app.get("/verify", (req: Request, res: Response) => {
  const reqSessionID = req.session.id;
  verifySession(reqSessionID, (err: Error, sessions: SessionType[]) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    res.status(200).json({ session_info: sessions[0] });
  });
});

app.post("/get-recipes", (req: Request, res: Response) => {
  const recipeSearch = req.body.query;
  let recipeResponse;
  const recipeOptions = {
    params: {
      query: recipeSearch,
      number: 1,
      sort: "popularity",
      ranking: 2,
    },
    headers: {
      "X-RapidAPI-Key": String(process.env.RAPID_API_KEY),
      "X-RapidAPI-Host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
    },
  };
  Axios.get(
    "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch",
    recipeOptions
  )
    .then((response) => {
      recipeResponse = response.data.results;
      res.status(200).json({ data: response.data.results });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/check-if-friend-with-google-id", (req: Request, res: Response) => {
  const reqUserID = String(req.user?.id);
  const secondID = req.body.secondID;

  if (!req.user) {
    res.status(200).json({ friendPairsInfo: [] });
  }

  checkIfFriend(
    reqUserID,
    secondID,
    (err: Error, friendPairs: FriendPairType[]) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }

      res.status(200).json({ friendPairsInfo: friendPairs });
    }
  );
});

app.post("/check-if-friend-with-user-id", (req: Request, res: Response) => {
  const reqUserGoogleID = String(req.user?.id);
  const secondID = req.body.secondID;

  if (!req.user) {
    res.status(200).json({ friendPairsInfo: [] });
  }

  checkIfFriendWithUserID(
    reqUserGoogleID,
    secondID,
    (err: Error, friendPairs: FriendPairType[]) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }

      res.status(200).json({ friendPairsInfo: friendPairs });
    }
  );
});

// send a friend request based on google ID's
app.post("/send-friend-request", async (req: Request, res: Response) => {
  // check if user is logged in/google id exists
  if (!req.user?.id) {
    return res.status(403).json({ message: "User's Google ID not found" });
  }

  const requestorGoogleID = String(req.user?.id); // google id of person sending the request
  const requesteeGoogleID = req.body.requesteeGoogleID; // google id of person receiving the request

  sendFriendRequest(
    requestorGoogleID,
    requesteeGoogleID,
    (err: Error, insertID: number) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }

      res.status(200).json({ insertID: insertID });
    }
  );
});

// get outgoing friend requests for a user from user's google id
app.get(
  "/get-outgoing-friend-requests/:id",
  async (req: Request, res: Response) => {
    const userGoogleID = String(req.params.id);

    getOutgoingFriendRequests(
      userGoogleID,
      (err: Error, outgoingRequestUsers: FriendRequestUserType[]) => {
        if (err) {
          return res.status(500).json({ message: err.message });
        }

        res.status(200).json({ outgoingRequestUsers: outgoingRequestUsers });
      }
    );
  }
);

// get incoming friend requests for a user from user's google id
app.get(
  "/get-incoming-friend-requests/:id",
  async (req: Request, res: Response) => {
    const userGoogleID = String(req.params.id);

    getIncomingFriendRequests(
      userGoogleID,
      (err: Error, incomingRequestUsers: FriendRequestUserType[]) => {
        if (err) {
          return res.status(500).json({ message: err.message });
        }

        res.status(200).json({ incomingRequestUsers: incomingRequestUsers });
      }
    );
  }
);

app.get("/googleuser", (req: Request, res: Response) => {
  res.status(200).json({ google_user: req.user?.profile });
});

// gets user id from google id
app.get("/get-user-id", (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(200).json({ userID: [] });
  }
  const userGoogleID = req.user?.profile.id;

  getUserID(userGoogleID, (err: Error, userID: number) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    res.status(200).json({ userID: userID });
  });
});

app.post("/check-if-username-exists", async (req: Request, res: Response) => {
  const username = String(req.body.username);

  checkUsername(username, (err: Error, usernameExists: string) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    res.status(200).json({ username: usernameExists });
  });
});

app.post("/create-user", async (req: Request, res: Response) => {
  if (!req.user?.profile.id) {
    return res.status(500).json({ message: "No Google ID" });
  }

  const newUser = {
    username: req.body.username,
    first_name: req.body.firstName,
    last_name: req.body.lastName,
    created_at: new Date(),
    google_id: String(req.user?.profile.id),
    wants_to: req.body.wantsTo,
    google_photo_link: String(req.user?.profile.photos[0].value),
  };

  createUser(newUser, (err: Error, insertID: number) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    res.status(200).json({ insertID: insertID });
  });
});

app.get("/logout", (req: Request, res: Response, err: any) => {
  req.session.destroy((err) => {
    if (err) throw err;
    res.status(200).json({ message: "Successfuly cleared session" });
  });
});

// auth testing ----

app.listen(process.env.PORT, () => {
  console.log(`Node server started running on Port ${process.env.PORT}`);
});
