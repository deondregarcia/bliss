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
// import some controllers; extract these to the controllers folder later
const VerifySession_1 = require("./controllers/VerifySession");
// import routes files
const ManageContent_1 = require("./routes/ManageContent");
const ViewContent_1 = require("./routes/ViewContent");
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
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
    var _a, _b;
    // res.redirect(`http://localhost:3001/${req?.user?.id}`);
    console.log((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
    // in the future, redirect to profile by /profile/:id
    res.redirect(`http://localhost:3001/profile/${(_b = req.user) === null || _b === void 0 ? void 0 : _b.id}`);
});
app.get("/auth/user", passport_1.default.authenticate("google", { scope: ["email", "profile"] }), (req, res) => {
    // console.log(req.sessionStore["sessions"]);
    console.log(req.user);
    // console.log(req.cookies);
    res.json({ user: req.user });
});
app.get("/", (req, res) => {
    // console.log(req.session.id);
    // console.log(req.session.cookie);
    // req.session.isAuth = true;
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
    // hardcode temporarily to limit db queries
    // res.status(200).json({
    //   session_info: {
    //     session_id: "DtDNNsn5o7tTXZdzRda8vRpUN9noNs_j",
    //     expires: 1662231774,
    //     data: '{"cookie":{"originalMaxAge":null,"expires":null,"httpOnly":true,"path":"/"},"passport":{"user":{"id":"117205234781311561243","accessToken":"ya29.a0AVA9y1sWy75ksqPTB95dr18--t8M1dZSn8OvpRUr6ERBGgYBzpjakKJhkhaVXH7XqWtFhj4RcquioT3tEPhbgSqzxBJLh9tPWXaKQvnFKMQuuTDBApf9hXl9ONIZWCTWUG3aZfi78p0fbXiZQAC_qqXOQVGPaCgYKATASAQASFQE65dr8mIteswPy-ii2QadbSmtcBg0163"}}}',
    //   },
    // });
});
app.get("/logout", (req, res, err) => {
    req.logout(err);
    req.session.destroy((err) => {
        if (err)
            throw err;
        console.log(req.session);
        res.redirect("/");
    });
});
// auth testing ----
app.listen(process.env.PORT, () => {
    console.log(`Node server started running on Port ${process.env.PORT}`);
});
