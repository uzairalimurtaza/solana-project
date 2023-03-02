import React, { useState, useEffect } from "react";
import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/build/index.css";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import * as yup from "yup";
import { AddVideo, viewAllCategory, viewVideoDetail } from "../../api/Url";
import Axios from "../../api/Axios";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import styled from "styled-components";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { toast } from "react-toastify";
import InputLabel from '@mui/material/InputLabel';
import LoadingButton from '@mui/lab/LoadingButton';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const UploadVideo = ({ VideoSrc, videoFile, setlayout }) => {
  const FILE_SIZE = 160 * 1024;
  const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];
  const [ThumbnailUrl, setThumbnailUrl] = useState(null);
  const [Thumbnail, setThumbnail] = useState(null);
  const [category, setcategory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isPublic, setIsPublic] = useState(true)
  const [categories, setCategories] = React.useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    console.log(value, 'dasda')
    setCategories(value);
  };

  useEffect(() => {
    getCategory();
  }, []);

  const getCategory = async () => {
    try {
      const response = await Axios.post(viewAllCategory);
      setcategory(response.data.data);
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
      // file: null,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      // console.log("values", values);
      try {
        if (!videoFile || !Thumbnail) {
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
          formData.append(`files`, videoFile);
          formData.append(`files`, Thumbnail);
          formData.append(`public`, isPublic);
          var response = await Axios.post(AddVideo, formData, config);
          if (response) {
            setLoading(false)
          }
          if (response.data.status) {
            window.location.reload()
            setlayout(true);
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
        <Container className='upload-video-wrapper'>
          <Grid
            container
            spacing={2}
          >
            <Grid item xs={8}>
              <h4 style={{ textAlign: "left" }}>Upload your video</h4>
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
                    <FormControlLabel
                      control={<Switch checked={isPublic} onChange={handlePublicSwitch} color="primary" />}
                      label="Public"
                      labelPlacement="start"
                    />
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
                        <LoadingButton
                          loading={loading}
                          type="submit"
                          variant="contained"
                          className='border-none'
                          sx={{ margin: "10px" }}
                        >
                          Submit
                        </LoadingButton>
                      </label>
                    </div>
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

                </Grid>
              </form>
            </Grid>
            <Grid item xs={4}>
              <div style={{ marginTop: "47px" }}>
                {VideoSrc && (
                  <video
                    src={VideoSrc}
                    controls
                    style={{ width: "100%" }}
                  ></video>
                )}
                {ThumbnailUrl && (
                  <img
                    src={ThumbnailUrl}
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
      </UploadVideoStyled>
    </>
  );
};

export default UploadVideo;

const UploadVideoStyled = styled.section`
  .thumbnail {
    display: none;
  }
  .upload-video-wrapper {
    background-color: white;
    margin-top:30px
  }
  .border-none {
    border: none !important;
  }
  .border-none:hover {
    background-color: white !important;
    color:black !important
  }
`;
