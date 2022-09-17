import express, { Request, Response } from "express";
import {
  acceptRequest,
  checkUsername,
  createUser,
  denyRequest,
  getIncomingFriendRequests,
  getOutgoingFriendRequests,
  sendFriendRequest,
  checkIfFriend,
  checkIfFriendWithUserID,
  getUserID,
  updateGooglePhoto,
  updateWantsTo,
} from "../controllers/UserManagement";
import { FriendPairType, FriendRequestUserType } from "../types/content";

const manageUserRouter = express.Router();

// send a friend request based on google ID's by inserting into friend_requests
manageUserRouter.post(
  "/friend-request",
  async (req: Request, res: Response) => {
    // check if user is logged in/google id exists
    if (!req.user?.id) {
      return res.status(403).json({ message: "User's Google ID not found" });
    }

    const requestorGoogleID = String(req.user?.id); // google id of person sending the request
    const requesteeGoogleID = req.body.requesteeGoogleID; // google id of person receiving the request

    sendFriendRequest(
      requestorGoogleID,
      requesteeGoogleID,
      (err: Error, insertID: number) => {
        if (err) {
          return res.status(500).json({ message: err.message });
        }

        res.status(200).json({ insertID: insertID });
      }
    );
  }
);

// accept a friend request -> insert into friends
manageUserRouter.post("/friends", async (req: Request, res: Response) => {
  // check if user is logged in/google id exists
  if (!req.user?.id) {
    return res.status(403).json({ message: "User's Google ID not found" });
  }

  const userGoogleID = String(req.user?.id);
  const friendGoogleID = req.body.google_id;

  acceptRequest(
    userGoogleID,
    friendGoogleID,
    (err: Error, insertID: number) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }

      res.status(200).json({ insertID: insertID });
    }
  );
});

// deny a friend request -> delete from friend_requests
manageUserRouter.delete(
  "/friend-request",
  async (req: Request, res: Response) => {
    // check if user is logged in/google id exists
    if (!req.user?.id) {
      return res.status(403).json({ message: "User's Google ID not found" });
    }

    const userGoogleID = String(req.user?.id);
    const friendGoogleID = String(req.query.google_id);

    denyRequest(
      userGoogleID,
      friendGoogleID,
      (err: Error, deletionID: number) => {
        if (err) {
          return res.status(500).json({ message: err.message });
        }

        res.status(200).json({ deletionID: deletionID });
      }
    );
  }
);

// gets user id from google id
manageUserRouter.get("/user-id", (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(200).json({ userID: [] });
  }
  const userGoogleID = req.user?.profile.id;

  getUserID(userGoogleID, (err: Error, userID: number) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    res.status(200).json({ userID: userID });
  });
});

// get friend from friend's google ID
manageUserRouter.get(
  "/friend/google-id/:googleID",
  (req: Request, res: Response) => {
    const reqUserID = String(req.user?.id);
    const secondID = req.params.googleID;

    if (!req.user) {
      res.status(200).json({ friendPairsInfo: [] });
    }

    checkIfFriend(
      reqUserID,
      secondID,
      (err: Error, friendPairs: FriendPairType[]) => {
        if (err) {
          return res.status(500).json({ message: err.message });
        }

        res.status(200).json({ friendPairsInfo: friendPairs });
      }
    );
  }
);

// get friend from friend ID
manageUserRouter.get(
  "/friend/friend-id/:friendID",
  (req: Request, res: Response) => {
    const reqUserGoogleID = String(req.user?.id);
    const secondID = req.params.userID;

    if (!req.user) {
      res.status(200).json({ friendPairsInfo: [] });
    }

    checkIfFriendWithUserID(
      reqUserGoogleID,
      secondID,
      (err: Error, friendPairs: FriendPairType[]) => {
        if (err) {
          return res.status(500).json({ message: err.message });
        }

        res.status(200).json({ friendPairsInfo: friendPairs });
      }
    );
  }
);

manageUserRouter.get("/googleuser", (req: Request, res: Response) => {
  res.status(200).json({ google_user: req.user?.profile });
});

// get outgoing friend requests for a user from user's google id
manageUserRouter.get(
  "/outgoing-friend-requests",
  async (req: Request, res: Response) => {
    // check if user is logged in/google id exists
    if (!req.user?.id) {
      return res.status(403).json({ message: "User's Google ID not found" });
    }

    const userGoogleID = String(req.user?.id);

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
manageUserRouter.get(
  "/incoming-friend-requests",
  async (req: Request, res: Response) => {
    // check if user is logged in/google id exists
    if (!req.user?.id) {
      return res.status(403).json({ message: "User's Google ID not found" });
    }
    const userGoogleID = String(req.user?.id);

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

// get username to check if it exists
manageUserRouter.post(
  "/username/:username",
  async (req: Request, res: Response) => {
    const username = String(req.params.username);

    checkUsername(username, (err: Error, usernameExists: string) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }

      res.status(200).json({ username: usernameExists });
    });
  }
);

// create user
manageUserRouter.post("/user", async (req: Request, res: Response) => {
  if (!req.user?.profile) {
    return res.status(500).json({ message: "No Google ID" });
  }

  const newUser = {
    username: req.body.username,
    first_name: req.body.firstName,
    last_name: req.body.lastName,
    created_at: new Date(),
    google_id: String(req.user!.profile.id),
    wants_to: req.body.wantsTo,
  };

  createUser(newUser, (err: Error, insertID: number) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    res.status(200).json({ insertID: insertID });
  });
});

// update profile photo to reflect new google photo
manageUserRouter.patch("/google-photo", async (req: Request, res: Response) => {
  // check if user is logged in/google id exists
  if (!req.user?.id) {
    return res.status(403).json({ message: "User's Google ID not found" });
  }
  const userGoogleID = String(req.user?.id);
  const googlePhotoLink = String(req.body.googlePhotoLink);

  updateGooglePhoto(
    userGoogleID,
    googlePhotoLink,
    (err: Error, insertID: number) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }

      res.status(200).json({ insertID: insertID });
    }
  );
});

// update wants_to portion of user
manageUserRouter.patch("/wants-to", async (req: Request, res: Response) => {
  // check if user is logged in/google id exists
  if (!req.user?.id) {
    return res.status(403).json({ message: "User's Google ID not found" });
  }
  const userGoogleID = req.user?.id;
  const wantsToText = req.body.newWantsToText;

  console.log(userGoogleID);
  console.log(wantsToText);

  updateWantsTo(userGoogleID, wantsToText, (err: Error, insertID: number) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    res.status(200).json({ insertID: insertID });
  });
});

export { manageUserRouter };
