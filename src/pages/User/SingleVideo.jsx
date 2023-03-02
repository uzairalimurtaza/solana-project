import React, { useEffect, useState, useRef, useContext } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  Card,
  CardActions,
  CardContent,
  DialogTitle,
  DialogContentText,
  Grid,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import Axios from "../../api/Axios";
import {
  viewVideoDetail,
  likeVideo,
  dislikeVideo,
  subscribeToVideo,
  increaseViewCount,
} from "../../api/Url";
import { ErrorHandler } from "../../helper/ErrorHandler";
import PriceTag from "../../assets/images/Icon awesome-tags.png";
import styled from "styled-components";
import ThumbnailOne from "../../components/UserLayout/Category/ThumbnailOne";
import MainContext from "../../Context/MainContext";
import Swal from "sweetalert2";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import LoadingButton from "@mui/lab/LoadingButton";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { toast } from "react-toastify";
import { accessVideo } from "../../api/Url";
import {
  sendMoney,
  checkNFTToken,
} from "../../components/UserLayout/Wallet/Transactions.tsx";

const SingleVideo = () => {
  const navigate = useNavigate();
  const headers = {
    headers: {
      Authorization: localStorage.getItem("uToken"),
    },
  };

  const { walletIsConnected } = useContext(MainContext);
  const vidRef = useRef(null);
  const { id } = useParams();
  const [videoData, setvideoData] = useState({});
  const [recommendedVideos, setRecommendedVideos] = useState([]);
  const [channelVideos, setChannelVideos] = useState([]);
  const [loading, setloading] = useState(false);
  const [gainAccessLoader, setGainAccessLoader] = useState(false);
  const [watchNowLoader, setWatchNowLoader] = useState(false);
  const [likeStatus, setlikeStatus] = useState(true);
  const [disLikeStatus, setDisLikeStatus] = useState(true);
  const [open, setOpen] = React.useState(false);
  const [playVideo, setPlayVideo] = React.useState(false);
  const [likeLoader, setLikeLoader] = React.useState(false);
  const [controls, setControls] = React.useState(false);
  const [autoplay, setAutoplay] = React.useState(false);

  useEffect(() => {
    getSingleVideo();
    const token = localStorage.getItem("uToken");
    if (token !== undefined || token !== null) {
      if (!checkNFTToken()) {
        checkVideoAccess();
      }
    }
  }, [id, likeLoader]);

  const likeVideoHandler = async (idd) => {
    // setlikeStatus(false);
    // setDisLikeStatus(true);
    if (walletIsConnected) {
      setLikeLoader(true);
      try {
        const data = {
          video_id: idd,
        };
        const response = await Axios.post(likeVideo, data, headers);
        if (response) {
          setLikeLoader(false);
        }
      } catch (e) {
        setLikeLoader(false);
        console.log(e);
      }
    } else {
      toast.error("Please connect your wallet first before like any video", {
        toastId: 'LE2',
      });
    }
  };

  const disLikeVideoHandler = async (idd) => {
    if (walletIsConnected) {
      // setDisLikeStatus(false);
      // setlikeStatus(true);
      setLikeLoader(true);
      try {
        const data = {
          video_id: idd,
        };
        const response = await Axios.post(dislikeVideo, data, headers);
        if (response) {
          setLikeLoader(false);
        }
      } catch (e) {
        console.log(e);
        setLikeLoader(false);
      }
    } else {
      toast.error("Please connect your wallet first before dislike any video", {
        toastId: 'LE3',
      });
    }
  };

  const getSingleVideo = async () => {
    setloading(true);
    try {
      const response = await Axios.get(
        `${viewVideoDetail}/${id}`,
        walletIsConnected && headers
      );
      if (response) {
        console.log(response.data)
        setvideoData(response.data.video_details);
        setRecommendedVideos(response.data.recommended_videos);
        setChannelVideos(response.data.channel_videos);
        setlikeStatus(response.data.is_liked);
        setDisLikeStatus(response.data.is_disliked);
        setloading(false);
      }
    } catch (err) {
      ErrorHandler(err);
    }
  };

  const handleClose = async () => {
    setOpen(false);
  };

  const getProvider = () => {
    if ("solana" in window) {
      const anyWindow = window;
      const provider = anyWindow.solana;
      if (provider.isPhantom) {
        return provider;
      }
    }
    window.open("https://phantom.app/", "_blank");
  };

  const provider = getProvider();

  const createTransferTransactionTwoDay = async (id) => {
    sendMoney(1000000, subscribeToVideoTwoDays, id, setGainAccessLoader);
    setGainAccessLoader(true);
  };

  const subscribeToVideoMonthly = async (id) => {
    const headers = {
      headers: {
        Authorization: localStorage.getItem("uToken"),
      },
    };
    const data = {
      video_id: id,
      type: "monthly",
    };
    const response = await Axios.post(subscribeToVideo, data, headers);
    if (response.data.status) {
      setOpen(false);
      vidRef.current.play();
    }
  };

  const subscribeToVideoTwoDays = async (id) => {
    const data = {
      video_id: id,
      type: "two days",
    };
    const headers = {
      headers: {
        Authorization: localStorage.getItem("uToken"),
      },
    };
    const response = await Axios.post(subscribeToVideo, data, headers);
    console.log(response);
    if (response) {
      // setGainAccessLoader(false)
    }
    if (response.data.status) {
      setOpen(false);
      vidRef.current.play();
    }
  };

  const checkVideoAccess = () => {
    const headers = {
      headers: {
        Authorization: localStorage.getItem("uToken"),
      },
    };
    const data = {
      video_id: id,
    };
    Axios.post(accessVideo, data, headers)
      .then((res) => {
        if (res.data.status) {
          setPlayVideo(true);
          Axios.post(
            increaseViewCount,
            {
              video_id: id,
            },
            headers
          )
            .then((res) => {
              console.log(res.data);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        if (!err.response.data.status) {
          console.log("cannot play access");
          vidRef.current.pause();
          setOpen(true);
        }
      });
  };

  const checkVideoAccessOnClick = () => {
    const headers = {
      headers: {
        Authorization: localStorage.getItem("uToken"),
      },
    };

    console.log(provider.publicKey, "ll");
    const data = {
      video_id: id,
      id: provider.publicKey,
    };
    Axios.post(accessVideo, data, headers)
      .then((res) => {
        if (res.data.status) {
          console.log("can play access");
          setControls(true);

          Axios.post(
            increaseViewCount,
            {
              video_id: id,
            },
            headers
          )
            .then((res) => {
              console.log(res.data);
            })
            .catch((err) => {
              console.log(err);
            });

          setWatchNowLoader(false);

          return true;
        }
      })
      .catch((err) => {
        setWatchNowLoader(false);
        if (!err.response.data.status) {
          console.log("cannot play access");
          vidRef.current.pause();
          setControls(false);
          setOpen(true);
          return false;
        }
      });
  };

  const handlePlayVideo = async () => {
    if (walletIsConnected) {
      checkVideoAccessOnClick();
    }
    else {
      setWatchNowLoader(false);
      console.log("here3");
      Swal.fire({
        title: "Error!",
        text: "Please connect your wallet first before playing any video",
        icon: "error",
        confirmButtonText: "ok",
      });
      return;
    }
  };

  const handleWatchNow = async () => {
    setWatchNowLoader(true);
    handlePlayVideo();
  };

  return !loading && Object.keys(videoData).length > 0 ? (
    <>
      <SingleVideoStyled>
        <Dialog
          className="dialogue"
          open={open}
          onClose={(_, reason) => {
            if (reason !== "backdropClick") {
              handleClose();
            }
          }}
          disableEscapeKeyDown={true}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">
            {"Access Denied"}
          </DialogTitle>
          <DialogContent sx={{ py: 3, width: "350px" }}>
            <DialogContentText id="alert-dialog-description">
              Wanna watch this video ?
            </DialogContentText>
            <Card
              sx={{ minWidth: 275, mt: 1, bgcolor: "#1EDA6B", color: "white" }}
            >
              <CardContent>
                <Typography
                  sx={{ fontSize: 14 }}
                  color="text.secondary"
                  gutterBottom
                >
                  You Must Hold a SolanaTv NFT
                </Typography>
                <Typography variant="h5" component="div">
                  HODL
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  A SolanaTv NFT will grant you 100% free access to all content
                  and channels on the platform forever.
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  sx={{ color: "white" }}
                  // disabled={true}
                  // onClick={(e) => {
                  //   createTransferTransactionMonthly(id);
                  // }}
                  size="small"
                >
                  Magic Eden Link Coming Soon
                </Button>
              </CardActions>
            </Card>
            <Card
              sx={{ minWidth: 275, mt: 1, bgcolor: "#B624F4", color: "white" }}
            >
              <CardContent>
                <Typography
                  sx={{ fontSize: 14 }}
                  color="text.secondary"
                  gutterBottom
                >
                  Gain Video Access
                </Typography>
                <Typography variant="h5" component="div">
                  48hrs
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  Temporary
                </Typography>
              </CardContent>
              <CardActions>
                <LoadingButton
                  loading={gainAccessLoader}
                  sx={{ color: "white" }}
                  onClick={(e) => {
                    createTransferTransactionTwoDay(id);
                  }}
                  size="small"
                >
                  Gain Access
                </LoadingButton>
              </CardActions>
            </Card>
          </DialogContent>
          <DialogActions>
            <Button
              style={{
                color: "red",
              }}
              className="delete-btn"
              onClick={() => setOpen(false)}
            >
              CANCEL
            </Button>
          </DialogActions>
        </Dialog>
        <Box
          sx={{
            background: "#000",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* <ReactPlayer controls={true} muted={true} playing={true} onPlay={handlePlayVideo} url={`${videoData.video_url}`} /> */}
          <video
            autoplay={false}
            controls={controls}
            id="vid"
            controlsList="nodownload"
            poster={videoData.video_thumbnail}
            ref={vidRef}
            onPlay={handlePlayVideo}
          >
            <source type="video/mp4" src={`${videoData.video_url}`}></source>
          </video>
        </Box>
        <Container maxWidth="xl">
          <Box sx={{ py: 2 }}>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  color: "#fff",
                  textAlign: "center",
                  // py: 1,
                }}
              >
                {videoData?.title}
              </Typography>
              <Box
                sx={{
                  maxWidth: "62vw",
                  margin: "auto",
                  textAlign: "center",
                  // py: 1,
                }}
              >
                <Typography
                  variant="body"
                  sx={{
                    color: "#ffffffcc",
                    textAlign: "center",
                  }}
                >
                  {videoData?.description}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center", py: 1 }}>
                <LoadingButton
                  variant="contained"
                  loading={watchNowLoader}
                  onClick={handleWatchNow}
                  sx={{ background: "var(--green-color)" }}
                >
                  Watch Now
                </LoadingButton>
              </Box>
              <Box
                sx={{
                  background: "var(--purple-color)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "124px",
                  margin: "auto",
                  py: 1,
                  my: 1,
                  borderRadius: "4px",
                }}
              >
                <img src={PriceTag} alt="" className="priceTag" />
                <Typography
                  variant="body"
                  sx={{
                    color: "#fff",
                  }}
                >
                  {`${videoData.amount ? videoData.amount : "N/A"} SOL`}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center", pt: 1 }}>
                <Box sx={{ textAlign: "center" }}>
                  <h6 style={{ color: "var(--green-color)" }}>Views</h6>
                  <Box>
                    <Box>
                      <RemoveRedEyeOutlinedIcon
                        style={{ color: "var(--green-color)" }}
                      />
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "var(--green-color)",
                        textAlign: "center",
                        py: 1,
                      }}
                    >
                      <span>{videoData?.views_count}</span>
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ textAlign: "center", pl: 3 }}>
                  <h6 style={{ color: "var(--green-color)" }}>Likes </h6>
                  <Box>
                    <Box>
                      <Box
                        onClick={(e) => {
                          likeVideoHandler(videoData._id);
                        }}
                      >
                        {likeStatus && (
                          <ThumbUpAltIcon
                            sx={{
                              color: "var(--green-color)",
                              cursor: "pointer",
                            }}
                          />
                        )}
                      </Box>
                      <Box
                        onClick={(e) => {
                          // setlikeStatus(true);
                          likeVideoHandler(videoData._id);
                        }}
                      >
                        {!likeStatus && (
                          <ThumbUpOffAltIcon
                            sx={{
                              color: "var(--green-color)",
                              cursor: "pointer",
                            }}
                          />
                        )}
                      </Box>
                    </Box>
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          color: "var(--green-color)",
                          textAlign: "center",
                          py: 1,
                        }}
                      >
                        <span>{videoData?.likes_count}</span>
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ textAlign: "center", pl: 3 }}>
                  <h6 style={{ color: "var(--green-color)" }}>Dislikes</h6>
                  <Box
                    onClick={(e) => {
                      disLikeVideoHandler(videoData._id);
                    }}
                  >
                    {disLikeStatus && (
                      <ThumbDownIcon
                        sx={{
                          color: "var(--green-color)",
                          cursor: "pointer",
                        }}
                      />
                    )}
                  </Box>
                  <Box
                    onClick={(e) => {
                      disLikeVideoHandler(videoData._id);
                    }}
                  >
                    {!disLikeStatus && (
                      <ThumbDownOffAltIcon
                        sx={{
                          color: "var(--green-color)",
                          cursor: "pointer",
                        }}
                      />
                    )}
                  </Box>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "var(--green-color)",
                        textAlign: "center",
                        py: 1,
                      }}
                    >
                      <span>{videoData?.dislikes_count}</span>
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>

          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              className="product_heading"
            >
              <p>Channel Videos</p>
              <button
                onClick={() => {
                  navigate(`/channel/${channelVideos[0]._id}`);
                }}
              >
                View more
              </button>
            </Box>
            <Grid container spacing={2} sx={{ py: 2 }}>
              {channelVideos.length > 0 &&
                channelVideos.map((data, index) => <ThumbnailOne data={data} />)}
            </Grid>
          </Box>
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              className="product_heading"
            >
              <p>Recommended Videos</p>
            </Box>
            <Grid container spacing={2} sx={{ py: 2 }}>
              {recommendedVideos.length > 0 &&
                recommendedVideos.map((data, index) => (
                  <ThumbnailOne data={data} />
                ))}
            </Grid>
          </Box>
        </Container>
      </SingleVideoStyled>
    </>
  ) : (
    <Box sx={{ display: "flex", justifyContent: "center", paddingTop: "50px" }}>
      <CircularProgress color="secondary" />
    </Box>
  );
};
export default SingleVideo;

const SingleVideoStyled = styled.section`
  background: #000;
  video {
    max-height: 65vh;
  }
  .priceTag {
    margin-right: 15px;
    width: 100%;
    max-width: 15px;
  }
  .dialogue-content {
    width: 350px;
  }
  @media (max-width: 900px) {
    video {
      max-height: 100%;
    }
  }
`;
