import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import * as yup from "yup";
import { AddVideo, viewAllCategory, getChannels,uploadVideoAdmin } from "../../api/Url";
import Axios from "../../api/Axios";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { toast } from "react-toastify";
import InputLabel from '@mui/material/InputLabel';
import LoadingButton from '@mui/lab/LoadingButton';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import styled from "styled-components";
import ResponsiveDrawer from "../../pages/Admin/Admin";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const AddVideoToChannel = () => {

  const navigate = useNavigate()

  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isPublic, setIsPublic] = useState(true)
  const [categories, setCategories] = React.useState([]);
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = React.useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    console.log(value, 'dasda')
    setCategories(value);
  };

  const handleChangeChannel = (event) => {
    setSelectedChannel(event.target.value);
  };

  const uploadFileHandler = ({ currentTarget: input }) => {
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

    } else {
      toast.error("Please first connect your wallet");
    }
  };

  useEffect(() => {
    getCategory();
    viewChannels();
  }, []);

  const viewChannels = async () => {
    const data = {
      user_status: 2,
    };
    const response = await Axios.post(getChannels, data);
    if (response) {
      console.log(response.data.data)
      setChannels(response.data.data)
    }
  }

  const getCategory = async () => {
    try {
      const response = await Axios.post(viewAllCategory);
      setCategory(response.data.data);
    } catch (e) {
      console.log(e);
    }
  };

  const UploadThumbail = ({ currentTarget: input }) => {
    if (input.files && input.files[0]) {
      const files = input.files[0];
      const _url = URL.createObjectURL(files);
      setThumbnailUrl(_url);
      setThumbnail(files);
    }
  };

  const validationSchema = yup.object({
    title: yup.string("Enter your title").required("Title is required"),
    description: yup
      .string("Enter your email")
      .required("Discription is required"),
    amount: yup
      .number()
      .positive()
      .required()
      .typeError("you must specify a number")
      .min(0, "Min value 0."),
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      category: "",
      amount: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      // console.log("values", values);
      try {
        if (!videoFile || !thumbnail) {
          toast.error('Both Thumbnail and Video files need to be Selected', {
            toastId: 'FE4',
          })
        }
        else {
          setLoading(true)
          const config = {
            headers: {
              Authorization: localStorage.getItem("uToken"),
            },
          };
          var formData = new FormData();
          formData.append("title", values.title);
          formData.append("description", values.description);
          formData.append("category_ids", JSON.stringify(categories));
          formData.append("amount", values.amount);
          formData.append(`video`, videoFile);
          formData.append(`thumbnail`, thumbnail);
          formData.append(`channel_id`, selectedChannel);
          formData.append(`public`, isPublic);
          var response = await Axios.post(uploadVideoAdmin, formData, config);
          if (response) {
            setLoading(false)
          }
          if (response.data.status) {
            navigate("/admin/videos/")
          }
        }
        // setlayout(true);
      } catch (e) {
        setLoading(false)
        console.log(e);
      }
    },
  });

  const handlePublicSwitch = (e) => {
    setIsPublic(e.target.checked)
  }

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

  return (
    <>
      <UploadVideoStyled>
        <ResponsiveDrawer>
          <Container className='upload-video-wrapper'>
            <Grid
              container
              spacing={2}
            >
              <Grid item xs={8}>
                <h4 style={{ textAlign: "left" }}>Upload Your Video</h4>
                <form onSubmit={formik.handleSubmit}>
                  <Grid
                    container
                    spacing={2}
                  >
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        name="title"
                        label="Title"
                        value={formik.values.title}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.title && Boolean(formik.errors.title)
                        }
                        helperText={formik.touched.title && formik.errors.title}
                        sx={{ margin: "10px 0" }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        name="amount"
                        label="Amount"
                        value={formik.values.amount}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.amount && Boolean(formik.errors.amount)
                        }
                        helperText={formik.touched.amount && formik.errors.amount}
                        sx={{ margin: "10px 0" }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl sx={{ width: '100%' }}>
                        <InputLabel id="demo-multiple-name-label">Categories</InputLabel>
                        <Select
                          labelId="demo-multiple-name-label"
                          id="demo-multiple-name"
                          multiple
                          value={categories}
                          onChange={handleChange}
                          label="Categories"
                          MenuProps={MenuProps}
                        >
                          {Object.keys(category).length > 0 &&
                            category.map((option) => (
                              <MenuItem key={option._id} value={option._id}>
                                {option.category_name}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Channels</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={selectedChannel}
                          label="Channels"
                          onChange={handleChangeChannel}
                        >
                          {Object.keys(channels).length > 0 &&
                            channels.map((option) => (
                              <MenuItem key={option._id} value={option._id}>
                                {option.channel_name}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        name="description"
                        label="Description"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.description &&
                          Boolean(formik.errors.description)
                        }
                        helperText={
                          formik.touched.description && formik.errors.description
                        }
                        multiline
                        rows={1}
                        sx={{ margin: "8px 0" }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <div>
                        <label htmlFor="contained-button-file">
                          <input
                            accept="image/*"
                            id="contained-button-file"
                            className="thumbnail"
                            type="file"
                            onChange={UploadThumbail}
                          />
                          <Button
                            variant="contained"
                            component="span"
                            className='border-none'
                            endIcon={<AddAPhotoIcon />}
                          >
                            Upload Thumbnail
                          </Button>
                        </label>
                        <label
                          htmlFor="contained-button-file"
                          className="uploadBtn"
                          style={{
                            marginTop:"5px"
                          }}
                        >
                          <p>Upload Video</p>
                          <input
                            id="contained-button-file"
                            type="file"

                            onChange={uploadFileHandler}
                            accept="video/mp4,video/x-m4v,video/*"
                          />
                        </label>
                      </div>
                    </Grid>
                    <FormControlLabel
                      control={<Switch checked={isPublic} onChange={handlePublicSwitch} color="primary" />}
                      label="Public"
                      labelPlacement="start"
                    />
                    <LoadingButton
                      loading={loading}
                      type="submit"
                      variant="contained"
                      className='border-none'
                      sx={{ margin: "10px" }}
                    >
                      Submit
                    </LoadingButton>
                  </Grid>
                </form>
              </Grid>
              <Grid item xs={4}>
                <div style={{ marginTop: "47px" }}>
                  {videoUrl && (
                    <video
                      src={videoUrl}
                      controls
                      style={{ width: "100%" }}
                    ></video>
                  )}
                  {thumbnailUrl && (
                    <img
                      src={thumbnailUrl}
                      alt=""
                      style={{
                        width: "165px",
                        height: "115px",
                        objectFit: "cover",
                      }}
                      name="file"
                    />
                  )}
                </div>
              </Grid>
            </Grid>
          </Container>
        </ResponsiveDrawer>
      </UploadVideoStyled>
    </>
  );
};

export default AddVideoToChannel;

const UploadVideoStyled = styled.section`
  .thumbnail {
    display: none;
  }
  .upload-video-wrapper {
    background-color: white;
    margin-top:40px
  }
  .border-none {
    border: none !important;
  }
  .border-none:hover {
    background-color: white !important;
    color:black !important
  }
`;
