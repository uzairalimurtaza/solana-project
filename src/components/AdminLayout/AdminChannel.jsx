import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Button,
  TextField,
  CircularProgress,
} from "@mui/material";
import ResponsiveDrawer from "../../pages/Admin/Admin";
import styled from "styled-components";
import { useFormik } from "formik";
import Axios from "../../api/Axios";
import { adminChannelInfo,editContentCreator } from "../../api/Url";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { toast } from "react-toastify";

const AdminChannel = () => {

  const [thumbnailUrlChannel, setThumbnailUrlChannel] = useState("");
  const [thumbnailChannel, setThumbnailChannel] = useState(null);
  const [headerUrlChannel, setHeaderUrlChannel] = useState("");
  const [headerChannel, setHeaderChannel] = useState(null);
  const [channelName, setChannelName] = useState('')
  const [creatorName, setCreatorName] = useState('')
  const [twitterLinkChannel, setTwitterLinkChannel] = useState('')
  const [youtubeLinkChannel, setYoutubeLinkChannel] = useState('')
  const [twitchLinkChannel, setTwitchLinkChannel] = useState('')
  const [channelType, setChannelType] = useState('')
  const [channelLoader, setChannelLoader] = useState(false)

  useEffect(() => {
    getChannelDetails()
  }, [])

  const getChannelDetails = async () => {
    // console.log(localStorage.getItem("uToken"), 'dadad')
    try {
      const header = {
        headers: {
          Authorization: localStorage.getItem("uToken"),
        },
      };
      const response = await Axios.post(adminChannelInfo, {}, header);
      console.log(response.data, 'dad')
      if (response) {
        setTwitterLinkChannel(response.data.data.twitter_link)
        setYoutubeLinkChannel(response.data.data.youtube_link)
        setTwitchLinkChannel(response.data.data.twitch_link)
        setThumbnailUrlChannel(response.data.data.channel_banner)
        setChannelName(response.data.data.channel_name)
        setCreatorName(response.data.data.creator_name)
        setChannelType(response.data.data.channel_type)
        setHeaderUrlChannel(response.data.data.channel_header);
        setThumbnailUrlChannel(response.data.data.channel_logo)
      }
    } catch (err) {
      console.log(err)
    }
  };


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
      toast("Please select a valid Image file Name");
      return false;
    }
  }

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
    onSubmit: async (values) => {
      setChannelLoader(true)
      let data = new FormData()
      data.append('channel_name', channelName)
      data.append('channel_type', channelType)
      data.append('creator_name', creatorName)
      data.append('twitter_link', twitterLinkChannel)
      data.append('youtube_link', youtubeLinkChannel)
      data.append('twitch_link', twitchLinkChannel)
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
        }
      } catch (e) {
        console.log(e);
        setChannelLoader(false)
      }
    },
  });

  return (
    <div>
      <ResponsiveDrawer>
        <AdminChannelStyles>
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
                            label="Type"
                            style={{
                              color: "black"
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
                      <Grid item xs={12} md={6} sx={{ py: 1 }}>
                        <div className="img-sec"  >
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
                  sx={{ py: 1, display: "flex", justifyContent: "center" }}
                >
                  <Button
                    variant="contained"
                    type="submit"
                    sx={{
                      background: "var(--green-color)",
                      px: 4,
                      "&:hover": {
                        color: "var(--green-color)",
                        backgroundColor: "white"
                      },
                    }}
                  >
                    Update Channel
                  </Button>
                </Box>
              </form>
          }
        </AdminChannelStyles>
      </ResponsiveDrawer>
    </div>
  )
}

export default AdminChannel;

const AdminChannelStyles = styled.section`

  #demo-simple-select-profile {
    padding-top: 6px;
    padding-bottom: 6px;
    background:#ffffff4d
  }

  #icon-button-file {
    display: none;
  }

  .grey_color {
    /* background: #474747; */
  }

  .profile_img {
    /* width: 100%; */
    width: 140px;
    height: 140px;
    object-fit: cover;
    border-radius: 50%;
  }

  label {
    color: black;
    padding-bottom: 2px;
  }

  .css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input {
    background: #ffffff4d;
    border: none;
    outline: none;
    border-radius: 5px;
    padding: 8px;
    color: black;
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

  .img-sec{
      display: flex;
  }

  @media (max-width: 800px) {
    .img-sec{
      display: flex;
      flex-direction: column;
    }
  }
`;
