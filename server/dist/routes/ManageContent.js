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
    const newBucketList = req.body;
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
