import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import DemoImage from "../../../assets/images/random.jpg";
import { imgUrl } from "../../../api/Url";
import { useNavigate } from "react-router-dom";
import VideocamIcon from "@mui/icons-material/Videocam";

const GridSix = ({ data }) => {
  const navigate = useNavigate();
  return (
    <>
      {Object.keys(data).length > 0 &&
        data.map((item, index) => {
          return (
              (index / 2) === 1 ? (
                <Grid
                  key={index}
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
                  <Box
                    sx={{
                      position: "relative",
                      height: "100%",
                      cursor: "pointer",
                    }}
                  >
                    <img
                      src={item?.category_image}
                      alt=""
                      className="category_img"
                    />

                    <Box
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
                </Grid>
              ) : (
                <Grid
                  key={index}
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
                  <Box
                    sx={{
                      position: "relative",
                      height: "100%",
                      cursor: "pointer",
                    }}
                  >
                    <img
                      src={item?.category_image}
                      alt=""
                      className="category_img"
                    />
                    <Box
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
                </Grid>
              )
          );
        })}
    </>
  );
};

export default React.memo(GridSix);
