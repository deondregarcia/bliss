import express, { Request, Response } from "express";
import { findBucketLists } from "../controllers/ViewContent";
import { BucketList, BucketListContent } from "../types/content";

const viewContentRouter = express.Router();

viewContentRouter.get("/lists/:id", async (req: Request, res: Response) => {
  const userId: number = Number(req.params.id);
  findBucketLists(userId, (err: Error, lists: BucketList[]) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    res.status(200).json({ data: lists });
  });
});

export { viewContentRouter };
