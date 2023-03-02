import React from "react";
import styled from "styled-components";
import { Box, Grid, Skeleton } from "@mui/material";

const SkeltonOne = () => {
  return (
    <>
      <SkeltonStyled>
        <Box className="main_wrapper">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
            py={4}
            className="product_heading"
          >
            <p>Loading...</p>
            <button>View more</button>
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={{ xs: 2, md: 3 }}>
              {Array(4)
                .fill()
                .map((videoData, index) => {
                  return (
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={3}
                        key={index}
                        className="products_wrapper"
                      >
                        <div style={{ height: "100%" }}>
                          <div
                            style={{ position: "relative" }}
                            className="mainImg"
                          >
                            <Skeleton
                              variant="rectangular"
                              width={`100%`}
                              height={118}
                              sx={{ background: "#e8e8e8" }}
                              className="mainPic"
                            />
                          </div>
                          <h4 style={{ paddingTop: "10px" }}>
                            <Skeleton
                              variant="text"
                              sx={{ background: "#e8e8e8" }}
                              width={`100%`}
                            />
                          </h4>
                          <p>
                            <Skeleton
                              variant="text"
                              sx={{ background: "#e8e8e8" }}
                              width={`100%`}
                            />
                          </p>
                        </div>
                      </Grid>
                  );
                })}
            </Grid>
          </Box>
        </Box>
      </SkeltonStyled>
    </>
  );
};

export default React.memo(SkeltonOne);
const SkeltonStyled = styled.section``;
