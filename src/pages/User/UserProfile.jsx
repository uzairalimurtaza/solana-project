import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Box,
  Typography,
  Grid,
  Button,
  TextField,
  IconButton,
  CircularProgress,
} from "@mui/material";
import NullImage from "../../assets/images/uploadd.png";
import EditIcon from "@mui/icons-material/Edit";
import styled from "styled-components";
import { useFormik } from "formik";
import Axios from "../../api/Axios";
import * as yup from "yup";
import { ReactComponent as WalletIcon } from "../../assets/images/Icon awesome-wallet.svg";
import { viewUserDetail, editUserDetail, editContentCreator } from "../../api/Url";
import { ErrorHandler } from "../../helper/ErrorHandler";
import MainContext from "../../Context/MainContext";
import ConnectMessage from "../../components/UserLayout/Wallet/ConnectMessage";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { toast } from "react-toastify";

const UserProfile = () => {
  const header = {
    headers: {
      Authorization: localStorage.getItem("uToken"),
    },
  };
  const { walletIsConnected, setIsProfileUpdated, isProfileUpdated } =
    useContext(MainContext);

  const [username, setUsername] = useState('')
  const [userBio, setUserBio] = useState('')
  const [profileImage, setprofileImage] = useState("");
  const [walletAdress, setWalletAdress] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [thumbnailUrlChannel, setThumbnailUrlChannel] = useState("");
  const [thumbnailChannel, setThumbnailChannel] = useState(null);
  const [headerUrlChannel, setHeaderUrlChannel] = useState("");
  const [headerChannel, setHeaderChannel] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [channelName, setChannelName] = useState('')
  const [status, setStatus] = useState(0)
  const [twitterLink, setTwitterLink] = useState('')
  const [facebookLink, setFacebookLink] = useState('')
  const [instagramLink, setInstagramLink] = useState('')
  const [creatorName, setCreatorName] = useState('')
  const [twitterLinkChannel, setTwitterLinkChannel] = useState('')
  const [youtubeLinkChannel, setYoutubeLinkChannel] = useState('')
  const [twitchLinkChannel, setTwitchLinkChannel] = useState('')
  const [channelType, setChannelType] = useState('')
  const [channelLoader, setChannelLoader] = useState(false)
  const [candymachineId, setCandymachineId] = useState('')
  const [role,setRole] = useState()

  useEffect(() => {
    if (walletIsConnected) {
      getProfile();
    }
  }, [walletIsConnected, isProfileUpdated]);

  const getProfile = async () => {
    try {
      const header = {
        headers: {
          Authorization: localStorage.getItem("uToken"),
        },
      };
      const response = await Axios.post(viewUserDetail, {}, header);
      if (response) {
        console.log(response.data, 'dad')
        // console.log(response.data.channel_detail, 'dadad')
        setUsername(response.data.user_name || '')
        setUserBio(response.data.user_bio || '')
        setRole(response.data.role)
        setprofileImage(response.data.profile_image);
        setWalletAdress(response.data.walletAdress);
        setStatus(response.data.user_status)
        setTwitterLink(response.data.twitter_link)
        setFacebookLink(response.data.facebook_link)
        setInstagramLink(response.data.instagram_link)
        setTwitterLinkChannel(response.data.channel_detail.twitter_link)
        setYoutubeLinkChannel(response.data.channel_detail.youtube_link)
        setTwitchLinkChannel(response.data.channel_detail.twitch_link)
        setThumbnailUrlChannel(response.data.channel_banner)
        setChannelName(response.data.channel_detail.channel_name)
        setCreatorName(response.data.channel_detail.creator_name)
        setChannelType(response.data.channel_detail.channel_type)
        setHeaderUrlChannel(response.data.channel_detail.channel_header);
        setThumbnailUrlChannel(response.data.channel_detail.channel_logo)
        setCandymachineId(response.data.channel_detail.nft_collection_id.candy_machine_id)
      }
    } catch (err) {
      ErrorHandler(err);
    }
  };
  // console.log(thumbnail);
  const ProfileImageHandler = ({ currentTarget: input }) => {
    if (input.files && input.files[0]) {
      const files = input.files[0];
      const _url = URL.createObjectURL(files);
      setThumbnailUrl(_url);
      setThumbnail(files);
    }
  };

  const validationSchema = yup.object({
    user_name: yup.string().required("username Required"),
  });

  const formik = useFormik({
    initialValues: {
      user_name: username,
      user_bio: userBio,
      twitter_link: twitterLink,
      facebook_link: facebookLink,
      instagram_link: instagramLink,
    },
    // validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        setIsProfileUpdated(true);
        var formData = new FormData();
        formData.append("user_name", values.user_name);
        formData.append("user_bio", values.user_bio);
        formData.append(`image`, thumbnail);
        formData.append(`twitter_link`, values.twitter_link);
        formData.append(`facebook_link`, values.facebook_link);
        formData.append(`instagram_link`, values.instagram_link);
        // formData.append(`files`, Thumbnail);
        var response = await Axios.post(editUserDetail, formData, header);
        setIsLoading(false);
        setIsProfileUpdated(false);
        if (response.data) {
          window.location.reload();
        }
      } catch (e) {
        ErrorHandler(e);
        setIsLoading(false);
      }
    },
  });

  const uploadFile = async ({ currentTarget: input }) => {
    if (input.files && input.files[0]) {
      validateImg(input)
    }
  };

  const validateImg = (input) => {
    var regex = new RegExp("([a-zA-Z0-9\s_\\.\-:])+(.jpg|.png|.jpeg)$");
    if (regex.test(input.value.toLowerCase())) {
      if (typeof (input.files) != "undefined") {
        var reader = new FileReader();
        reader.readAsDataURL(input.files[0]);
        reader.onload = function (e) {
          var image = new Image();
          image.src = e.target.result;
          image.onload = function () {
            var height = this.height;
            var width = this.width;
            console.log(width, height)
            if (height > 500 || width > 200) {
              const _url = URL.createObjectURL(input.files[0]);
              setThumbnailUrlChannel(_url);
              setThumbnailChannel(input.files[0]);
              return true;
            } else {
              toast("Atleast Upload a 500*200 size photo");
              return false;
            }
          };
        }
      } else {
        toast("This browser does not support HTML5.");
        return false;
      }
    } else {
      toast("Please select a valid Image file.");
      return false;
    }
  }

  const formikChannel = useFormik({
    initialValues: {
      channel_name: channelName,
      creator_name: creatorName,
      twitter_link_channel: twitterLinkChannel,
      youtube_link_channel: youtubeLinkChannel,
      twitch_link_channel: twitchLinkChannel,
      type: channelType
    },
    // validationSchema: validationSchemaChannel,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setChannelLoader(true)
      let data = new FormData()
      data.append('channel_name', channelName)
      data.append('channel_type', channelType)
      data.append('creator_name', creatorName)
      data.append('twitter_link', twitterLinkChannel)
      data.append('youtube_link', youtubeLinkChannel)
      data.append('twitch_link', twitchLinkChannel)
      data.append('candy_machine_id',candymachineId)
      data.append('type', values.type)
      if (thumbnailChannel != null) {
        data.append("logo", thumbnailChannel);
      }
      if (headerChannel != null) {
        data.append("header", headerChannel);
      }
      try {
        const config = {
          headers: {
            Authorization: localStorage.getItem("uToken"),
          },
        };
        var response = await Axios.post(editContentCreator, data, config);
        if (response) {
          setChannelLoader(false)
          toast.success('Channel Updated Successfully')
        }
      } catch (e) {
        console.log(e);
        setChannelLoader(false)
      }
    },
  });

  const uploadHeader = async ({ currentTarget: input }) => {
    if (input.files && input.files[0]) {
      validateHeader(input)
    }
  };

  const validateHeader = (input) => {
    var regex = new RegExp("([a-zA-Z0-9\s_\\.\-:])+(.jpg|.png|.jpeg)$");
    if (regex.test(input.value.toLowerCase())) {
      if (typeof (input.files) != "undefined") {
        var reader = new FileReader();
        reader.readAsDataURL(input.files[0]);
        reader.onload = function (e) {
          var image = new Image();
          image.src = e.target.result;
          image.onload = function () {
            var height = this.height;
            var width = this.width;
            console.log(width, height)
            if (height > 500 || width > 200) {
              const _url = URL.createObjectURL(input.files[0]);
              setHeaderUrlChannel(_url);
              setHeaderChannel(input.files[0]);
              return true;
            } else {
              toast("Atleast Upload a 500*200 size photo");
              return false;
            }
          };
        }
      } else {
        toast("This browser does not support HTML5.");
        return false;
      }
    } else {
      toast("Please select a valid Image file.");
      return false;
    }
  }

  return walletIsConnected ? (
    <>
      <ProfileStyled>
        <Container maxWidth="xl">
          <Box sx={{ py: 5 }}>
            <Box sx={{ textAlign: "center", py: 3 }}>
              <Typography variant="h6" sx={{ color: "#fff" }}>
                User Profile
              </Typography>
            </Box>
            {isLoading ? (
              <Box
                sx={{
                  backgroud: "#000",
                  minHeight: "55vh",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CircularProgress color="secondary" />
              </Box>
            ) : (
              <>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: { md: "center", xs: "flex-start" },
                    flexDirection: { md: "row", xs: "column" },
                    justifyContent: "space-between",
                    py: 3,
                    px: 3,
                    borderRadius: "10px",
                  }}
                  className="grey_color"
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: { sm: "flex-start", xs: "center" },
                      flexDirection: { sm: "row", xs: "column" },
                    }}
                  >
                    <Box sx={{ position: "relative", mb: 3 }}>
                      <img
                        src={
                          thumbnail
                            ? URL.createObjectURL(thumbnail)
                            : profileImage
                              ? profileImage
                              : NullImage
                        }
                        alt=""
                        className="profile_img"
                      />
                      <label
                        htmlFor="icon-button-file"
                        style={{
                          position: "absolute",
                          bottom: "-11px",
                          right: "-2px",
                        }}
                      >
                        <input
                          accept="image/*"
                          id="icon-button-file"
                          type="file"
                          onChange={ProfileImageHandler}
                        />
                        <IconButton
                          color="primary"
                          aria-label="upload picture"
                          component="span"
                        >
                          <Box
                            sx={{
                              background: "#1eda6b99",
                              color: "#fff",
                              borderRadius: "50%",
                              padding: "0 4px",
                            }}
                          >
                            <EditIcon />
                          </Box>
                        </IconButton>
                      </label>
                      <p style={{ color: "#fff" }}>Change AVI</p>
                    </Box>
                    <Box sx={{ pl: 3 }}>
                      <Typography variant="h4" sx={{ color: "#fff" }}>
                        {username && username}
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: { xs: "flex-start", sm: "center" },
                      justifyContent: "space-between",
                      flexDirection: { xs: "column", sm: "row" },
                      textAlign: { xs: "start", sm: "inherit" },
                    }}
                  >
                    <Box>
                      <WalletIcon />
                    </Box>

                    <Box sx={{ pl: { xs: 0, sm: 3 } }}>
                      <Typography
                        variant="caption"
                        sx={{ color: "var(--light-white)" }}
                      >
                        Wallet Address
                      </Typography>
                      <Typography
                        sx={{ color: "#fff", wordBreak: "break-all" }}
                      >
                        {walletAdress ? walletAdress : "N/A"}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <form onSubmit={formik.handleSubmit}>
                  <label style={{ marginTop: "20px", color: 'white' }} >Profile</label>
                  <Box sx={{ pt: 4 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        py: 3,
                        px: 3,
                        borderRadius: "10px",
                      }}
                      className="grey_color"
                    >
                      <Grid container alignItems="center" justifyContent="center" spacing={3}>
                        <Grid item xs={12} md={3} sx={{ py: 3 }}>
                          <Box
                            sx={{ display: "flex", flexDirection: "column" }}
                          >
                            <label>Username</label>
                            <TextField
                              fullWidth
                              name="user_name"
                              sx={{
                                "& legend": { display: "none" },
                                "& fieldset": { top: 0 },
                              }}
                              value={formik.values.user_name}
                              onChange={formik.handleChange}
                              error={
                                formik.touched.name &&
                                Boolean(formik.errors.name)
                              }
                              helperText={
                                formik.touched.name && formik.errors.name
                              }
                            />
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={3} sx={{ py: 3 }}>
                          <Box
                            sx={{ display: "flex", flexDirection: "column" }}
                          >
                            <label>Bio</label>
                            <TextField
                              fullWidth
                              name="user_bio"
                              sx={{
                                "& legend": { display: "none" },
                                "& fieldset": { top: 0 },
                              }}
                              value={formik.values.user_bio}
                              onChange={formik.handleChange}
                              error={
                                formik.touched.name &&
                                Boolean(formik.errors.name)
                              }
                              helperText={
                                formik.touched.name && formik.errors.name
                              }
                            />
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        py: 3,
                        px: 3,
                        mt: 2,
                        borderRadius: "10px",
                      }}
                      className="grey_color"
                    >
                      <Grid alignItems="center" justifyContent="center" container spacing={3}>
                        <Grid item xs={12} md={3} sx={{ py: 3 }}>
                          <Box
                            sx={{ display: "flex", flexDirection: "column" }}
                          >
                            <label>Twitter</label>
                            <TextField
                              fullWidth
                              name="twitter_link"
                              sx={{
                                "& legend": { display: "none" },
                                "& fieldset": { top: 0 },
                              }}
                              value={formik.values.twitter_link}
                              onChange={formik.handleChange}
                              error={
                                formik.touched.name &&
                                Boolean(formik.errors.name)
                              }
                              helperText={
                                formik.touched.name && formik.errors.name
                              }
                            />
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={3} sx={{ py: 3 }}>
                          <Box
                            sx={{ display: "flex", flexDirection: "column" }}
                          >
                            <label>Facebook</label>
                            <TextField
                              fullWidth
                              name="facebook_link"
                              sx={{
                                "& legend": { display: "none" },
                                "& fieldset": { top: 0 },
                              }}
                              value={formik.values.facebook_link}
                              onChange={formik.handleChange}
                              error={
                                formik.touched.name &&
                                Boolean(formik.errors.name)
                              }
                              helperText={
                                formik.touched.name && formik.errors.name
                              }
                            />
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={3} sx={{ py: 3 }}>
                          <Box
                            sx={{ display: "flex", flexDirection: "column" }}
                          >
                            <label>Instagram</label>
                            <TextField
                              fullWidth
                              name="instagram_link"
                              sx={{
                                "& legend": { display: "none" },
                                "& fieldset": { top: 0 },
                              }}
                              value={formik.values.instagram_link}
                              onChange={formik.handleChange}
                              error={
                                formik.touched.name &&
                                Boolean(formik.errors.name)
                              }
                              helperText={
                                formik.touched.name && formik.errors.name
                              }
                            />
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>
                  <Box
                    sx={{ py: 3, display: "flex", justifyContent: "center" }}
                  >
                    <Button
                      variant="contained"
                      type="submit"
                      sx={{
                        background: "var(--green-color)",
                        px: 4,
                      }}
                    >
                      Update
                    </Button>
                  </Box>
                </form>
                {
                  channelLoader ? (
                    <Box
                      sx={{
                        backgroud: "#000",
                        minHeight: "55vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CircularProgress color="secondary" />
                    </Box>
                  ) :
                    status === "2" || role == 'admin' &&
                    <form onSubmit={formikChannel.handleSubmit}>
                      <label style={{ color: 'white' }}>Channel Info</label>
                      <Box sx={{ pt: 4 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            py: 3,
                            px: 3,
                            borderRadius: "10px",
                          }}
                          className="grey_color"
                        >
                          <Grid container spacing={3}>
                            <Grid item xs={12} md={4} sx={{ py: 3 }}>
                              <Box
                                sx={{ display: "flex", flexDirection: "column" }}
                              >
                                <label>Channel Name</label>
                                <TextField
                                  fullWidth
                                  name="name"
                                  // label="title"
                                  sx={{
                                    "& legend": { display: "none" },
                                    "& fieldset": { top: 0 },
                                  }}
                                  value={channelName}
                                  onChange={e => setChannelName(e.target.value)}
                                />
                              </Box>
                            </Grid>
                            <Grid item xs={12} md={4} sx={{ py: 3 }}>
                              <Box
                                sx={{ display: "flex", flexDirection: "column" }}
                              >
                                <label>Creator Name</label>
                                <TextField
                                  fullWidth
                                  name="description"
                                  sx={{
                                    "& legend": { display: "none" },
                                    "& fieldset": { top: 0 },
                                  }}
                                  value={creatorName}
                                  onChange={e => setCreatorName(e.target.value)}

                                />
                              </Box>
                            </Grid>
                            <Grid item xs={12} md={4} sx={{ py: 3 }}>
                              <Box
                                sx={{ display: "flex", flexDirection: "column" }}
                              >
                                <label>Content Type</label>
                                <Select
                                  labelId="demo-simple-select-label"
                                  id="demo-simple-select-profile"
                                  value={formikChannel.values.type}
                                  label="Age"
                                  style={{
                                    color: 'white'
                                  }}
                                  onChange={formikChannel.handleChange('type')}
                                >
                                  <MenuItem value={'video'}>Video</MenuItem>
                                  <MenuItem value={'music'}>Music</MenuItem>
                                  <MenuItem value={'text'}>Text</MenuItem>
                                </Select>
                              </Box>
                            </Grid>
                            <Grid item xs={12} md={4} sx={{ py: 3 }}>
                              <Box
                                sx={{ display: "flex", flexDirection: "column" }}
                              >
                                <label>Twitter Link</label>
                                <TextField
                                  fullWidth
                                  name="description"
                                  sx={{
                                    "& legend": { display: "none" },
                                    "& fieldset": { top: 0 },
                                  }}
                                  value={twitterLinkChannel}
                                  onChange={e => setTwitterLinkChannel(e.target.value)}

                                />
                              </Box>
                            </Grid>
                            <Grid item xs={12} md={4} sx={{ py: 3 }}>
                              <Box
                                sx={{ display: "flex", flexDirection: "column" }}
                              >
                                <label>Youtube Link</label>
                                <TextField
                                  fullWidth
                                  name="description"
                                  sx={{
                                    "& legend": { display: "none" },
                                    "& fieldset": { top: 0 },
                                  }}
                                  value={youtubeLinkChannel}
                                  onChange={e => setYoutubeLinkChannel(e.target.value)}

                                />
                              </Box>
                            </Grid>
                            <Grid item xs={12} md={4} sx={{ py: 3 }}>
                              <Box
                                sx={{ display: "flex", flexDirection: "column" }}
                              >
                                <label>Candy Machine ID</label>
                                <TextField
                                  fullWidth
                                  name="description"
                                  sx={{
                                    "& legend": { display: "none" },
                                    "& fieldset": { top: 0 },
                                  }}
                                  value={candymachineId}
                                  onChange={e => setCandymachineId(e.target.value)}
                                />
                              </Box>
                            </Grid>
                            <Grid item xs={12} md={6} sx={{ py: 3 }}>
                              <Box
                                sx={{ display: "flex", flexDirection: "column" }}
                              >
                                <label>Instagram Link</label>
                                <TextField
                                  fullWidth
                                  name="description"
                                  sx={{
                                    "& legend": { display: "none" },
                                    "& fieldset": { top: 0 },
                                  }}
                                  value={twitchLinkChannel}
                                  onChange={e => setTwitchLinkChannel(e.target.value)}

                                />
                              </Box>
                            </Grid>
                            <Grid item xs={12} md={6} sx={{ py: 3 }}>
                              <div style={{ display: "flex" }}  >
                                <Box
                                  sx={{ display: "flex", flexDirection: "column" }}
                                >
                                  <label htmlFor="file-upload" className="custom-file-upload">
                                    Logo
                                  </label>
                                  <div>
                                    {thumbnailUrlChannel && (
                                      <img
                                        src={thumbnailUrlChannel}
                                        alt="thumnail"
                                        style={{
                                          width: "165px",
                                          height: "115px",
                                          objectFit: "cover",
                                        }}
                                        name="file"
                                      />
                                    )}
                                  </div>
                                  <input style={{ marginTop: "10px" }} id="file-upload" type="file" onChange={uploadFile} />
                                </Box>
                                <Box
                                  sx={{ display: "flex", flexDirection: "column" }}
                                >
                                  <label htmlFor="file-upload" className="custom-file-upload">
                                    Header
                                  </label>
                                  <div>
                                    {headerUrlChannel && (
                                      <img
                                        src={headerUrlChannel}
                                        alt="thumnail"
                                        style={{
                                          width: "165px",
                                          height: "115px",
                                          objectFit: "cover",
                                        }}
                                        name="file"
                                      />
                                    )}
                                  </div>
                                  <input style={{ marginTop: "10px" }} id="file-upload" type="file" onChange={uploadHeader} />
                                </Box>
                              </div>
                            </Grid>
                          </Grid>
                        </Box>
                      </Box>
                      <Box
                        sx={{ py: 3, display: "flex", justifyContent: "center" }}
                      >
                        <Button
                          variant="contained"
                          type="submit"
                          sx={{
                            background: "var(--green-color)",
                            px: 4,
                          }}
                        >
                          Update Channel
                        </Button>
                      </Box>
                    </form>
                }

              </>
            )}
          </Box>
        </Container>
      </ProfileStyled>
    </>
  ) : (
    <ConnectMessage />
  );
};

export default UserProfile;

const ProfileStyled = styled.section`
  background: #000;

  #demo-simple-select-profile {
    padding-top: 6px;
    padding-bottom: 6px;
    background:#ffffff4d
  }

  #icon-button-file {
    display: none;
  }
  .grey_color {
    background: #474747;
  }
  .profile_img {
    /* width: 100%; */
    width: 140px;
    height: 140px;
    object-fit: cover;
    border-radius: 50%;
  }
  label {
    color: var(--light-white);
    padding-bottom: 2px;
  }
  .css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input {
    background: #ffffff4d;
    border: none;
    outline: none;
    border-radius: 5px;
    padding: 8px;
    color: #fff;
    cursor: pointer;
  }
  /* .input {
    background: hwb(0deg 100% 0% / 30%);
    border: none;
    outline: none;
    border-radius: 5px;
    padding: 8px;
  } */
  .Mui-disabled {
    background: var(--green-color) !important;
    color: #fff !important;
    opacity: 0.7;
  }
`;
