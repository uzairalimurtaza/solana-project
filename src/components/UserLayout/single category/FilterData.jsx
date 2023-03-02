import React, { useState, useEffect } from "react";
import Axios from "../../../api/Axios";
import styled from "styled-components";
import {
  Box,
  Container,
  Typography,
  Grid,
  MenuItem,
  Select,
  OutlinedInput,
  CircularProgress,
} from "@mui/material";
import { viewCategory, viewAllCategory } from "../../../api/Url";
import InfiniteScroll from "react-infinite-scroll-component";
import ScroolLoader from "../../UserLayout/Category/Loader";
import VideoSkelton from "../../UserLayout/Single Video/VideoSkelton";
import ThumbnailOne from "../../UserLayout/Category/ThumbnailOne";

const FilterData = ({ filterId, filterName }) => {
  useEffect(() => {
    setSkip(0);
    setcategoryVideo([]);
  }, []);
  const [categoryVideo, setcategoryVideo] = useState([]);
  // skip like page number
  const [skip, setSkip] = useState(0);
  const [hasMore, sethasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const fetchCategoryData = async () => {
    try {
      const data = {
        category_id: filterId,
        skip: skip,
        limit: 4,
      };
      const response = await Axios.post(viewCategory, data);
      // setSkip(skip + 1);
      return response;
    } catch (e) {
      console.log(e);
    }
  };

  const scroolPaginationHandler = async () => {
    console.log("Scrool Call");
    const Data = await fetchCategoryData();
    setcategoryVideo([...categoryVideo, ...Data.data.video_details]);
    if (Data.data.video_details.length === 0) {
      sethasMore(false);
    }
    setSkip(skip + 1);
  };
  return (
    <>
      <InfiniteScroll
        dataLength={categoryVideo.length}
        next={scroolPaginationHandler}
        // id="dffffffffffffffff"
        // style={{ display: "flex", flexDirection: "column-reverse" }} //To put endMessage and loader to the top.
        // inverse={true}
        // hasMore={categoryVideo.length !== totalResults}
        hasMore={hasMore}
        loader={<ScroolLoader />}
        // endMessage={<h4>End...</h4>}
        // scrollThreshold="400px"
      >
        <Box sx={{ background: "#000", position: "relative" }}>
          <Container maxWidth="xl">
            <Grid container spacing={2} sx={{ py: 5 }}>
              {isLoading ? (
                <>
                  <Grid
                    item
                    xs={12}
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
                  </Grid>
                </>
              ) : categoryVideo.length > 0 ? (
                categoryVideo.map((data, index) => (
                  <ThumbnailOne data={data} setIsLoading={setIsLoading} />
                ))
              ) : (
                <Grid
                  item
                  xs={12}
                  sx={{
                    color: "#fff",
                    display: "flex",
                    justifyContent: "center",
                    minHeight: "35vh",
                    alignItems: "center",
                    // background: "green",
                  }}
                >
                  <Box className="loader">
                    <h1 style={{ color: "#ffff" }}>No Data</h1>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Container>
        </Box>
      </InfiniteScroll>
    </>
  );
};
export default FilterData;
