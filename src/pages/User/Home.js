import React, { useEffect, useState, lazy, Suspense } from "react";
import { Typography, Skeleton, Box, Grid, Container } from "@mui/material";
import Axios from "../../api/Axios.jsx";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Trending from "../../assets/images/Final Awards.jpg";
import { ErrorHandler } from "../../helper/ErrorHandler.jsx";
import SkeltonOne from "../../components/UserLayout/Home/SkeltonOne.jsx";
import Slider from "../../components/UserLayout/Home/Slider.jsx";
import ProgressiveImage from "react-progressive-graceful-image";
import { viewAllVideos, imgUrl, getChannels } from "../../api/Url.js";

const placeholder = (
  <Skeleton
    variant="rectangular"
    width={`100%`}
    sx={{ background: "#e8e8e8", borderRadius: "20px", minHeight: "10.8rem " }}
  />
);

const ThumbnailOne = lazy(() => import("../../components/UserLayout/Home/ThumbnailOne.jsx"))

const Home = () => {
  const navigate = useNavigate();
  const [recommened, setrecommened] = useState({});
  const [popular, setpopular] = useState({});
  const [kids, setkids] = useState({});
  const [reality, setReality] = useState({});
  const [relax, setRelax] = useState({});
  const [solanaGameshow, setSolanaGameshow] = useState({});
  const [education, setEducation] = useState({});
  const [comedy, setComedy] = useState({});
  const [loading, setloading] = useState(false);
  const [channels, setChannels] = useState([]);

  useEffect(() => {
    getData();
    getChannelsHome();
  }, []);

  const getChannelsHome = async () => {
    try {
      const data = {
        user_status: 2,
        skip: 0,
        limit: 6,
      };
      const response = await Axios.post(getChannels, data);
      if (response) {
        // console.log(response.data.data);
        setChannels(response.data.data);
      }
    } catch (error) {
      // console.log(error.response.data.user);
      setChannels([]);
    }
  };

  const getData = async () => {
    try {
      setloading(true);
      const response = await Axios.post(viewAllVideos, {});
      if (response.data.status) {
        let allVideoData = response.data.data;
        // console.log(allVideoData, 'dasda')
        setrecommened(allVideoData[0]);
        setpopular(allVideoData[1]);
        setkids(allVideoData[2]);
        setReality(allVideoData[3])
        setRelax(allVideoData[4])
        setEducation(allVideoData[5])
        setComedy(allVideoData[6])
        setRelax(allVideoData[4])
        setSolanaGameshow(allVideoData[7])
        setTimeout(() => {
          setloading(false);
        }, 500);
      }
    } catch (err) {
      ErrorHandler(err);
    }
  };

  return (
    <>
      <UserHomeStyled className="">
        <Box className="slider">
          <Slider />
        </Box>
        <section className="home_content">
          <Container maxWidth="xl">
            {loading ? (
              <SkeltonOne />
            ) : (
              Object.keys(recommened).length > 0 && (
                <ThumbnailOne data={recommened} />
              )
            )}
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  pt: 2,
                  mt: 2
                }}
              >
                <Typography variant="body" sx={{ color: "var(--green-color)", fontWeight: '700' }}>
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
              <Grid container sx={{ py: 3 }} spacing={{ xs: 2, md: 3 }}>
                {channels.map((item, index) => (
                  <Grid
                    key={index}
                    item
                    xs={12}
                    md={4}
                    onClick={() => navigate(`/channel/${item._id}`)}
                  >
                    <Box className="category_box">
                      <ProgressiveImage
                        src={item?.channel_logo}
                        placeholder=""
                      >
                        {(src, loading) => {
                          return loading ? (
                            placeholder
                          ) : (
                            <img
                              className="creator-img"
                              src={src}
                              alt="sea beach"
                            />
                          );
                        }}
                      </ProgressiveImage>
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
            {/* <Box>
              <img
                src={Trending}
                alt=""
                style={{
                  width: "100%",
                  maxHeight: "600px",
                  margin: "15px 0",
                }}
              />
            </Box> */}
            <Suspense fallback={<SkeltonOne />}>
              <ThumbnailOne data={popular} />
            </Suspense>
            <Suspense fallback={<SkeltonOne />}>
              <ThumbnailOne data={kids} />
            </Suspense>
            <Suspense fallback={<SkeltonOne />}>
              <ThumbnailOne data={reality} />
            </Suspense>
            <Suspense fallback={<SkeltonOne />}>
              <ThumbnailOne data={relax} />
            </Suspense>
            <Suspense fallback={<SkeltonOne />}>
              <ThumbnailOne data={education} />
            </Suspense>
            <Suspense fallback={<SkeltonOne />}>
              <ThumbnailOne data={comedy} />
            </Suspense>
            <Suspense fallback={<SkeltonOne />}>
              <ThumbnailOne data={solanaGameshow} />
            </Suspense>
          </Container>
        </section>
      </UserHomeStyled>
    </>
  );
};

export default React.memo(Home);

const UserHomeStyled = styled.section`
  .category_img {
    width: 100%;
    border-radius: 20px;
    height: 252px;
    /* height: 100%; */
    /* filter: brightness(0.7); */
    object-fit: cover;
  }
  .creator-img {
    width: 100%;
    border-radius: 20px;
    object-fit: cover;
    height:160px
  }
  .category_box {
    cursor: pointer;
  }
  .category_box:hover img {
    filter: brightness(0.4);
    transition: 0.5s;
  }
  .detail:hover {
    /* background: transparent; */
    opacity: 0.9;
    color: #666666;
  }
  @media (max-width: 900px) {
    .text {
      left: 1.5rem;
      bottom: 7px;

      a {
        font-size: 10px;
        padding: 7px 25px;
      }
      p {
        font-size: 10px;
      }
    }
  }
`;
