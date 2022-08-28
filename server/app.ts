import * as dotenv from "dotenv";
import express from "express";
import * as bodyParser from "body-parser";

const app = express();
dotenv.config();

app.use(bodyParser.json());

app.listen(process.env.PORT, () => {
  console.log(`Node server started running on Port ${process.env.PORT}`);
});
