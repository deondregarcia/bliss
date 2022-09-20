import express, { Request, Response } from "express";
import { addBucketList } from "../controllers/ManageContent";
import {
  getIncomingFriendRequests,
  getOutgoingFriendRequests,
  updateWantsTo,
} from "../controllers/UserManagement";
import {
  getBucketLists,
  getActivities,
  getPrivacyTypeAndOwner,
  checkIfShared,
  getBucketListInfo,
  getUserInfo,
  getSharedLists,
  getFriendsLists,
  getListOfFriends,
  getUserList,
  getPublicBucketLists,
  getSharedListUsers,
  getAllContributors,
  getRecentFriendActivities,
} from "../controllers/ViewContent";
import {
  BucketList,
  BucketListContent,
  FriendListType,
  FriendRequestUserType,
  FullUserListType,
  PrivacyAndOwnerType,
  SharedListUserType,
} from "../types/content";

// /sample prefix in url
const sampleContentRouter = express.Router();

// ********** this file is for routing when person is viewing sample account; these routes bypass the need to be logged in with a google user account **********

// get all contributor's for all of user's owned, shared bucket lists
sampleContentRouter.get(
  "/all-contributors",
  async (req: Request, res: Response) => {
    const userGoogleID = "108259638600875384112";

    getAllContributors(
      userGoogleID,
      (err: Error, contributorObjects: SharedListUserType[]) => {
        if (err) {
          return res.status(500).json({ message: err.message });
        }

        res.status(200).json({ contributorObjects });
      }
    );
  }
);

sampleContentRouter.get("/googleuser", (req: Request, res: Response) => {
  res.status(200).json({
    google_user: {
      id: "108259638600875384112",
      displayName: "Elon Tusk",
      name: {
        familyName: "Elon",
        givenName: "Tusk",
      },
      emails: [{ value: "deondretest@gmail.com" }],
      photos: [
        {
          value:
            "https://lh3.googleusercontent.com/a-/ACNPEu-wMcNQCE9fn2rLliZNfONl7yXIwbrV2AkRb0CR=s96-c",
        },
      ],
    },
  });
});

// get list of friends from google id
sampleContentRouter.get(
  "/list-of-friends",
  async (req: Request, res: Response) => {
    const userGoogleID = "108259638600875384112";

    getListOfFriends(userGoogleID, (err: Error, friends: FriendListType[]) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }

      res.status(200).json({ friends });
    });
  }
);

// get outgoing friend requests for a user from user's google id
sampleContentRouter.get(
  "/outgoing-friend-requests",
  async (req: Request, res: Response) => {
    const userGoogleID = "108259638600875384112";

    getOutgoingFriendRequests(
      userGoogleID,
      (err: Error, outgoingRequestUsers: FriendRequestUserType[]) => {
        if (err) {
          return res.status(500).json({ message: err.message });
        }

        res.status(200).json({ outgoingRequestUsers: outgoingRequestUsers });
      }
    );
  }
);

// get incoming friend requests for a user from user's google id
sampleContentRouter.get(
  "/incoming-friend-requests",
  async (req: Request, res: Response) => {
    const userGoogleID = "108259638600875384112";

    getIncomingFriendRequests(
      userGoogleID,
      (err: Error, incomingRequestUsers: FriendRequestUserType[]) => {
        if (err) {
          return res.status(500).json({ message: err.message });
        }

        res.status(200).json({ incomingRequestUsers: incomingRequestUsers });
      }
    );
  }
);

sampleContentRouter.get(
  "/recent-friend-activities",
  async (req: Request, res: Response) => {
    const userGoogleID = "108259638600875384112";

    getRecentFriendActivities(
      userGoogleID,
      (err: Error, activities: BucketListContent[]) => {
        if (err) {
          return res.status(500).json({ message: err.message });
        }

        res.status(200).json({ data: activities });
      }
    );
  }
);

// add new bucket list
sampleContentRouter.post(
  "/bucket-list",
  async (req: Request, res: Response) => {
    const newBucketList: BucketList = {
      google_id: "108259638600875384112",
      privacy_type: req.body.privacy_type,
      title: req.body.title,
      description: req.body.description,
      permissions: req.body.permissions,
    };

    addBucketList(newBucketList, (err: Error, creationId: number) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }

      res.status(200).json({ creationId: creationId });
    });
  }
);

// update wants_to portion of user
sampleContentRouter.patch("/wants-to", async (req: Request, res: Response) => {
  const userGoogleID = "108259638600875384112";
  const wantsToText = req.body.newWantsToText;

  updateWantsTo(userGoogleID, wantsToText, (err: Error, insertID: number) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    res.status(200).json({ insertID: insertID });
  });
});

export { sampleContentRouter };
