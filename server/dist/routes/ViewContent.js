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
const viewContentRouter = express_1.default.Router();
exports.viewContentRouter = viewContentRouter;
viewContentRouter.get("/lists/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = Number(req.params.id);
    (0, ViewContent_1.findBucketLists)(userId, (err, lists) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(200).json({ data: lists });
    });
}));
