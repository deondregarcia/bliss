"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const express_1 = __importDefault(require("express"));
const bodyParser = __importStar(require("body-parser"));
const axios_1 = __importDefault(require("axios"));
// import some controllers; extract these to the controllers folder later
const VerifySession_1 = require("./controllers/VerifySession");
// import routes files
const ManageContent_1 = require("./routes/ManageContent");
const ViewContent_1 = require("./routes/ViewContent");
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
// import packages for MySQl session store
const mysql = require("mysql2/promise");
const MySQLStore = require("express-mysql-session")(express_session_1.default);
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
const app = (0, express_1.default)();
app.use(cors({ credentials: true }));
app.use(cookieParser());
// this middleware fires for every consecutive request to the server
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    // cookie: { secure: false },
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use(bodyParser.json());
app.use("/content", ManageContent_1.contentRouter);
app.use("/view", ViewContent_1.viewContentRouter);
// auth testing
const isLoggedIn = (req, res, next) => {
    req.user ? next() : res.sendStatus(401);
};
app.get("/auth/google", passport_1.default.authenticate("google", { scope: ["email", "profile"] }));
app.get("/auth/google/callback", passport_1.default.authenticate("google", { failureRedirect: "/auth/failure" }), (req, res) => {
    var _a;
    // res.redirect(`http://localhost:3001/${req?.user?.id}`);
    // in the future, redirect to profile by /profile/:id
    res.redirect(`http://localhost:3001/my-profile/${(_a = req.user) === null || _a === void 0 ? void 0 : _a.id}`);
});
app.get("/auth/user", passport_1.default.authenticate("google", { scope: ["email", "profile"] }), (req, res) => {
    // console.log(req.sessionStore["sessions"]);
    // console.log(req.cookies);
    res.json({ user: req.user });
});
app.get("/", (req, res) => {
    res.send('<a href="/auth/google">Authenticate with Google</a>');
});
app.get("/auth/failure", (req, res) => {
    res.send("something went wrong...");
});
app.get("/protected", isLoggedIn, (req, res) => {
    res.send(req.user);
});
// for testing client-server interactions
app.get("/verify", (req, res) => {
    const reqSessionID = req.session.id;
    (0, VerifySession_1.verifySession)(reqSessionID, (err, sessions) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(200).json({ session_info: sessions[0] });
    });
});
app.post("/get-recipes", (req, res) => {
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
    axios_1.default.get("https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch", recipeOptions)
        .then((response) => {
        recipeResponse = response.data.results;
        res.status(200).json({ data: response.data.results });
    })
        .catch((err) => {
        console.log(err);
    });
});
app.post("/check-if-friend-with-google-id", (req, res) => {
    var _a;
    const reqUserID = String((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
    const secondID = req.body.secondID;
    if (!req.user) {
        res.status(200).json({ friendPairsInfo: [] });
    }
    (0, VerifySession_1.checkIfFriend)(reqUserID, secondID, (err, friendPairs) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(200).json({ friendPairsInfo: friendPairs });
    });
});
app.post("/check-if-friend-with-user-id", (req, res) => {
    var _a;
    const reqUserGoogleID = String((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
    const secondID = req.body.secondID;
    console.log("reqUserID: " + reqUserGoogleID + " , " + "secondID: " + secondID);
    if (!req.user) {
        res.status(200).json({ friendPairsInfo: [] });
    }
    (0, VerifySession_1.checkIfFriendWithUserID)(reqUserGoogleID, secondID, (err, friendPairs) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(200).json({ friendPairsInfo: friendPairs });
    });
});
app.get("/googleuser", (req, res) => {
    var _a;
    // console.log(req.user?.profile);
    res.status(200).json({ google_user: (_a = req.user) === null || _a === void 0 ? void 0 : _a.profile });
});
// gets user id from google id
app.get("/get-user-id", (req, res) => {
    var _a;
    if (!req.user) {
        return res.status(200).json({ userID: [] });
    }
    const userGoogleID = (_a = req.user) === null || _a === void 0 ? void 0 : _a.profile.id;
    (0, VerifySession_1.getUserID)(userGoogleID, (err, userID) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(200).json({ userID: userID });
    });
});
app.get("/logout", (req, res, err) => {
    req.logout(err);
    req.session.destroy((err) => {
        if (err)
            throw err;
        console.log(req.session);
        res.redirect("/");
    });
});
// auth testing ----
app.listen(process.env.PORT, () => {
    console.log(`Node server started running on Port ${process.env.PORT}`);
});
