import express, { Request, Response } from "express";
import passport from "passport";
import { Profile, VerifyCallback } from "passport-google-oauth20";
import * as dotenv from "dotenv";
dotenv.config();

const GoogleStrategy = require("passport-google-oauth20").Strategy;
const SessionStrategy = require("passport-strategy");

const authRouter = express.Router();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // callbackURL: "https://blissely.herokuapp.com/auth/google/callback",
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    function (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) {
      // User.findOrCreate({ googleId: profile.id },
      return done(null, {
        id: profile.id,
        profile: profile,
        accessToken: accessToken,
      });
    }
  )
);

// serialize and deserialize user
passport.serializeUser(function (user: Express.User, done) {
  return done(null, {
    id: user.id,
    accessToken: user.accessToken,
    profile: user.profile,
  });
});

passport.deserializeUser(function (user: Express.User, done) {
  done(null, user);
});
