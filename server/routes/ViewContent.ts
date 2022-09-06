import express, { Request, Response } from "express";
import {
  getBucketLists,
  getActivities,
  getPrivacyTypeAndOwner,
  checkIfShared,
} from "../controllers/ViewContent";
import {
  BucketList,
  BucketListContent,
  PrivacyAndOwnerType,
  SharedListUserType,
} from "../types/content";

// /view prefix in url
const viewContentRouter = express.Router();

// get all lists for a user based on their google_id
viewContentRouter.get(
  "/lists/:google_id",
  async (req: Request, res: Response) => {
    const googleID: string = String(req.params.google_id);
    getBucketLists(googleID, (err: Error, lists: BucketList[]) => {
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

// get privacy type of bucket list based on its bucket_list_tracker id and get owner google idowner-
viewContentRouter.get(
  "/privacy-type-and-owner-google-id/:id",
  async (req: Request, res: Response) => {
    const bucketListID = Number(req.params.id);
    getPrivacyTypeAndOwner(
      bucketListID,
      (err: Error, privacyAndOwners: PrivacyAndOwnerType[]) => {
        if (err) {
          return res.status(500).json({ message: err.message });
        }

        res.status(200).json({ data: privacyAndOwners });
      }
    );
  }
);

viewContentRouter.get(
  "/check-if-user-in-shared-list/:id",
  async (req: Request, res: Response) => {
    const userID = String(req.user?.id);
    const bucketListID = Number(req.params.id);
    checkIfShared(
      userID,
      bucketListID,
      (err: Error, sharedListUsers: SharedListUserType[]) => {
        if (err) {
          return res.status(500).json({ message: err.message });
        }

        res.status(200).json({ data: sharedListUsers });
      }
    );
  }
);

export { viewContentRouter };
