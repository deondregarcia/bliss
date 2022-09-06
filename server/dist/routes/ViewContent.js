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
viewContentRouter.get("/check-if-user-in-shared-list/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userID = String((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
    const bucketListID = Number(req.params.id);
    (0, ViewContent_1.checkIfShared)(userID, bucketListID, (err, sharedListUsers) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(200).json({ data: sharedListUsers });
    });
}));
