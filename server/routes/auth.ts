import express, { Request, Response } from "express";
import passport from "passport";
import { Profile, VerifyCallback } from "passport-google-oauth20";
import * as dotenv from "dotenv";
dotenv.config();

const GoogleStrategy = require("passport-google-oauth20").Strategy;

const authRouter = express.Router();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    function (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) {
      //   function (err, user) {
      //     return cb(err, user);
      //   });
      return done(null, profile);
      // return cb(err, profile);
    }
  )
);

passport.serializeUser(function (user: Express.User, done) {
  done(null, user);
});

passport.deserializeUser(function (user: Express.User, done) {
  done(null, user);
});
