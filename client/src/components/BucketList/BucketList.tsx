import React from "react";
import { BucketListType } from "../../types/content";
import "./BucketList.css";

// type BucketListTypeProps {
//     bucketList: BucketListType,
// }

const BucketList = ({ bucketList }: { bucketList: BucketListType }) => {
  return (
    <div className="bucket-list-container">
      <h1 className="bucket-list-title">{bucketList.title}</h1>
      <p>{bucketList.description}</p>
    </div>
  );
};

export default BucketList;
