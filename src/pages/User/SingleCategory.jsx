import React, { useEffect, useState } from "react";
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
import VideoSkelton from "../../components/UserLayout/Single Video/VideoSkelton";
import { viewCategory, viewAllCategory } from "../../api/Url";
import Axios from "../../api/Axios";
import { ErrorHandler } from "../../helper/ErrorHandler";
import { useParams } from "react-router-dom";
import ThumbnailOne from "../../components/UserLayout/Category/ThumbnailOne";
import Loader from "../../components/UserLayout/Category/Loader";
import InfiniteScroll from "react-infinite-scroll-component";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const SingleCategory = () => {
  const { id } = useParams();
  const [categoryVideo, setcategoryVideo] = useState([]);
  const [limit, setLimit] = useState(4);
  // skip like page number
  const [skip, setSkip] = useState(0);
  const [allCategory, setAllCategory] = useState([]);
  const [categoryInfo, setCategoryInfo] = useState({});
  const [hasMore, sethasMore] = useState(true);
  const [filterName, setFilterName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [filterLoader, setfilterLoader] = useState(false);
  const [categoryId, setCategoryId] = useState("");

  useEffect(() => {
    setCategoryId(id);
    getAllCategory();
    getCategoryData();
  }, []);
  useEffect(() => {
    setSkip(1);
  }, [filterLoader]);
  const getAllCategory = async () => {
    try {
      const response = await Axios.post(viewAllCategory, {});
      setAllCategory(response.data.data);
    } catch (e) {
      console.log(e);
    }
  };
  const getCategoryData = async (value) => {
    // setIsLoading(true);
    try {
      const data = {
        category_id: value ? value : id,
        skip: 0,
        limit: 4,
      };
      const response = await Axios.post(viewCategory, data);
      console.log(response.data,'dasdasd')
      setFilterName(response.data.data.category_name);
      setcategoryVideo(response.data.video_details);
      setCategoryInfo(response.data.data);
      setSkip(skip + 1);
      if (response.data.video_details.length === 0) {
        sethasMore(false);
      } else {
        sethasMore(true);
      }
      setfilterLoader(false);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      ErrorHandler(err);
      setfilterLoader(false);
      // setIsLoading(false);
    }
  };
  const handleChange = async (event) => {
    const {
      target: { value },
    } = event;
    setfilterLoader(true);
    setFilterName(value.val);
    getCategoryData(value.id);
    setCategoryId(value.id);
  };

  const fetchCategoryData = async () => {
    try {
      const data = {
        category_id: categoryId,
        skip: skip,
        limit: limit,
      };
      const response = await Axios.post(viewCategory, data);
      // setSkip(skip + 1);
      // setLimit(limit + 1);
      return response;
    } catch (e) {
      console.log(e);
    }
  };

  const scrollPaginationHandler = async () => {
    if (categoryVideo.length > 0) {
      const Data = await fetchCategoryData();
      if (Data.data.video_details.length === 0) {
        sethasMore(false);
        setIsLoading(false);
      } else {
        setcategoryVideo([...categoryVideo, ...Data.data.video_details]);
      }
      setSkip(skip + 1);
    }
  };

  return (
    <>
      <AllCategotyStyled>
        <Box sx={{ background: "#000", position: "relative" }}>
          <Box className="Mainshowcase">
            {Object.keys(categoryInfo).length > 0 && (
              <>
                {isLoading ? (
                  <VideoSkelton />
                ) : (
                  <img
                    src={categoryInfo.category_image}
                    alt=""
                    style={{
                      width: "100%",
                      minHeight: "70vh",
                      maxHeight: "70vh",
                    }}
                  />
                )}
                <Box className="content">
                  <Box>
                    <Typography variant="h3" sx={{ pb: 2 }}>
                      {categoryInfo?.category_name}
                    </Typography>
                    <Typography variant="body">
                      {categoryInfo?.description}
                    </Typography>
                  </Box>
                </Box>
              </>
            )}
          </Box>
          <Container maxWidth="xl">
            <Box sx={{ py: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                  variant="body"
                  sx={{ color: "var( --light-white)" }}
                >
                  Category :
                </Typography>
                <Select
                  // multiple
                  displayEmpty
                  value={filterName}
                  onChange={handleChange}
                  input={<OutlinedInput />}
                  renderValue={(selected) => {
                    if (selected.length === 0) {
                      return <p className="topLabel">Select Category</p>;
                    }
                    return selected;
                  }}
                  MenuProps={MenuProps}
                  inputProps={{ "aria-label": "Without label" }}
                  sx={{
                    border: "1px solid #000",
                    color: "var(--green-color)",
                    ml: 1,
                  }}
                >
                  <MenuItem disabled value="" name="">
                    <p>Select Category</p>
                  </MenuItem>
                  {allCategory.length > 0 &&
                    allCategory.map((option) => (
                      <MenuItem
                        key={option._id}
                        value={{
                          id: option._id,
                          val: option.category_name,
                        }}
                      >
                        {option.category_name}
                      </MenuItem>
                    ))}
                </Select>
              </Box>
            </Box>
            <InfiniteScroll
              dataLength={categoryVideo.length}
              next={scrollPaginationHandler}
              // style={{ display: "flex", flexDirection: "column-reverse" }} //To put endMessage and loader to the top.
              hasMore={hasMore}
              loader={<Loader />}
            >
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
            </InfiniteScroll>
          </Container>
        </Box>
      </AllCategotyStyled>
    </>
  );
};

export default SingleCategory;

const AllCategotyStyled = styled.section`
  background: #000;
  .css-14s5rfu-MuiFormLabel-root-MuiInputLabel-root {
    color: var(--green-color);
    &:hover {
    }
  }
  .MuiSvgIcon-fontSizeMedium {
    color: var(--green-color);
  }
  p {
    color: #fff;
  }
  .topLabel {
    color: var(--green-color);
  }
  .Mainshowcase {
    position: relative;
  }
  .content {
    position: absolute;
    bottom: 6rem;
    left: 50%;
    transform: translateX(-50%);
    color: #fff;
    div {
      max-width: 43rem;
      margin: auto;
      text-align: center;
    }
  }

  .MuiOutlinedInput-notchedOutline {
    outline: none !important;
    border: none !important;
  }
`;
