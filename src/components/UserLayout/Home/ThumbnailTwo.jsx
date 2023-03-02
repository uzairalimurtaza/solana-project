import React from "react";
import { Box, Grid, Skeleton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import ProgressiveImage from "react-progressive-graceful-image";

const placeholder = (
  <Skeleton
    variant="rectangular"
    width={`100%`}
    sx={{ background: "#e8e8e8", minHeight: "10rem " }}
  />
);

const ThumbnailTwo = ({ data }) => {
  const navigate = useNavigate();
  return (
    <>
      <ThumbnailStyled>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          py={4}
          className="products product_heading"
        >
          <p>{data.name ? data.name : "N/A"}</p>
          <button
            onClick={() => {
              navigate(`/category/${data.array[0].category_id}`);
            }}
          >
            View more
          </button>
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
          >
            {data.array.map((item, index) => {
              return (
                <Grid key={index} item xs={12} sm={6} md={3}>
                  <div onClick={() => navigate(`/video/${item._id}`)}>
                    <ProgressiveImage src={item.video_thumbnail} placeholder="">
                      {(src, loading) => {
                        return loading ? (
                          placeholder
                        ) : (
                          <img
                            className="thumbailTwo"
                            src={src}
                            alt=""
                            style={{ width: "100%", height: "159px" }}
                          />
                        );
                      }}
                    </ProgressiveImage>
                  </div>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </ThumbnailStyled>
    </>
  );
};

export default ThumbnailTwo;

const ThumbnailStyled = styled.section`
  .thumbailTwo:hover {
    filter: brightness(0.9);
    transition: 0.5s;
    transform: scale(0.9);
    cursor: pointer;
  }
`;
