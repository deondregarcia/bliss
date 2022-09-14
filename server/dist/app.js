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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
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
const UserManagement_1 = require("./controllers/UserManagement");
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
    res.redirect(`http://localhost:3001/my-profile/${(_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id}`);
});
app.get("/auth/user", passport_1.default.authenticate("google", { scope: ["email", "profile"] }), (req, res) => {
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
            number: 3,
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
// send a friend request based on google ID's
app.post("/send-friend-request", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    // check if user is logged in/google id exists
    if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
        return res.status(403).json({ message: "User's Google ID not found" });
    }
    const requestorGoogleID = String((_b = req.user) === null || _b === void 0 ? void 0 : _b.id); // google id of person sending the request
    const requesteeGoogleID = req.body.requesteeGoogleID; // google id of person receiving the request
    (0, UserManagement_1.sendFriendRequest)(requestorGoogleID, requesteeGoogleID, (err, insertID) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(200).json({ insertID: insertID });
    });
}));
// accept a friend request -> insert into friends
app.post("/accept-request", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    // check if user is logged in/google id exists
    if (!((_c = req.user) === null || _c === void 0 ? void 0 : _c.id)) {
        return res.status(403).json({ message: "User's Google ID not found" });
    }
    const userGoogleID = String((_d = req.user) === null || _d === void 0 ? void 0 : _d.id);
    const friendGoogleID = req.body.google_id;
    (0, UserManagement_1.acceptRequest)(userGoogleID, friendGoogleID, (err, insertID) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(200).json({ insertID: insertID });
    });
}));
// deny a friend request -> delete from friend_requests
app.post("/deny-request", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f;
    // check if user is logged in/google id exists
    if (!((_e = req.user) === null || _e === void 0 ? void 0 : _e.id)) {
        return res.status(403).json({ message: "User's Google ID not found" });
    }
    const userGoogleID = String((_f = req.user) === null || _f === void 0 ? void 0 : _f.id);
    const friendGoogleID = req.body.google_id;
    (0, UserManagement_1.denyRequest)(userGoogleID, friendGoogleID, (err, deletionID) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(200).json({ deletionID: deletionID });
    });
}));
// get outgoing friend requests for a user from user's google id
app.get("/get-outgoing-friend-requests", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _g, _h;
    // check if user is logged in/google id exists
    if (!((_g = req.user) === null || _g === void 0 ? void 0 : _g.id)) {
        return res.status(403).json({ message: "User's Google ID not found" });
    }
    const userGoogleID = String((_h = req.user) === null || _h === void 0 ? void 0 : _h.id);
    (0, UserManagement_1.getOutgoingFriendRequests)(userGoogleID, (err, outgoingRequestUsers) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(200).json({ outgoingRequestUsers: outgoingRequestUsers });
    });
}));
// get incoming friend requests for a user from user's google id
app.get("/get-incoming-friend-requests", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _j, _k;
    // check if user is logged in/google id exists
    if (!((_j = req.user) === null || _j === void 0 ? void 0 : _j.id)) {
        return res.status(403).json({ message: "User's Google ID not found" });
    }
    const userGoogleID = String((_k = req.user) === null || _k === void 0 ? void 0 : _k.id);
    (0, UserManagement_1.getIncomingFriendRequests)(userGoogleID, (err, incomingRequestUsers) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(200).json({ incomingRequestUsers: incomingRequestUsers });
    });
}));
app.get("/googleuser", (req, res) => {
    var _a;
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
app.post("/check-if-username-exists", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = String(req.body.username);
    (0, UserManagement_1.checkUsername)(username, (err, usernameExists) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(200).json({ username: usernameExists });
    });
}));
app.post("/create-user", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _l, _m, _o;
    if (!((_l = req.user) === null || _l === void 0 ? void 0 : _l.profile.id)) {
        return res.status(500).json({ message: "No Google ID" });
    }
    const newUser = {
        username: req.body.username,
        first_name: req.body.firstName,
        last_name: req.body.lastName,
        created_at: new Date(),
        google_id: String((_m = req.user) === null || _m === void 0 ? void 0 : _m.profile.id),
        wants_to: req.body.wantsTo,
        google_photo_link: String((_o = req.user) === null || _o === void 0 ? void 0 : _o.profile.photos[0].value),
    };
    (0, UserManagement_1.createUser)(newUser, (err, insertID) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(200).json({ insertID: insertID });
    });
}));
app.get("/logout", (req, res, err) => {
    req.session.destroy((err) => {
        if (err)
            throw err;
        res.status(200).json({ message: "Successfuly cleared session" });
    });
});
// auth testing ----
app.listen(process.env.PORT, () => {
    console.log(`Node server started running on Port ${process.env.PORT}`);
});
