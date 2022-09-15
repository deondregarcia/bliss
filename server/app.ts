import * as dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import * as bodyParser from "body-parser";
import Axios from "axios";

// import some controllers; extract these to the controllers folder later
import { verifySession } from "./controllers/VerifySession";
import { SessionType } from "./types/session";

// import routes files
import { contentRouter } from "./routes/ManageContent";
import { viewContentRouter } from "./routes/ViewContent";
import { manageUserRouter } from "./routes/UserManagement";

import passport from "passport";
import session from "express-session";
import path from "path";

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
app.use("/user", manageUserRouter);

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
    // res.redirect(`http://localhost:3001/my-profile/${req?.user?.id}`);
    res.redirect(`https://blissely.herokuapp.com/my-profile/${req?.user?.id}`);
  }
);

app.get(
  "/auth/user",
  passport.authenticate("google", { scope: ["email", "profile"] }),
  (req: Request, res: Response) => {
    res.json({ user: req.user });
  }
);

app.get("/auth/failure", (req: Request, res: Response) => {
  res.send("something went wrong...");
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

app.get("/recipes", (req: Request, res: Response) => {
  const recipeSearch = req.params.query;
  let recipeResponse;
  const recipeOptions = {
    params: {
      query: recipeSearch,
      number: 3,
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

app.get("/logout", (req: Request, res: Response, err: any) => {
  req.session.destroy((err) => {
    if (err) throw err;
    res.status(200).json({ message: "Successfuly cleared session" });
  });
});

// serve react frontend
if (process.env.NODE_ENV === "production") {
  app.use(express.static("build"));
  app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
  });
}

app.listen(process.env.PORT, () => {
  console.log(`Node server started running on Port ${process.env.PORT}`);
});
