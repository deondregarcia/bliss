import React from "react";
import "./UnauthorizedBucketListView.css";

const UnauthorizedBucketListView = ({
  permissionsType,
}: {
  permissionsType: string;
}) => {
  return (
    <div>
      <h1>{permissionsType}</h1>
    </div>
  );
};

export default UnauthorizedBucketListView;
