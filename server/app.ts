import * as dotenv from "dotenv";
import express from "express";
import * as bodyParser from "body-parser";
import { contentRouter } from "./routes/ManageContent";
import { viewContentRouter } from "./routes/ViewContent";

const app = express();
dotenv.config();

app.use(bodyParser.json());
app.use("/content", contentRouter);
app.use("/view", viewContentRouter);

app.listen(process.env.PORT, () => {
  console.log(`Node server started running on Port ${process.env.PORT}`);
});
