import React, { useState, useEffect, useContext } from "react";
import { singleChannelVideos } from "../../api/Url";
import Axios from "../../api/Axios";
import styled from "styled-components";
import ThumbnailOne from "../../components/UserLayout/Category/ThumbnailOne";
import NullImage from "../../assets/images/uploadd.png";
import {
  Container,
  Box,
  Grid,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";

const SingleChannel = () => {
  // const {} = useContext(MainContext);
  const { id } = useParams();
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [responseStatus, setResponseStatus] = useState(false);
  const [channelName,setChannelName] = useState('')
  const [profileImg, setProfileImg] = useState('');
  const [bannerImg, setBannerImg] = useState('');

  useEffect(() => {
    getChannelDetails();
  }, []);

  const getChannelDetails = async () => {
    setResponseStatus(true);
    setIsLoading(true);
    try {
      const data = {
        channel_id: id,
      };
      const response = await Axios.post(singleChannelVideos, data);
      if (response) {
        console.log(response.data, 'dawda')
        setVideos(response.data.data);
        setResponseStatus(response.data.status);
        setChannelName(response.data.channel_details.channel_name)
        setBannerImg(response.data.channel_details.channel_header);
        setProfileImg(response.data.channel_details.channel_logo);
        setIsLoading(false);
      }
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  };

  return isLoading ? (
    <>
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
    </>
  ) : (
    <AuthorVideoStyled>
      <>
          <Box className="video_section">
            {
              <>
                <img className="banner-img" src={bannerImg} alt="" />
                <div className="overlay"></div>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: "center",
                  }}
                  className="content"
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      flexDirection: { xs: "column", sm: "row" },
                    }}
                  >
                    <Box>
                      <img
                        src={
                          profileImg || NullImage
                        }
                        alt=""
                      />
                    </Box>
                    <Box sx={{ ml: 4 }}>
                      <Typography gutterBottom variant="h4" sx={{ color: "#fff" }}>
                        {`${channelName}`}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </>
            }

          </Box>
        {
          videos.length === 0 ? (
            <>
              <Grid
                item
                xs={12}
                sx={{
                  color: "#fff",
                  display: "flex",
                  justifyContent: "center",
                  minHeight: "55vh",
                  alignItems: "center",
                  // background: "green",
                }}
              >
                <Box className="loader">
                  <h1 style={{ color: "#ffff" }}>No Data</h1>
                </Box>
              </Grid>
            </>
          ) :
            <Container maxWidth="xl">
              <Grid container spacing={2} sx={{ py: 5 }}>
                {videos.length > 0 &&
                  videos.map((item) => <ThumbnailOne data={item} />)}
              </Grid>
            </Container>
        }
      </>
    </AuthorVideoStyled>
  );
};

export default SingleChannel;

const AuthorVideoStyled = styled.section`
  .css-1l4ezco-MuiButtonBase-root-MuiTab-root {
    color: #fff;
  }
  .MuiTab-root {
    color: #fff !important;
  }
  .Mui-selected {
    color: var(--green-color) !important;
  }
  .MuiTabs-indicator {
    background: var(--green-color);
  }
  .banner-img {
    width:100%
  }
  /* tabs end  */
  .btnn button:hover {
    opacity: 0.7;
    background: #fff3;
    transition: 0.5s;
  }
  background: #000;
  /* video background */
  .video_section {
    position: relative;
    min-height:25vh;
  }

  .uploadBtn {
    input {
      display: none;
    }
  }
  video,
  img {
    width: 100%;
    max-height: 30vh;
    object-fit: cover;
  }

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, transparent, #000);
  }
  .content {
    position: absolute;
    width: 89%;
    left: ${(props) => (props.sm ? "0" : "1.7rem")};
    text-align: ${(props) => (props.sm ? "center" : "initial")};
    bottom: 10px;
    img {
      border-radius: 50%;
      width: ${(props) => (props.sm ? "70px" : "146px")};
      height: ${(props) => (props.sm ? "70px" : "146px")};
      object-fit: cover;
    }
  }

  /* video end  */
  h4 {
    color: #ffff;
  }
  .mainImg {
    .mainPic {
      width: 100%;
      height: 100%;
      /* min-height: 10.8rem; */
      // max-height: 15rem;
      object-fit: cover;
      border-radius: 20px;
      transition: 0.2s;
    }
    &:hover .mainPic {
      border-bottom: 4px solid var(--green-color);
    }
    &:hover .play_btn_icon {
      opacity: 1;
    }
  }
  /* play video btn  */
  .play_btn_icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    max-width: 100px;
    opacity: 0;
  }
  /* price tag  */
  .tag {
    color: #fff;
    position: absolute;
    left: 0;
    top: 0;
    background: var(--green-color);
    padding: 5px 20px;
    border-radius: 20px 0px;
    text-transform: uppercase;
  }
  .video_detail {
    .icons_container {
      padding-right: 20px;
      display: flex;
      align-items: center;
    }
    p {
      font-size: 14px;
    }
    svg {
      margin-right: 5px;
      color: var(--green-color);
      font-size: 16px;
    }
  }

  @media (max-width: 900px) {
    .content {
      position: relative;
      width: 100%;
      padding: 10px 30px;
    }
  }
  @media (max-width: 480px) {
    .MuiTabs-indicator {
      display: none;
    }
    .MuiTabs-flexContainer {
      flex-direction: column;
      align-items: center;
    }
  }
`;
