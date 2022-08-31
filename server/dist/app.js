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
// import { url: URL } from 'url';
const url = require("url");
require("./routes/auth");
dotenv.config();
const isLoggedIn = (req, res, next) => {
    req.user ? next() : res.sendStatus(401);
};
const app = (0, express_1.default)();
app.use(cors());
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use(bodyParser.json());
app.use("/content", ManageContent_1.contentRouter);
app.use("/view", ViewContent_1.viewContentRouter);
// auth testing
app.get("/auth/google", passport_1.default.authenticate("google", { scope: ["email", "profile"] }));
app.get("/auth/google/callback", passport_1.default.authenticate("google", { failureRedirect: "/auth/failure" }), (req, res) => {
    var _a;
    console.log(req.user);
    res.redirect(`http://localhost:3001/${(_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id}`);
    // console.log(req.user);
    // console.log(res);
    // res.status(200).json({ user_object: req.user });
    // res.redirect("http://localhost:3001/");
    //   res.redirect(
    //     url.format({
    //       pathname: "http://localhost:3001/",
    //       query: {
    //         user_object: req.user,
    //       },
    //     })
    //   );
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
app.get("/logout", (req, res, err) => {
    req.logout(err);
    res.send("Goodbye!");
});
// auth testing ----
app.listen(process.env.PORT, () => {
    console.log(`Node server started running on Port ${process.env.PORT}`);
});
