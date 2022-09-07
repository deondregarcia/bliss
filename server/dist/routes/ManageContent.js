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
// create new bucket list
contentRouter.post("/create", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const newBucketList = {
        google_id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.profile.id,
        privacy_type: req.body.privacy_type,
        title: req.body.title,
        description: req.body.description,
        permissions: req.body.permissions,
    };
    (0, ManageContent_1.createBucketList)(newBucketList, (err, creationId) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(200).json({ creationId: creationId });
    });
}));
// add an activity to a particular bucket list based on id of that list
contentRouter.post("/add", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newActivity = req.body;
    (0, ManageContent_1.addActivity)(newActivity, (err, addId) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(200).json({ addId: addId });
    });
}));
// delete an activity from a bucket list based on id of that list
contentRouter.post("/delete-activity", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const activityIDs = {
        trackerID: req.body.tracker_id,
        contentID: req.body.content_id,
    };
    (0, ManageContent_1.deleteActivity)(activityIDs, (err, insertID) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(200).json({ insertID: insertID });
    });
}));
// delete a bucket list
contentRouter.post("/delete-bucket-list", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const trackerID = Number(req.body.id);
    (0, ManageContent_1.deleteBucketList)(trackerID, (err, insertId) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(200).json({ insertId: insertId });
    });
}));
// update an activity in a bucket list
contentRouter.put("/update-activity", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedActivity = req.body;
    (0, ManageContent_1.updateActivity)(updatedActivity, (err, updatedId) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(200).json({ updatedId: updatedId });
    });
}));
// update a bucket list's info
contentRouter.put("/update-bucket-list", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
