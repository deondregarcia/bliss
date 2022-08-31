import * as dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import * as bodyParser from "body-parser";
import { contentRouter } from "./routes/ManageContent";
import { viewContentRouter } from "./routes/ViewContent";
import passport from "passport";
import session from "express-session";
import { nextTick } from "process";
const cors = require("cors");
// import { url: URL } from 'url';
const url = require("url");
require("./routes/auth");

dotenv.config();

const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  req.user ? next() : res.sendStatus(401);
};

const app = express();
app.use(cors());

app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use("/content", contentRouter);
app.use("/view", viewContentRouter);

// auth testing

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/failure" }),
  (req: Request, res: Response) => {
    console.log(req.user);
    res.redirect(`http://localhost:3001/${req?.user?.id}`);
  }
);

app.get("/", (req, res) => {
  res.send('<a href="/auth/google">Authenticate with Google</a>');
});

app.get("/auth/failure", (req: Request, res: Response) => {
  res.send("something went wrong...");
});

app.get("/protected", isLoggedIn, (req: Request, res: Response) => {
  res.send(req.user);
});

app.get("/logout", (req: Request, res: Response, err: any) => {
  req.logout(err);
  res.send("Goodbye!");
});

// auth testing ----

app.listen(process.env.PORT, () => {
  console.log(`Node server started running on Port ${process.env.PORT}`);
});
