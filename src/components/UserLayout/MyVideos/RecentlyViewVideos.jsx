import React, { useState, useEffect } from "react";
import ThumbnailOne from "../Category/ThumbnailOne";
import { recentlyViewVideo } from "../../../api/Url";
import Axios from "../../../api/Axios";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Grid, CircularProgress } from "@mui/material";

const RecentlyViewVideos = () => {
  const navigate = useNavigate();
  const headers = {
    headers: {
      Authorization: localStorage.getItem("uToken"),
    },
  };
  const [likeVideo, setLikeVideo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [responseStatus, setResponseStatus] = useState(false);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(4);
  console.log(likeVideo);
  useEffect(() => {
    getLikeVideo();
  }, []);
  const getLikeVideo = async () => {
    setLoading(true);
    setResponseStatus(true);
    try {
      const response = await Axios.post(
        recentlyViewVideo,
        {
          // skip,
          // limit,
        },
        headers
      );
      if (response) {
        setLikeVideo(response.data.data);
        setLoading(false);
        setResponseStatus(response.data.status);
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
      setResponseStatus(err.response.data.status);
    }
  };
  return (
    <>
      {loading ? (
        <Box
          sx={{
            color: "#fff",
            display: "flex",
            justifyContent: "center",
            minHeight: "35vh",
            alignItems: "center",
          }}
        >
          <Box className="loader">
            <CircularProgress color="secondary" />
          </Box>
        </Box>
      ) : (
        <Grid container spacing={2} sx={{ py: 5 }}>
          {likeVideo.length > 0 ? (
            likeVideo.map((data, index) => <ThumbnailOne data={data} />)
          ) : (
            <Box sx={{ background: "#000" }}>
              <Typography variant="h3" sx={{ color: "#fff" }}>
                No Data
              </Typography>
            </Box>
          )}
        </Grid>
      )}
    </>
  );
};

export default RecentlyViewVideos;
