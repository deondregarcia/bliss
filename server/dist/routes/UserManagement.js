"use strict";
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
exports.manageUserRouter = void 0;
const express_1 = __importDefault(require("express"));
const UserManagement_1 = require("../controllers/UserManagement");
const manageUserRouter = express_1.default.Router();
exports.manageUserRouter = manageUserRouter;
// send a friend request based on google ID's by inserting into friend_requests
manageUserRouter.post("/friend-request", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
manageUserRouter.post("/friends", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
manageUserRouter.delete("/friend-request", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f;
    // check if user is logged in/google id exists
    if (!((_e = req.user) === null || _e === void 0 ? void 0 : _e.id)) {
        return res.status(403).json({ message: "User's Google ID not found" });
    }
    const userGoogleID = String((_f = req.user) === null || _f === void 0 ? void 0 : _f.id);
    const friendGoogleID = String(req.query.google_id);
    (0, UserManagement_1.denyRequest)(userGoogleID, friendGoogleID, (err, deletionID) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(200).json({ deletionID: deletionID });
    });
}));
// gets user id from google id
manageUserRouter.get("/user-id", (req, res) => {
    var _a;
    if (!req.user) {
        return res.status(200).json({ userID: [] });
    }
    const userGoogleID = (_a = req.user) === null || _a === void 0 ? void 0 : _a.profile.id;
    (0, UserManagement_1.getUserID)(userGoogleID, (err, userID) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(200).json({ userID: userID });
    });
});
// get friend from friend's google ID
manageUserRouter.get("/friend/google-id/:googleID", (req, res) => {
    var _a;
    const reqUserID = String((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
    const secondID = req.params.googleID;
    if (!req.user) {
        res.status(200).json({ friendPairsInfo: [] });
    }
    (0, UserManagement_1.checkIfFriend)(reqUserID, secondID, (err, friendPairs) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(200).json({ friendPairsInfo: friendPairs });
    });
});
// get friend from friend ID
manageUserRouter.get("/friend/friend-id/:friendID", (req, res) => {
    var _a;
    const reqUserGoogleID = String((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
    const secondID = req.params.userID;
    if (!req.user) {
        res.status(200).json({ friendPairsInfo: [] });
    }
    (0, UserManagement_1.checkIfFriendWithUserID)(reqUserGoogleID, secondID, (err, friendPairs) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(200).json({ friendPairsInfo: friendPairs });
    });
});
manageUserRouter.get("/googleuser", (req, res) => {
    var _a;
    res.status(200).json({ google_user: (_a = req.user) === null || _a === void 0 ? void 0 : _a.profile });
});
// get outgoing friend requests for a user from user's google id
manageUserRouter.get("/outgoing-friend-requests", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
manageUserRouter.get("/incoming-friend-requests", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
// get username to check if it exists
manageUserRouter.get("/username/:username", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = String(req.params.username);
    console.log("func ran");
    (0, UserManagement_1.checkUsername)(username, (err, usernameExists) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(200).json({ username: usernameExists });
    });
}));
// create user
manageUserRouter.post("/user", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _l;
    if (!((_l = req.user) === null || _l === void 0 ? void 0 : _l.profile)) {
        return res.status(500).json({ message: "No Google ID" });
    }
    const newUser = {
        username: req.body.username,
        first_name: req.body.firstName,
        last_name: req.body.lastName,
        created_at: new Date(),
        google_id: String(req.user.profile.id),
        wants_to: req.body.wantsTo,
    };
    (0, UserManagement_1.createUser)(newUser, (err, insertID) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(200).json({ insertID: insertID });
    });
}));
// update profile photo to reflect new google photo
manageUserRouter.patch("/google-photo", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _m, _o;
    // check if user is logged in/google id exists
    if (!((_m = req.user) === null || _m === void 0 ? void 0 : _m.id)) {
        return res.status(403).json({ message: "User's Google ID not found" });
    }
    const userGoogleID = String((_o = req.user) === null || _o === void 0 ? void 0 : _o.id);
    const googlePhotoLink = String(req.body.googlePhotoLink);
    (0, UserManagement_1.updateGooglePhoto)(userGoogleID, googlePhotoLink, (err, insertID) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(200).json({ insertID: insertID });
    });
}));
// update wants_to portion of user
manageUserRouter.patch("/wants-to", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _p, _q;
    // check if user is logged in/google id exists
    if (!((_p = req.user) === null || _p === void 0 ? void 0 : _p.id)) {
        return res.status(403).json({ message: "User's Google ID not found" });
    }
    const userGoogleID = (_q = req.user) === null || _q === void 0 ? void 0 : _q.id;
    const wantsToText = req.body.newWantsToText;
    console.log(userGoogleID);
    console.log(wantsToText);
    (0, UserManagement_1.updateWantsTo)(userGoogleID, wantsToText, (err, insertID) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(200).json({ insertID: insertID });
    });
}));
