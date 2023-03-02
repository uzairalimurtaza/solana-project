import React, { useState, useEffect } from "react";
import "@pathofdev/react-tag-input/build/index.css";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import * as yup from "yup";
import { AddVideo, viewCategory } from "../../api/Url";
import Axios from "../../api/Axios";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import styled from "styled-components";
import CircularProgress from '@mui/material/CircularProgress';
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import InputLabel from '@mui/material/InputLabel';
import Switch from '@mui/material/Switch';
import {
  viewVideoRoute,
  editVideoRoute,
  viewAllCategories,
} from "../../api/Url";
import ResponsiveDrawer from "../../pages/Admin/Admin";
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useParams, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify'

const EditVideo = ({ videoFile, setlayout }) => {

  const navigate = useNavigate()
  let { id } = useParams();
  const [ThumbnailUrl, setThumbnailUrl] = useState(null);
  const [Thumbnail, setThumbnail] = useState(null);
  const [categoryItems, setCategoryItems] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loader, setLoader] = useState(false);
  const [categoryId, setCategoryId] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const [categories, setCategories] = React.useState([]);

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
  useEffect(() => {
    getCategory();
    getVideo();
  }, []);


  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    console.log(value, 'dasda')
    setCategories(value);
  };


  const getCategory = async () => {
    try {
      const config = {
        headers: {
          Authorization: localStorage.getItem("uToken"),
        },
      };
      const response = await Axios.get(viewAllCategories, config);
      if (response) {
        setCategoryItems(response.data.data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handlePublicSwitch = (e) => {
    setIsPublic(e.target.checked)
  }

  const getVideo = async () => {
    try {
      setLoader(true)
      const response = await Axios.get(viewVideoRoute + id);
      if (response) {
        console.log(response.data.video_details, 'dddww');
        setTitle(response.data.video_details.title);
        setAmount(response.data.video_details.amount);
        setDescription(response.data.video_details.description);
        setIsPublic(response.data.video_details.public);
        setThumbnailUrl(response.data.video_details.video_thumbnail)
        let cat = []
        response.data.video_details.category_ids.map(item=>{
          console.log(item.category_id._id,'dasdas')
          cat.push(item.category_id._id,)
        })
        setCategories(cat)
        setLoader(false)
      }
    } catch (e) {
      console.log(e);
      setLoader(false)

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

  const UploadThumbail = ({ currentTarget: input }) => {
    if (input.files && input.files[0]) {
      const files = input.files[0];
      const _url = URL.createObjectURL(files);
      setThumbnailUrl(_url);
      setThumbnail(files);
    }
  };

  const formik = useFormik({
    initialValues: {
      title: title,
      description: description,
      amount: amount,
      category: categoryId,
      // file: null,
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      // console.log("values", values);
      try {
        setLoader(true)
        var formData = new FormData();
        formData.append("video_id", id);
        formData.append("title", values.title);
        formData.append("description", values.description);
        formData.append("amount", values.amount);
        formData.append(`file`, Thumbnail);
        formData.append("category_ids", JSON.stringify(categories));
        formData.append(`public`, isPublic);
        const config = {
          headers: {
            Authorization: localStorage.getItem("uToken"),
          },
        };
        var response = await Axios.post(editVideoRoute, formData, config);
        if (response.data.status) {
          toast.success('Edit Video Successfully')
          navigate('/admin/videos')
          // setlayout(true);
        }
        // setlayout(true);
      } catch (e) {
        toast.error('Could Not Edit Video')
        console.log(e.message);
      }
    },
  });

  return (
    <>
      <div>
        <ResponsiveDrawer>
          <UploadVideoStyled>
            <Container className="upload-video-wrapper">
              {
                loader ?
                  <>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'center'
                    }}>
                      <CircularProgress
                        style={{
                          marginTop: '30px',
                        }}
                      />
                    </div>
                  </> :
                  <>
                    <Grid container spacing={2}>
                      <Grid item xs={8}>
                        <h4 style={{ textAlign: "left" }}>Edit Your Video</h4>
                        <form onSubmit={formik.handleSubmit}>
                          <Grid container spacing={2}>
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
                                helperText={
                                  formik.touched.title && formik.errors.title
                                }
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
                                  formik.touched.amount &&
                                  Boolean(formik.errors.amount)
                                }
                                helperText={
                                  formik.touched.amount && formik.errors.amount
                                }
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
                                  {Object.keys(categoryItems).length > 0 &&
                                    categoryItems.map((option) => (
                                      <MenuItem key={option._id} value={option._id}>
                                        {option.category_name}
                                      </MenuItem>
                                    ))}
                                </Select>
                              </FormControl>
                              <FormControlLabel
                                sx={{ m: 0 }}
                                control={<Switch checked={isPublic} onChange={handlePublicSwitch} color="primary" />}
                                label="Public"
                                labelPlacement="start"
                              />
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
                                  formik.touched.description &&
                                  formik.errors.description
                                }
                                multiline
                                rows={3}
                                sx={{ margin: "10px 0" }}
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
                                    className="border-none"
                                    variant="contained"
                                    component="span"
                                    endIcon={<AddAPhotoIcon />}
                                  >
                                    Upload Thumbnail
                                  </Button>
                                  <Button
                                    className="border-none"
                                    type="submit"
                                    variant="contained"
                                    sx={{ margin: "10px" }}
                                  >
                                    Submit
                                  </Button>
                                </label>
                              </div>
                            </Grid>
                            <Grid item xs={6}>

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
                            </Grid>
                          </Grid>
                        </form>
                      </Grid>
                    </Grid>
                  </>
              }

            </Container>
          </UploadVideoStyled>
        </ResponsiveDrawer>
      </div>
    </>
  );
};

export default EditVideo;

const UploadVideoStyled = styled.section`
  .thumbnail {
    display: none;
  }

  .upload-video-wrapper {
    background-color: white;
    margin-top:30px;
    padding:30px
  }
  .border-none {
    border: none !important;
  }
  .border-none:hover {
    background-color: white !important;
    color:black !important
  }
`;
