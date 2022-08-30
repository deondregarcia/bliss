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
const ManageContent_1 = require("./routes/ManageContent");
const ViewContent_1 = require("./routes/ViewContent");
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
const cors = require("cors");
require("./routes/auth");
const isLoggedIn = (req, res, next) => {
    req.user ? next() : res.sendStatus(401);
};
const app = (0, express_1.default)();
app.use((0, express_session_1.default)({ secret: process.env.SESSION_SECRET }));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
dotenv.config();
app.use(cors());
app.use(bodyParser.json());
app.use("/content", ManageContent_1.contentRouter);
app.use("/view", ViewContent_1.viewContentRouter);
// auth testing
app.get("/auth/google", passport_1.default.authenticate("google", { scope: ["email", "profile"] }));
// app.get(
//   "/google/callback",
//   passport.authenticate("google", { failureRedirect: "/auth/failure" }),
//   (req: Request, res: Response) => {
//     res.redirect("/");
//   }
// );
app.get("/auth/google/callback", passport_1.default.authenticate("google", { failureRedirect: "/auth/failure" }), (req, res) => {
    res.redirect("/");
});
app.get("/", (req, res) => {
    res.send('<a href="/auth/google">Authenticate with Google</a>');
});
app.get("/auth/failure", (req, res) => {
    res.send("something went wrong...");
});
app.get("/protected", isLoggedIn, (req, res) => {
    res.send("Hello!");
});
// auth testing ----
app.listen(process.env.PORT, () => {
    console.log(`Node server started running on Port ${process.env.PORT}`);
});
