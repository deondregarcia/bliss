import express, { Request, Response } from "express";
import { getBucketLists, getActivities } from "../controllers/ViewContent";
import { BucketList, BucketListContent } from "../types/content";

// /view prefix in url
const viewContentRouter = express.Router();

// get all lists for a user based on their google_id
viewContentRouter.get(
  "/lists/:google_id",
  async (req: Request, res: Response) => {
    const googleId: string = String(req.params.google_id);
    console.log(googleId);
    getBucketLists(googleId, (err: Error, lists: BucketList[]) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }

      res.status(200).json({ data: lists });
    });
  }
);

// get all activities for a bucket list based on id of bucket list
viewContentRouter.get(
  "/activities/:id",
  async (req: Request, res: Response) => {
    const bucketListId: number = Number(req.params.id);
    getActivities(
      bucketListId,
      (err: Error, activities: BucketListContent[]) => {
        if (err) {
          return res.status(500).json({ message: err.message });
        }

        res.status(200).json({ data: activities });
      }
    );
  }
);

export { viewContentRouter };
