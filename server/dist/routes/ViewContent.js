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
exports.viewContentRouter = void 0;
const express_1 = __importDefault(require("express"));
const ViewContent_1 = require("../controllers/ViewContent");
// /view prefix in url
const viewContentRouter = express_1.default.Router();
exports.viewContentRouter = viewContentRouter;
// get all lists for a user based on their google_id
viewContentRouter.get("/lists/:google_id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const googleID = String(req.params.google_id);
    (0, ViewContent_1.getBucketLists)(googleID, (err, lists) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(200).json({ data: lists });
    });
}));
// get only public_random lists for viewing profiles where user is not friends with them
viewContentRouter.get("/public-lists/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userGoogleID = req.params.id;
    (0, ViewContent_1.getPublicBucketLists)(userGoogleID, (err, lists) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(200).json({ data: lists });
    });
}));
// get lists for friend profile, get all public_friends/public_random and relevant shared lists
// note, this gets called after "/get-shared-lists/:id" gets called down below to get shared list ID's
viewContentRouter.post("/friend-lists", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const sharedListIDs = {
        array: (_a = req.body) === null || _a === void 0 ? void 0 : _a.sharedListArray,
        friendGoogleID: req.body.friendGoogleID,
    };
    (0, ViewContent_1.getFriendsLists)(sharedListIDs.array, sharedListIDs.friendGoogleID, (err, lists) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(200).json({ data: lists });
    });
}));
// get title and description of a bucket list
viewContentRouter.get("/bucket-list-info/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bucketListID = Number(req.params.id);
    (0, ViewContent_1.getBucketListInfo)(bucketListID, (err, bucketListInfo) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(200).json({ data: bucketListInfo });
    });
}));
// get all activities for a bucket list based on id of bucket list
viewContentRouter.get("/activities/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bucketListId = Number(req.params.id);
    (0, ViewContent_1.getActivities)(bucketListId, (err, activities) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(200).json({ data: activities });
    });
}));
// get privacy type of bucket list based on its bucket_list_tracker id and get owner google idowner-
viewContentRouter.get("/privacy-type-and-owner-google-id/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bucketListID = Number(req.params.id);
    (0, ViewContent_1.getPrivacyTypeAndOwner)(bucketListID, (err, privacyAndOwners) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(200).json({ data: privacyAndOwners });
    });
}));
// check if user is in shared list for a particular bucket list
viewContentRouter.get("/shared-list-user/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const userID = String((_b = req.user) === null || _b === void 0 ? void 0 : _b.id);
    const bucketListID = Number(req.params.id);
    (0, ViewContent_1.checkIfShared)(userID, bucketListID, (err, sharedListUsers) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(200).json({ data: sharedListUsers });
    });
}));
// check if user, who is visiting friend profile, is in any shared_list_users rows with the friend and return those bucket_list_id's
// (uses Google ID)
viewContentRouter.get("/shared-lists/:id", (req, res) => {
    var _a;
    // check if user is logged in/google id exists
    if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.profile.id)) {
        return res.status(403).json({ message: "User's Google ID not found" });
    }
    const userGoogleID = req.user.profile.id;
    const friendGoogleID = req.params.id;
    (0, ViewContent_1.getSharedLists)(userGoogleID, friendGoogleID, (err, bucketListIDs) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(200).json({ bucketListIDs: bucketListIDs });
    });
});
// get all users in a shared list based on provided bucket list tracker id (id)
viewContentRouter.get("/all-shared-list-users/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const trackerID = Number(req.params.id);
    (0, ViewContent_1.getSharedListUsers)(trackerID, (err, contributorIDs) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(200).json({ contributorIDs });
    });
}));
// get all contributor's for all of user's owned, shared bucket lists
viewContentRouter.get("/all-contributors", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    // check if user is logged in/google id exists
    if (!((_c = req.user) === null || _c === void 0 ? void 0 : _c.id)) {
        return res.status(403).json({ message: "User's Google ID not found" });
    }
    const userGoogleID = String((_d = req.user) === null || _d === void 0 ? void 0 : _d.profile.id);
    (0, ViewContent_1.getAllContributors)(userGoogleID, (err, contributorObjects) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(200).json({ contributorObjects });
    });
}));
// get user info from database from google ID
viewContentRouter.get("/user-info/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const googleID = req.params.id;
    (0, ViewContent_1.getUserInfo)(googleID, (err, userInfo) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(200).json({ userInfo: userInfo });
    });
}));
// get list of friends from google id
viewContentRouter.get("/list-of-friends", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f;
    // check if user is logged in/google id exists
    if (!((_e = req.user) === null || _e === void 0 ? void 0 : _e.id)) {
        return res.status(403).json({ message: "User's Google ID not found" });
    }
    const userGoogleID = Number((_f = req.user) === null || _f === void 0 ? void 0 : _f.id);
    (0, ViewContent_1.getListOfFriends)(userGoogleID, (err, friends) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(200).json({ friends });
    });
}));
// get full list of users for search list, excluding current user
viewContentRouter.get("/full-user-list/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userGoogleID = String(req.params.id);
    (0, ViewContent_1.getUserList)(userGoogleID, (err, userList) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(200).json({ userList: userList });
    });
}));
viewContentRouter.get("/recent-friend-activities", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _g, _h;
    // check if user is logged in/google id exists
    if (!((_g = req.user) === null || _g === void 0 ? void 0 : _g.id)) {
        return res.status(403).json({ message: "User's Google ID not found" });
    }
    const userGoogleID = String((_h = req.user) === null || _h === void 0 ? void 0 : _h.id);
    (0, ViewContent_1.getRecentFriendActivities)(userGoogleID, (err, activities) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(200).json({ data: activities });
    });
}));
