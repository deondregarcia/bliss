import express, { Request, Response } from "express";
import {
  createBucketList,
  addActivity,
} from "../controllers/BucketListContent";
import { BucketList, BucketListContent } from "../types/content";

const contentRouter = express.Router();

contentRouter.post("/create", async (req: Request, res: Response) => {
  const newBucketList: BucketList = req.body;

  createBucketList(newBucketList, (err: Error, creationId: number) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    res.status(200).json({ creationId: creationId });
  });
});

contentRouter.post("/add", async (req: Request, res: Response) => {
  const newActivity: BucketListContent = req.body;

  addActivity(newActivity, (err: Error, addId: number) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    res.status(200).json({ addId: addId });
  });
});

export { contentRouter };
