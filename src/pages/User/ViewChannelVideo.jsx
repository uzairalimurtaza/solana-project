import React from "react";
import ChannelVideo from "../../assets/images/channel.MP4";
const ViewChannelVideo = () => {
  return (
    <>
      <video loop autoplay="autoplay" muted style={{ width: "100%" }}>
        <source src={ChannelVideo} type="video/mp4" />
      </video>
    </>
  );
};

export default ViewChannelVideo;
