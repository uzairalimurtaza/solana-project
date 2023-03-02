import React from "react";
import { Box, Grid, Skeleton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PLayBtn from "../../../assets/images/Play.png";
import ProgressiveImage from "react-progressive-graceful-image";

const placeholder = (
  <Skeleton
    variant="rectangular"
    width={`100%`}
    sx={{ background: "#e8e8e8", borderRadius: "20px", minHeight: "10.8rem " }}
  />
);

const ThumbnailOne = ({ data }) => {
  const navigate = useNavigate();
  // console.log(data, 'dasttta')
  return (
    Object.keys(data).length > 0 && (
      <>
        <Box className="main_wrapper">
          {data.array.length > 0 &&
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              py={4}
              className="product_heading"
            >
              <p>{data.name ? data.name : "N/A"}</p>
              <button
                onClick={() => {
                  navigate(`/category/${data.category_id}`);
                }}
              >
                View more
              </button>
            </Box>
          }
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={{ xs: 2, md: 3 }}>
              {data.array.length > 0 &&
                data.array.map((videoData, index) => {
                  return (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={3}
                      // xl={3}
                      key={index}
                      className="products_wrapper"
                    >
                      <div style={{ height: "100%" }}>
                        <div
                          style={{ position: "relative" }}
                          className="mainImg"
                          onClick={() => navigate(`/video/${videoData._id}`)}
                        >
                          <ProgressiveImage
                            src={videoData.video_thumbnail}
                            placeholder=""
                          >
                            {(src, loading) => {
                              return loading ? (
                                placeholder
                              ) : (
                                <img
                                  style={{ width: "100%" }}
                                  className={`mainPic${loading ? " loading" : " loaded"
                                    }`}
                                  src={videoData.video_thumbnail}
                                  alt="sea beach"
                                />
                              );
                            }}
                            
                          </ProgressiveImage>
                          {/* <img
                              style={{ width: "100%" }}
                              src={videoData.video_thumbnail}
                              alt="sea beach"
                            /> */}
                          <img
                            src={PLayBtn}
                            alt=""
                            className="icon"
                            style={{ marginRight: "10px" }}
                          />
                          {
                            !videoData.public && Number(videoData.amount) > 0 &&
                            <p className="price">
                              {videoData.amount
                                ? `${videoData.amount} Sol`
                                : "N/A"}
                            </p>
                          }
                        </div>
                        <h4 style={{ paddingTop: "10px" }}>
                          {videoData.title ? videoData.title : "title"}
                        </h4>
                        <p
                          style={{ color: "grey" }}
                          onClick={() =>
                            navigate(`/channel/${videoData.channel_id}`)
                          }
                          className="author"
                        >
                          -
                          {videoData?.channel_info?.channel_name}
                        </p>
                      </div>
                    </Grid>
                  );
                })}
              {/* </Suspense> */}
            </Grid>
          </Box>
        </Box>
      </>
    )
  );
};

export default React.memo(ThumbnailOne);
