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
exports.contentRouter = void 0;
const express_1 = __importDefault(require("express"));
const ManageContent_1 = require("../controllers/ManageContent");
const contentRouter = express_1.default.Router();
exports.contentRouter = contentRouter;
// add new bucket list
contentRouter.post("/bucket-list", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const newBucketList = {
        google_id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.profile.id,
        privacy_type: req.body.privacy_type,
        title: req.body.title,
        description: req.body.description,
        permissions: req.body.permissions,
    };
    (0, ManageContent_1.addBucketList)(newBucketList, (err, creationId) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(200).json({ creationId: creationId });
    });
}));
// delete a bucket list
contentRouter.delete("/bucket-list", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const trackerID = Number(req.query.id);
    (0, ManageContent_1.deleteBucketList)(trackerID, (err, insertId) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(200).json({ insertId: insertId });
    });
}));
// update a bucket list's info
contentRouter.patch("/bucket-list", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedBucketList = {
        id: req.body.id,
        privacy_type: req.body.privacy_type,
        title: req.body.title,
        description: req.body.description,
        permissions: req.body.permissions,
    };
    (0, ManageContent_1.updateBucketList)(updatedBucketList, (err, updateID) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(200).json({ updateID: updateID });
    });
}));
// add an activity to a particular bucket list based on id of that list
contentRouter.post("/activity", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newActivity = req.body;
    (0, ManageContent_1.addActivity)(newActivity, (err, addId) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(200).json({ addId: addId });
    });
}));
// update an activity in a bucket list
contentRouter.patch("/activity", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedActivity = req.body;
    (0, ManageContent_1.updateActivity)(updatedActivity, (err, updatedId) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(200).json({ updatedId: updatedId });
    });
}));
// delete an activity from a bucket list based on id of that list
contentRouter.delete("/activity", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const activityIDs = {
        trackerID: Number(req.query.tracker_id),
        contentID: Number(req.query.content_id),
    };
    (0, ManageContent_1.deleteActivity)(activityIDs, (err, insertID) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(200).json({ insertID: insertID });
    });
}));
// delete all activities from a bucket list based on id of that list
contentRouter.delete("/all-activities", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const trackerID = Number(req.query.id);
    (0, ManageContent_1.deleteAllActivities)(trackerID, (err, insertID) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(200).json({ insertID: insertID });
    });
}));
// add various users to shared_list_users from supplied user ID's
contentRouter.post("/shared-list-users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bucketListID = Number(req.body.bucketListID);
    const selectedUserIDs = req.body.selectedUserIDs;
    // if anything is empty, return
    if (!bucketListID || !selectedUserIDs || selectedUserIDs.length === 0) {
        return res
            .status(400)
            .json({ message: "Not all necessary inputs were sent." });
    }
    // convert provided values into array of arrays for bulk insertion
    let convertedArray = [];
    for (let i = 0; i < selectedUserIDs.length; i++) {
        convertedArray.push([bucketListID, selectedUserIDs[i]]);
    }
    (0, ManageContent_1.addSharedListUsers)(convertedArray, (err, insertID) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(200).json({ message: insertID });
    });
}));
// remove various users to shared_list_users from supplied user ID's
contentRouter.post("/delete-shared-list-users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bucketListID = Number(req.body.bucketListID);
    const removedUserIDs = req.body.removedUserIDs;
    // if anything is empty, return
    if (!bucketListID || !removedUserIDs || removedUserIDs.length === 0) {
        return res
            .status(400)
            .json({ message: "Not all necessary inputs were sent." });
    }
    // convert provided values into array of arrays for bulk insertion
    let convertedArray = [];
    for (let i = 0; i < removedUserIDs.length; i++) {
        convertedArray.push([bucketListID, removedUserIDs[i]]);
    }
    (0, ManageContent_1.removeSharedListUsers)(convertedArray, (err, insertID) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(200).json({ message: insertID });
    });
}));
contentRouter.delete("/all-shared-list-users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const trackerID = Number(req.query.id);
    (0, ManageContent_1.deleteAllSharedListUsers)(trackerID, (err, insertID) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(200).json({ insertID: insertID });
    });
}));
