import React from "react";
import { Box, Grid, Typography, Skeleton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import VideocamIcon from "@mui/icons-material/Videocam";
import ProgressiveImage from "react-progressive-graceful-image";
import styled from "styled-components";

const placeholder = (
  <Skeleton
    variant="rectangular"
    width={`100%`}
    sx={{ background: "#e8e8e8", borderRadius: "20px", height: "252px" }}
  />
);

const GridSix = ({ data, counter }) => {
  
  const navigate = useNavigate();
  for (let i = 0; i < data.length; i++) {
    if (counter % 2 === 0) {
      if (i === 0) {
        data[i].col_val = 6;
      } else {
        data[i].col_val = 3;
      }
    } else {
      if (i === data.length - 1) {
        data[i].col_val = 6;
      } else {
        data[i].col_val = 3;
      }
    }
  }

  return (
    <>
      {Object.keys(data).length > 0 &&
        data.map((item) => {
          return (
            <>
              {item.col_val === 6 ? (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={6}
                  sx={{ py: 3 }}
                  onClick={(e) => {
                    navigate(`/category/${item._id}`);
                  }}
                >
                  <CategoryGrid>
                    <Box
                      className="category_box"
                      sx={{
                        position: "relative",
                        height: "100%",
                        cursor: "pointer",
                      }}
                    >
                      <ProgressiveImage
                        src={item.category_image}
                        placeholder=""
                      >
                        {(src, loading) => {
                          return loading ? (
                            placeholder
                          ) : (
                            <img
                              style={{ width: "100%" }}
                              className={`category_img`}
                              src={src}
                              alt="sea beach"
                            />
                          );
                        }}
                      </ProgressiveImage>
                      <Box
                        className="video_count"
                        sx={{
                          position: "absolute",
                          bottom: "7px",
                          transform: "translateX(-50%) ",
                          left: "50%",
                          display: "flex",
                          alignItems: "center",
                          flexDirection: "column",
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{
                            color: "#fff",
                            textTransform: "uppercase",
                          }}
                        >
                          {item.category_name}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              color: "#1EDA6B",
                              textTransform: "uppercase",
                            }}
                          >
                            {item.videocount}
                          </Typography>
                          <VideocamIcon
                            sx={{
                              fontSize: "16px",
                              marginLeft: "5px",
                              color: "#B624F4",
                            }}
                          />
                        </Box>
                      </Box>
                    </Box>
                  </CategoryGrid>
                </Grid>
              ) : (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  sx={{ py: 3 }}
                  onClick={(e) => {
                    navigate(`/category/${item._id}`);
                  }}
                >
                  <CategoryGrid>
                    <Box
                      className="category_box"
                      sx={{
                        position: "relative",
                        height: "100%",
                        cursor: "pointer",
                      }}
                    >
                      <ProgressiveImage
                        src={item.category_image}
                        placeholder=""
                      >
                        {(src, loading) => {
                          return loading ? (
                            placeholder
                          ) : (
                            <img
                              style={{ width: "100%" }}
                              className={`category_img`}
                              src={src}
                              alt="sea beach"
                            />
                          );
                        }}
                      </ProgressiveImage>
                      <Box
                        className="video_count"
                        sx={{
                          position: "absolute",
                          bottom: "7px",
                          transform: "translateX(-50%) ",
                          left: "50%",
                          display: "flex",
                          alignItems: "center",
                          flexDirection: "column",
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{
                            color: "#fff",
                            textTransform: "uppercase",
                          }}
                        >
                          {item.category_name}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              color: "#1EDA6B",
                              textTransform: "uppercase",
                            }}
                          >
                            {item.videocount}
                          </Typography>
                          <VideocamIcon
                            sx={{
                              fontSize: "16px",
                              marginLeft: "5px",
                              color: "#B624F4",
                            }}
                          />
                        </Box>
                      </Box>
                    </Box>
                  </CategoryGrid>
                </Grid>
              )}
            </>
          );
        })}
    </>
  );
};

export default React.memo(GridSix);

const CategoryGrid = styled.section`
  .category_box {
    transition: 0.5s;
    &:hover img {
      filter: brightness(0.8);
    }
    &:hover .video_count {
      transition: 0.5s;
      bottom: 30px;
    }
  }
`;
