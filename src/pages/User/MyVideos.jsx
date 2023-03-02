import React, { useState, useEffect, useContext, useRef } from "react";
import styled from "styled-components";
import {
  Container,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Button,
  Tab,
  Tabs,
  CircularProgress,
} from "@mui/material";
import PropTypes from "prop-types";
import { becomeContentCreator, myVideoDetail } from "../../api/Url.js";
import Axios from "../../api/Axios.jsx";
import BublleImg from "../../assets/images/bubble.png";
import user from "../../assets/images/uploadd.png";
import { ErrorHandler } from "../../helper/ErrorHandler";
import { toast } from "react-toastify";
import MainContext from "../../Context/MainContext.jsx";
import UploadVideo from "../../components/UserLayout/UploadVideo/UploadVideo";
import ConnectMessage from "../../components/UserLayout/Wallet/ConnectMessage";
import Swal from "sweetalert2";
import AllUserUploadVideos from "../../components/UserLayout/MyVideos/AllUserUploadVideos.jsx";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useFormik } from "formik";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import LikedVideos from "../../components/UserLayout/MyVideos/LikedVideos.jsx";
import RecentlyViewVideos from "../../components/UserLayout/MyVideos/RecentlyViewVideos";
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import { BsYoutube, BsTwitch, BsTwitter } from 'react-icons/bs';
import DialogActions from "@mui/material/DialogActions";
import * as yup from "yup";
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const MyVideos = () => {

  const vidRef = useRef(null);
  const { walletIsConnected } = useContext(MainContext);
  const [thumbnail, setThumbnail] = useState();
  const [header, setHeader] = useState();
  const [dialogueLoading, setDialogueLoading] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [headerUrl, setHeaderlUrl] = useState(null);
  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const mdScreen = useMediaQuery(theme.breakpoints.down("md"));
  // console.log({ mdScreen });
  const [loading, setLoading] = useState(false);
  const [videLayout, setVideLayout] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [duration, setDuration] = useState();
  const [value, setValue] = useState(0);
  const [myVideo, setmyVideo] = useState({});
  const [myUploadedVideos, setMyUploadedVideos] = useState({});
  const [open, setOpen] = React.useState(false);
  const [role,setRole] = useState('')
  const [skip, setSkip] = React.useState(0);

  useEffect(() => {
    // getData();
    if(localStorage.getItem('role') !== null || localStorage.getItem('role') !== undefined ){
      setRole(localStorage.getItem('role'))
    }
    if (walletIsConnected) {
      getmyVideo();
    }
  }, [walletIsConnected, videLayout]);

  const headers = {
    headers: {
      Authorization: localStorage.getItem("uToken"),
    },
  };

  const uploadFile = async ({ currentTarget: input }) => {
    if (input.files && input.files[0]) {
      validateImg(input);
    }
  };

  const validateImg = (input) => {
    var regex = new RegExp("([a-zA-Z0-9s_\\.-:])+(.jpg|.png|.jpeg)$");
    if (regex.test(input.value.toLowerCase())) {
      if (typeof input.files != "undefined") {
        var reader = new FileReader();
        reader.readAsDataURL(input.files[0]);
        reader.onload = function (e) {
          var image = new Image();
          image.src = e.target.result;
          image.onload = function () {
            var height = this.height;
            var width = this.width;
            console.log(width, height);
            if (height > 500 && width > 200) {
              const _url = URL.createObjectURL(input.files[0]);
              setThumbnailUrl(_url);
              setThumbnail(input.files[0]);
              return true;
            } else {
              toast("Upload a file of atleast 500*200");
              return false;
            }
          };
        };
      } else {
        toast("This browser does not support HTML5.");
        return false;
      }
    } else {
      toast("Please select a valid Image file.");
      return false;
    }
  };

  const uploadHeader = async ({ currentTarget: input }) => {
    if (input.files && input.files[0]) {
      const files = input.files[0];
      validateHeader(input);
    }
  };

  const validateHeader = (input) => {
    var regex = new RegExp("([a-zA-Z0-9s_\\.-:])+(.png|.jpg|.jpeg)$");
    if (regex.test(input.value.toLowerCase())) {
      if (typeof input.files != "undefined") {
        var reader = new FileReader();
        reader.readAsDataURL(input.files[0]);
        reader.onload = function (e) {
          var image = new Image();
          image.src = e.target.result;
          image.onload = function () {
            var height = this.height;
            var width = this.width;
            console.log(width, height);
            if (height > 500 && width > 200) {
              const _url = URL.createObjectURL(input.files[0]);
              setHeaderlUrl(_url);
              setHeader(input.files[0]);
              return true;
            } else {
              toast("Upload a file of atleast 500*200");
              return false;
            }
          };
        };
      } else {
        toast("This browser does not support HTML5.");
        return false;
      }
    } else {
      toast("Please select a valid Image file.");
      return false;
    }
  };

  const getmyVideo = async () => {
    try {
      setLoading(true);
      const response = await Axios.post(myVideoDetail, {}, headers);
      if (response.data.status) {
        setmyVideo(response.data);
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      ErrorHandler(err);
    }
  };

  const uploadFileHandler = ({ currentTarget: input }) => {
    if (walletIsConnected) {
      if (input.files && input.files[0]) {
        const files = input.files[0];
        console.log(files);
        if (files.type === "video/mp4") {
          const _url = URL.createObjectURL(files);
          var vid = document.createElement("video");
          vid.src = _url;
          vid.ondurationchange = function () {
            if (this.duration > 60 * 14) {
              return Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Your video not be longer than 14 mins !",
                showDenyButton: true,
                denyButtonText: "ok",
                showConfirmButton: false,
              });
            } else {
              setDuration(this.duration);
              setVideLayout(true);
              setVideoFile(files);
              setVideoUrl(_url);
            }
          };
        } else {
          return Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please just upload Mp4 format video",
            showDenyButton: true,
            denyButtonText: "ok",
            showConfirmButton: false,
          });
        }
        // console.log("helllllllllloooooooo");
        // console.log(`The video is ${vidRef.current.duration} seconds long.`);
      }
    } else {
      toast.error("Please first connect your wallet");
    }
  };
  // tab data
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClose = async () => {
    setOpen(false);
  };

  const validationSchema = yup.object({
    channel_name: yup.string().required("Required").min(3,"Channel Name Must be Greater than 3 Characters"),
    creator_name: yup.string().required("Required").min(3,"Creator Name Must be Greater than 3 Characters"),
    twitter_link: yup.string().required("Required"),
    twitch_link: yup.string().required("Required"),
    youtube_link: yup.string().required("Required"),
    candy_machine: yup.string().required("Required"),
    type: yup.string().required("Required")
  });

  const formik = useFormik({
    initialValues: {
      channel_name: "",
      creator_name: "",
      file: "",
      type: "",
      twitter_link: "",
      youtube_link: "",
      twitch_link: "",
      candy_machine: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (!thumbnail) {
        toast.error("Please select a thumbnail first", {
          toastId: 'FE7',
        });
      }
      else if (!header) {
        toast.error("Please select a header first", {
          toastId: 'FE8',
        });
      }
      else {
        setDialogueLoading(true);
        let data = new FormData();
        data.append("logo", thumbnail);
        data.append("header", header);
        data.append("channel_name", values.channel_name);
        data.append("channel_type", values.type);
        data.append("creator_name", values.creator_name);
        data.append("twitter_link", values.twitter_link);
        data.append("youtube_link", values.youtube_link);
        data.append("twitch_link", values.twitch_link);
        data.append("candy_machine_id", values.candy_machine);

        try {
          const config = {
            headers: {
              Authorization: localStorage.getItem("uToken"),
            },
          };
          var response = await Axios.post(becomeContentCreator, data, config);
          if (response) {
            setDialogueLoading(false);
          }
          if (response.data.status) {
            toast.success("Request Submitted", {
              toastId: 'FS6',
            });
            setmyVideo(response.data.data)
            setOpen(false);
          }
        } catch (e) {
          setDialogueLoading(false);
          console.log(e);
        }
      }
    },
  });

  return walletIsConnected ? (
    videLayout ? (
      <UploadVideo
        videoFile={videoFile}
        videoUrl={videoUrl}
        setVideLayout={setVideLayout}
        duration={duration}
        setVideoUrl={setVideoUrl}
      />
    ) : (
      <>
        <MyVideosStyled sm={smallScreen} $md={mdScreen}>
          <Box className="video_section">
            <img src={BublleImg} alt="" />
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
                    src={myVideo.profile_image ? myVideo.profile_image : user}
                    alt=""
                  />
                </Box>
                <Box sx={{ ml: 4 }}>
                  <Typography gutterBottom variant="h4" sx={{ color: "#fff" }}>
                    {myVideo.first_name && myVideo.first_name}{" "}
                    {myVideo.last_name && myVideo.last_name}
                  </Typography>
                  <Typography
                    variant="body2"
                    gutterBottom
                    sx={{ color: "#ffffff80" }}
                  >
                    {myVideo.email && myVideo.email}
                  </Typography>
                </Box>
              </Box>
              <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
              >
                <DialogTitle
                  sx={{
                    bgcolor: "#1EDA6B",
                    color: "white",
                  }}
                  id="responsive-dialog-title"
                >
                  {"Add Channel Details"}
                </DialogTitle>
                <DialogContent sx={{ py: 3 }}>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <form onSubmit={formik.handleSubmit}>
                      <TextField
                        fullWidth
                        name="channel_name"
                        label="Channel Name"
                        size="small"
                        value={formik.values.channel_name}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.channel_name && Boolean(formik.errors.channel_name)
                        }
                        helperText={formik.touched.channel_name && formik.errors.channel_name}
                        sx={{ my: 1 }}
                      />
                      <TextField
                        fullWidth
                        name="creator_name"
                        label="Creator Name"
                        size="small"
                        value={formik.values.creator_name}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.creator_name && Boolean(formik.errors.creator_name)
                        }
                        helperText={formik.touched.creator_name && formik.errors.creator_name}
                        sx={{ my: 1 }}
                      />
                      <TextField
                        fullWidth
                        name="candy_machine"
                        label="Candy Machine ID"
                        size="small"
                        value={formik.values.candy_machine}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.candy_machine && Boolean(formik.errors.candy_machine)
                        }
                        helperText={formik.touched.candy_machine && formik.errors.candy_machine}
                        sx={{ my: 1 }}
                      />
                      <FormControl fullWidth sx={{ my: 1 }}>
                        <InputLabel htmlFor="outlined-adornment-amount">Twitter</InputLabel>
                        <OutlinedInput
                          id="outlined-adornment-amount"
                          value={formik.values.twitter_link}
                          onChange={formik.handleChange('twitter_link')}
                          startAdornment={<InputAdornment position="start"><BsTwitter /></InputAdornment>}
                          error={
                            formik.touched.twitter_link && Boolean(formik.errors.twitter_link)
                          }
                          helperText={formik.touched.twitter_link && formik.errors.twitter_link}
                          label="Twitter"
                        />
                      </FormControl>
                      <FormControl fullWidth sx={{ my: 1 }}>
                        <InputLabel htmlFor="outlined-adornment-amount">Youtube</InputLabel>
                        <OutlinedInput
                          id="outlined-adornment-amount"
                          value={formik.values.youtube_link}
                          onChange={formik.handleChange('youtube_link')}
                          startAdornment={<InputAdornment position="start"><BsYoutube /></InputAdornment>}
                          error={
                            formik.touched.youtube_link && Boolean(formik.errors.youtube_link)
                          }
                          helperText={formik.touched.youtube_link && formik.errors.youtube_link}
                          label="Youtube"
                        />
                      </FormControl>
                      <FormControl fullWidth sx={{ my: 1 }}>
                        <InputLabel htmlFor="outlined-adornment-amount">Twitch</InputLabel>
                        <OutlinedInput
                          id="outlined-adornment-amount"
                          value={formik.values.twitch_link}
                          onChange={formik.handleChange('twitch_link')}
                          startAdornment={<InputAdornment position="start"><BsTwitch /></InputAdornment>}
                          error={
                            formik.touched.twitch_link && Boolean(formik.errors.twitch_link)
                          }
                          helperText={formik.touched.twitch_link && formik.errors.twitch_link}
                          label="Twitch"
                        />
                      </FormControl>
                      <FormControl sx={{ width: '250px' }}>
                        <InputLabel id="demo-simple-select-label">Type</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={formik.values.type}
                          label="Age"
                          onChange={formik.handleChange('type')}
                        >
                          <MenuItem value={'video'}>Video</MenuItem>
                          <MenuItem value={'music'}>Music</MenuItem>
                          <MenuItem value={'text'}>Text</MenuItem>
                        </Select>
                      </FormControl>
                      <Box sx={{ mt: 1 }}>
                        <p>Select Thumbnail</p>
                        <div>
                          {thumbnailUrl && (
                            <img
                              src={thumbnailUrl}
                              alt="thumnail"
                              style={{
                                marginBottom:"5px",
                                width: "165px",
                                height: "115px",
                                objectFit: "cover",
                              }}
                              name="file"
                            />
                          )}
                        </div>
                        <input
                          id="file-upload"
                          type="file"
                          onChange={uploadFile}
                        />
                      </Box>
                      <Box sx={{ mt: 1 }}>
                        <p>Select Header</p>
                        <div>
                          {headerUrl && (
                            <img
                              src={headerUrl}
                              alt="thumnail"
                              style={{
                                marginBottom:"5px",
                                width: "165px",
                                height: "115px",
                                objectFit: "cover",
                              }}
                              name="file"
                            />
                          )}
                        </div>
                        <input
                          id="file-upload"
                          type="file"
                          onChange={uploadHeader}
                        />
                      </Box>

                    </form>
                  </Box>
                </DialogContent>
                <DialogActions>
                  <Button
                    style={{
                      color: "red",
                    }}
                    onClick={handleClose}
                  >
                    Discard
                  </Button>

                  <LoadingButton
                    type="submit"
                    sx={{
                      bgcolor: "#B624F4",
                      border: "0px !important",
                      color: "white",
                      "&:hover": {
                        bgcolor: "#B624F4 !important",
                        color: "white !important",
                      }
                    }}
                    loading={dialogueLoading}
                    onClick={formik.handleSubmit}
                    variant="contained"
                  >
                    Submit
                  </LoadingButton>
                </DialogActions>
              </Dialog>
              <Box className="btnn">
                {myVideo.user_status && myVideo.user_status == 0 && role == 'user'  &&  (
                  <Button
                    variant="contained"
                    sx={{ background: "#fff3" }}
                    onClick={(e) => setOpen(true)}
                  // disabled={true}
                  >
                    Request a Channel
                  </Button>
                )}
                {myVideo.user_status && myVideo.user_status == 1 && (
                  <Button variant="contained" sx={{ background: "#fff3" }}>
                    Request Sent
                  </Button>
                )}
                {myVideo.user_status && myVideo.user_status == 3 && (
                  <Button variant="contained" sx={{ background: "#fff3" }}>
                    Rejected
                  </Button>
                )}
                {myVideo.user_status && myVideo.user_status == 2 && (
                  <>
                    <label
                      htmlFor="contained-button-file"
                      className="uploadBtn"
                    >
                      <input
                        id="contained-button-file"
                        type="file"
                        onChange={uploadFileHandler}
                        ref={vidRef}
                        accept="video/mp4,video/x-m4v,video/*"
                      />
                      <Button
                        variant="contained"
                        component="span"
                        sx={{ background: "#fff3" }}
                      >
                        Upload Video
                      </Button>
                    </label>
                  </>
                )}
              </Box>
            </Box>
          </Box>
          <Container maxWidth="xl">
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CircularProgress color="secondary" />
              </Box>
            ) : (
              <>
                <Box sx={{ borderBottom: 1, borderColor: "divider", pt: 5 }}>
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="basic tabs example"
                    sx={{ flexDirection: "column" }}
                  >
                    <Tab label="MY VIDEOS" />
                    <Tab label="LIKED VIDEOS" />
                    <Tab label="RECENTLY WATCHED" />
                  </Tabs>
                </Box>
                <TabPanel value={value} index={0} sx={{ width: "100%" }}>
                  <AllUserUploadVideos
                    setMyUploadedVideos={setMyUploadedVideos}
                    myUploadedVideos={myUploadedVideos}
                    setSkip={setSkip}
                    skip={skip}
                  />
                </TabPanel>
                <TabPanel value={value} index={1} sx={{ width: "100%" }}>
                  <LikedVideos />
                </TabPanel>
                <TabPanel value={value} index={2} sx={{ width: "100%" }}>
                  <RecentlyViewVideos />
                </TabPanel>
              </>
            )}
          </Container>
        </MyVideosStyled>
      </>
    )
  ) : (
    <>
      <MyVideosStyled>
        <ConnectMessage />
      </MyVideosStyled>
    </>
  );
};

export default MyVideos;

const MyVideosStyled = styled.section`
  /* tabs 
 */
  .btn {
    border: none !important;
    color: white !important;
  }
  .btn:hover {
    border: none !important;
    color: black !important;
  }
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
    background: var(--green-color) !important;
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
    /* display: flex; */
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
