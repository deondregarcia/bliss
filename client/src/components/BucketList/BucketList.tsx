import React from "react";
import { useNavigate } from "react-router-dom";
import { BucketListType } from "../../types/content";
import "./BucketList.css";

const BucketList = ({
  bucketList,
  setArrayObject,
  setEditMode,
}: {
  bucketList: BucketListType;
  setArrayObject: React.Dispatch<React.SetStateAction<BucketListType | null>>;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const navigate = useNavigate();

  const handleBucketListEdit = () => {
    setArrayObject(bucketList);
    setEditMode(true);
  };

  return (
    <div className="bucket-list-wrapper">
      <div onClick={handleBucketListEdit} className="bucket-list-edit-button">
        <h2>Edit</h2>
      </div>
      <div
        onClick={() => navigate(`../../bucket-list/${bucketList.id}`)}
        className="bucket-list-container"
      >
        <h1 className="bucket-list-title">{bucketList.title}</h1>
        <p className="bucket-list-text">
          Description: {bucketList.description}
        </p>
      </div>
    </div>
  );
};

export default BucketList;
