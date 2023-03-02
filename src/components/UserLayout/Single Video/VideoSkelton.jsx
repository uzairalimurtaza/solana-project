import React from "react";
import Skeleton from "@mui/material/Skeleton";
const VideoSkelton = () => {
  return (
    <>
      <Skeleton
        variant="rectangular"
        sx={{ background: "lightgrey", minHeight: "65vh", width: "100%" }}
      />
    </>
  );
};

export default VideoSkelton;
