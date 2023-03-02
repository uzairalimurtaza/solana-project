import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Axios from "../../api/Axios";
import Typography from "@mui/material/Typography";
import { Box, Grid, Container, CircularProgress } from "@mui/material";
import { viewAllCategory, getChannels } from "../../api/Url";
import GridThree from "../../components/UserLayout/Category/GridThree";
import { useNavigate } from "react-router-dom";
import DemoImage from "../../assets/images/Banner4.jpg";

const Categories = () => {
  const navigate = useNavigate();
  const [allCategory, setallCategory] = useState([]);
  const [channels, setChannels] = useState([]);
  const [loader, setloader] = useState(false);
  // console.log("cate", loader);
  useEffect(() => {
    getCategories();
    getContentCreators();
  }, []);

  const getContentCreators = async () => {
    try {
      const data = {
        user_status: 2,
        skip:0,
        limit:3,
      };
      const response = await Axios.post(getChannels, data);
      if (response) {
        // console.log(response.data.data);
        setChannels(response.data.data);
      }
    } catch (error) {
      console.log(error.response.data.user);
      // setContentCreators(error.response.data.user);
    }
  };

  const getCategories = async (page, list) => {
    setloader(true);
    try {
      // const data = {
      //   skip: page ? page : skip,
      //   limit: list ? list : limit,
      // };
      const response = await Axios.post(viewAllCategory, {});
      if (response) {
        // setTimeout(() => {
        setloader(false);
        // }, 500);
        let allData = response.data.data;
        let length = Math.floor(allData.length / 3);
        let remainder = allData.length % 3;
        // console.log(length, remainder);
        let allCatsArrays = [];
        for (let i = 0; i < length; i++) {
          let temp = [];
          let tempEle = i;
          if (i != 0) {
            tempEle = i * 3;
          }
          temp.push(allData[tempEle]);
          temp.push(allData[tempEle + 1]);
          temp.push(allData[tempEle + 2]);
          allCatsArrays.push(temp);
        }
        if (remainder > 0) {
          let tempArr2 = [];
          for (let i = remainder; i > 0; i--) {
            tempArr2.push(allData[allData.length - i]);
          }
          allCatsArrays.push(tempArr2);
        }

        setallCategory(allCatsArrays);
      }
    } catch (e) {
      console.log(e);
      // ErrorHandler(e);
    }
  };

  return (
    <>
      <CategoryStyled>
        <Container maxWidth="xl">
          {loader ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                py: 5,
                height: "53vh",
                alignItems: "center",
              }}
            >
              <CircularProgress color="secondary" />
            </Box>
          ) : (
            <Grid container spacing={2} sx={{ py: 5 }}>
              {channels.length === 0 ? (
                <Grid item xs={12} sx={{ py: 3 }}>
                  <Box
                    sx={{ position: "relative", height: "100%" }}
                    className="category_box"
                  >
                    <img src={DemoImage} alt="" className="category_img" />
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
                          fontWeight: "bold",
                        }}
                      >
                        Channels - Coming Soon
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ) : (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                      paddingLeft: "16px",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ color: "var(--green-color)", fontWeight: "bold" }}
                    >
                      Channels
                    </Typography>
                    <button
                      style={{
                        backgroundColor: "black",
                        color: "white",
                        border: "none",
                      }}
                      onClick={(e) => navigate(`/channels`)}
                    >
                      View more
                    </button>
                  </Box>
                  <Grid container sx={{ py: 3, paddingLeft: "16px" }}>
                    {channels.map((item,index) => (
                      <Grid
                        item
                        xs={12}
                        md={4}
                        sx={{
                          px: 1,
                        }}
                        key={index}
                        onClick={() => navigate(`/channel/${item._id}`)}
                      >
                        <Box className="category_box">
                          <img
                            src={item?.channel_logo}
                            alt=""
                            className="creator-img"
                          />
                          <Box>
                            <Typography
                              variant="subtitle2"
                              sx={{
                                color: "#fff",
                                textTransform: "uppercase",
                                fontWeight: "bold",
                                textAlign: "center",
                                mt: 1,
                              }}
                            >
                              {item?.channel_name}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </>
              )}
              <Grid item xs={12} sx={{ py: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#1EDA6B",
                    fontWeight: "bold",
                  }}
                >
                  Categories
                </Typography>
              </Grid>

              {allCategory.length > 0 &&
                allCategory.map((data, index) => {
                  let keyX = Math.random()
                  return (
                      <GridThree
                        key={keyX}
                        data={data}
                        counter={index}
                        setloader={setloader}
                      />
                  )
                })}
            </Grid>
          )}
        </Container>
      </CategoryStyled>
    </>
  );
};

export default Categories;

const CategoryStyled = styled.section`
  background: #000;
  .category_img {
    width: 100%;
    border-radius: 20px;
    height: 252px;
    object-fit: cover;
  }
  .creator-img {
    width: 100%;
    border-radius: 20px;
    height: 159px;
    object-fit: cover;
  }
  .category_box {
    cursor: pointer;
  }
  .category_box:hover img {
    filter: brightness(0.4);
    transition: 0.5s;
  }
`;
