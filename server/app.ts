import * as dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import * as bodyParser from "body-parser";
import { contentRouter } from "./routes/ManageContent";
import { viewContentRouter } from "./routes/ViewContent";
import passport from "passport";
import session from "express-session";
const cors = require("cors");
require("./routes/auth");

const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  req.user ? next() : res.sendStatus(401);
};

const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
dotenv.config();
app.use(cors());

app.use(bodyParser.json());
app.use("/content", contentRouter);
app.use("/view", viewContentRouter);

// auth testing

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

// app.get(
//   "/google/callback",
//   passport.authenticate("google", { failureRedirect: "/auth/failure" }),
//   (req: Request, res: Response) => {
//     res.redirect("/");
//   }
// );

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/failure" }),
  (req: Request, res: Response) => {
    res.redirect("/");
  }
);

app.get("/", (req, res) => {
  res.send('<a href="/auth/google">Authenticate with Google</a>');
});

app.get("/auth/failure", (req: Request, res: Response) => {
  res.send("something went wrong...");
});

app.get("/protected", isLoggedIn, (req, res) => {
  res.send("Hello!");
});

// auth testing ----
app.listen(process.env.PORT, () => {
  console.log(`Node server started running on Port ${process.env.PORT}`);
});
