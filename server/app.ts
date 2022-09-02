import * as dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import * as bodyParser from "body-parser";

// import some controllers; extract these to the controllers folder later
import { verifySession } from "./controllers/VerifySession";
import { SessionType } from "./types/session";

// import routes files
import { contentRouter } from "./routes/ManageContent";
import { viewContentRouter } from "./routes/ViewContent";

import passport from "passport";
import session from "express-session";

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
    res.redirect(`http://localhost:3001`);
  }
);

app.get(
  "/auth/user",
  passport.authenticate("google", { scope: ["email", "profile"] }),
  (req: Request, res: Response) => {
    // console.log(req.sessionStore["sessions"]);
    console.log(req.user);
    // console.log(req.cookies);
    res.json({ user: req.user });
  }
);

app.get("/", (req: Request, res: Response) => {
  // console.log(req.session.id);
  // console.log(req.session.cookie);
  // req.session.isAuth = true;
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

    console.log(sessions);
    res.status(200).json({ session_info: sessions[0] });
  });
  // console.log(req.sessionStore);
  // res.status(200).json({ sessionID: req.session.id });
});

app.get("/logout", (req: Request, res: Response, err: any) => {
  req.logout(err);
  req.session.destroy((err) => {
    if (err) throw err;
    res.redirect("/");
  });
});

// auth testing ----

app.listen(process.env.PORT, () => {
  console.log(`Node server started running on Port ${process.env.PORT}`);
});
