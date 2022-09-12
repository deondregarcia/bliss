import express, { Request, Response } from "express";
import {
  createBucketList,
  addActivity,
  updateActivity,
  deleteActivity,
  updateBucketList,
  deleteBucketList,
  addSharedListUsers,
  removeSharedListUsers,
} from "../controllers/ManageContent";
import { BucketList, BucketListContent } from "../types/content";

const contentRouter = express.Router();

// create new bucket list
contentRouter.post("/create", async (req: Request, res: Response) => {
  const newBucketList: BucketList = {
    google_id: req.user?.profile.id,
    privacy_type: req.body.privacy_type,
    title: req.body.title,
    description: req.body.description,
    permissions: req.body.permissions,
  };

  createBucketList(newBucketList, (err: Error, creationId: number) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    res.status(200).json({ creationId: creationId });
  });
});

// add an activity to a particular bucket list based on id of that list
contentRouter.post("/add", async (req: Request, res: Response) => {
  const newActivity: BucketListContent = req.body;

  addActivity(newActivity, (err: Error, addId: number) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    res.status(200).json({ addId: addId });
  });
});

// delete an activity from a bucket list based on id of that list
contentRouter.post("/delete-activity", async (req: Request, res: Response) => {
  const activityIDs = {
    trackerID: req.body.tracker_id,
    contentID: req.body.content_id,
  };

  deleteActivity(activityIDs, (err: Error, insertID: number) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    res.status(200).json({ insertID: insertID });
  });
});

// delete a bucket list
contentRouter.post(
  "/delete-bucket-list",
  async (req: Request, res: Response) => {
    const trackerID = Number(req.body.id);

    deleteBucketList(trackerID, (err: Error, insertId: number) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }

      res.status(200).json({ insertId: insertId });
    });
  }
);

// update an activity in a bucket list
contentRouter.put("/update-activity", async (req: Request, res: Response) => {
  const updatedActivity: BucketListContent = req.body;

  updateActivity(updatedActivity, (err: Error, updatedId: number) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    res.status(200).json({ updatedId: updatedId });
  });
});

// update a bucket list's info
contentRouter.put(
  "/update-bucket-list",
  async (req: Request, res: Response) => {
    const updatedBucketList: BucketList = {
      id: req.body.id,
      privacy_type: req.body.privacy_type,
      title: req.body.title,
      description: req.body.description,
      permissions: req.body.permissions,
    };

    updateBucketList(updatedBucketList, (err: Error, updateID: number) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }

      res.status(200).json({ updateID: updateID });
    });
  }
);

// add various users to shared_list_users from supplied user ID's
contentRouter.post(
  "/add-shared-list-users",
  async (req: Request, res: Response) => {
    const ownerID = Number(req.body.ownerID);
    const bucketListID = Number(req.body.bucketListID);
    const selectedUserIDs: number[] = req.body.selectedUserIDs;

    // if anything is empty, return
    if (
      !ownerID ||
      !bucketListID ||
      !selectedUserIDs ||
      selectedUserIDs.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "Not all necessary inputs were sent." });
    }

    // convert provided values into array of arrays for bulk insertion
    let convertedArray: number[][] = [];

    for (let i = 0; i < selectedUserIDs.length; i++) {
      convertedArray.push([bucketListID, selectedUserIDs[i], ownerID]);
    }

    addSharedListUsers(convertedArray, (err: Error, insertID: number) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }

      res.status(200).json({ message: insertID });
    });
  }
);

// remove various users to shared_list_users from supplied user ID's
contentRouter.post(
  "/remove-shared-list-users",
  async (req: Request, res: Response) => {
    const bucketListID = Number(req.body.bucketListID);
    const removedUserIDs: number[] = req.body.removedUserIDs;

    // if anything is empty, return
    if (!bucketListID || !removedUserIDs || removedUserIDs.length === 0) {
      return res
        .status(400)
        .json({ message: "Not all necessary inputs were sent." });
    }

    // convert provided values into array of arrays for bulk insertion
    let convertedArray: number[][] = [];

    for (let i = 0; i < removedUserIDs.length; i++) {
      convertedArray.push([bucketListID, removedUserIDs[i]]);
    }

    removeSharedListUsers(convertedArray, (err: Error, insertID: number) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }

      res.status(200).json({ message: insertID });
    });
  }
);

export { contentRouter };
