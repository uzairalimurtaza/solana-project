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

  React.useEffect(() => {
    // console.log(data, 'thumb daat')
  }, [])
  const navigate = useNavigate();
  return (
    Object.keys(data).length > 0 && (
      <>
        <Grid item xs={12} sm={6} md={3} className="products_wrapper">
          <div style={{ height: "100%" }}>
            <div
              style={{ position: "relative" }}
              className="mainImg"
              onClick={() => navigate(`/video/${data._id}`)}
            >
              <ProgressiveImage src={data.video_thumbnail} placeholder="">
                {(src, loading) => {
                  return loading ? (
                    placeholder
                  ) : (
                    <img
                      style={{ width: "100%" }}
                      className={`mainPic${loading ? " loading" : " loaded"}`}
                      src={src}
                      alt="sea beach"
                    />
                  );
                }}
              </ProgressiveImage>
              <img
                src={PLayBtn}
                alt=""
                className="icon"
                style={{ marginRight: "10px" }}
              />
              {
                !data.public && Number(data.amount) >0 &&
                <p className="price">
                  {data.amount ? `${data.amount}         Sol` : "N/A"}
                </p>
              }
            </div>
            <h4>{data?.title}</h4>
            <Box onClick={() => navigate(`/channel/${data?.channel_info?._id}`)}>
              <p style={{ color: "grey" }} className="author">
                -
                {data?.channel_info?.channel_name}
              </p>
            </Box>
          </div>
        </Grid>
      </>
    )
  );
};

export default React.memo(ThumbnailOne);
