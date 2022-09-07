import React from "react";
import { useNavigate } from "react-router-dom";
import { BucketListType } from "../../types/content";
import "./BucketList.css";

const BucketList = ({ bucketList }: { bucketList: BucketListType }) => {
  const navigate = useNavigate();
  // const viewBucketList = () => {

  // }

  return (
    <div
      onClick={() => navigate(`../../bucket-list/${bucketList.id}`)}
      className="bucket-list-container"
    >
      <h1 className="bucket-list-title">{bucketList.title}</h1>
      <p className="bucket-list-text">Description: {bucketList.description}</p>
    </div>
  );
};

export default BucketList;
