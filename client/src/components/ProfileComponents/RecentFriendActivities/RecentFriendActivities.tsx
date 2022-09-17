import React, { useState, useEffect } from "react";
import { BucketListContentType, FriendListType } from "../../../types/content";
import "./RecentFriendActivities.css";

const RecentFriendActivities = ({
  recentFriendActivities,
  friends,
}: {
  recentFriendActivities: BucketListContentType[];
  friends: FriendListType[];
}) => {
  const [activityIndex, setActivityIndex] = useState(0);
  let indexTracker = 0;

  // cycle between all indices of recent friend activities
  const cycleIndex = () => {
    if (indexTracker === recentFriendActivities.length - 1) {
      indexTracker = 0;
      setActivityIndex(indexTracker);
    } else if (indexTracker < recentFriendActivities.length - 1) {
      indexTracker = indexTracker + 1;
      setActivityIndex(indexTracker);
    } else {
      // just in case the index somehow grows larger than length of array
      indexTracker = 0;
      setActivityIndex(indexTracker);
    }
  };

  useEffect(() => {
    if (recentFriendActivities.length === 1) {
      return;
    }
    const interval = setInterval(() => {
      cycleIndex();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="recent-friend-activities-container">
      {friends.map((friend, index) => {
        if (friend.user_id === recentFriendActivities[activityIndex].user_id) {
          return <p key={index}>{friend.first_name} recently added:</p>;
        }
      })}
      <p className="recent-friend-activity">
        {recentFriendActivities[activityIndex].activity}
      </p>
    </div>
  );
};

export default RecentFriendActivities;
