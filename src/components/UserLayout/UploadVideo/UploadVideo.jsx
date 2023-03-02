import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  AddVideo,
  viewAllCategory,
} from "../../../api/Url";
import Axios from "../../../api/Axios";
import { ProgressBar } from "react-bootstrap";
import {
  MenuItem,
  Button,
  Grid,
  Container,
  Typography,
  Box
} from "@mui/material";
import styled from "styled-components";
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Overlay from "../../../assets/images/thumbnailOverlay.png";
import { toast } from "react-toastify";

const UploadVideo = ({ videoUrl, videoFile, setVideLayout, duration }) => {
  const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];
  const [ThumbnailUrl, setThumbnailUrl] = useState(null);
  const [Thumbnail, setThumbnail] = useState(null);
  const [category, setcategory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [allCategory, setAllCategory] = useState([]);
  const [isPublic, setIsPublic] = useState(true)

  const handlePublicSwitch = (e) => {
    setIsPublic(e.target.checked)
  }

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

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    console.log(value, 'dasda')
    setCategories(value);
  };

  const getCategory = async () => {
    try {
      const response = await Axios.post(viewAllCategory, {});
      setcategory(response.data.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getCategory();
  }, []);

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
    file: yup.mixed().nullable().required(),
    // .test(
    //   "fileSize",
    //   "File Size is too large",
    //   (value) => value && value.size <= FILE_SIZE
    // )
    // .test(
    //   "fileFormat",
    //   "Unsupported Format",
    //   (value) => value && SUPPORTED_FORMATS.includes(value.type)
    // ),
  });
  // console.log(uploadPercentage);

  const ProgressBarHandler = async (file, onUploadProgress) => {
    var options = {
      onUploadProgress,
      headers: {
        Authorization: localStorage.getItem("uToken"),
      },
    };
    const response = await Axios.post(AddVideo, file, options);
    return response;
  };

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      amount: "",
      category: "",
      file: null,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log("values", JSON.stringify(categories));
      if (categories.length == 0) {
        toast.error('Please Select Categories First')
      }
      else {
        try {
          setIsLoading(true);
          var formData = new FormData();
          formData.append("title", values.title);
          formData.append("description", values.description);
          formData.append("category_ids", JSON.stringify(categories));
          formData.append("amount", values.amount);
          formData.append("duration", duration);
          formData.append(`public`, isPublic);
          formData.append(`files`, videoFile);
          formData.append(`files`, Thumbnail);

          const result = await ProgressBarHandler(formData, (progressEvent) => {
            const { loaded, total } = progressEvent;
            let percent = Math.floor((loaded * 100) / total);
            if (percent < 100) {
              setUploadPercentage(percent);
            }
          });
          setVideLayout(false);
          setIsLoading(false);
        } catch (e) {
          setVideLayout(false);
          setIsLoading(false);
          console.log(e);
        }
      }
    },
  });
  return (
    <>
      <UploadVideoStyled>
        <Container maxWidth="xl">
          {isLoading ? (
            <Box
              sx={{
                minHeight: "55vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <Box>
                <Box>
                  <h3 style={{ color: "#fff" }}>
                    Video is Uploading please wait for while....
                  </h3>
                </Box>
                <ProgressBar
                  now={uploadPercentage}
                  active
                  label={`${uploadPercentage}%`}
                />
              </Box>
            </Box>
          ) : (
            <Box sx={{ pb: 4, pt: 0 }}>
              <Box sx={{ textAlign: "center", pb: 3 }}>
                <Typography variant="h6" sx={{ color: "#fff" }}>
                  Upload your Video
                </Typography>
              </Box>
              <form onSubmit={formik.handleSubmit}>
                <Box sx={{ background: "#474747", p: 3, borderRadius: "10px" }}>
                  <Grid
                    container
                    spacing={8}
                  // containerspacing={{ xs: 2, md: 3 }}
                  // columns={{ xs: 4, sm: 8, md: 12 }}
                  >
                    <Grid item xs={12} md={4}>
                      <Box>
                        <Typography
                          variant="body"
                          component="div"
                          sx={{ color: "#fff", pb: 1 }}
                        >
                          Your Video
                        </Typography>
                        <Box sx={{ pb: 3 }}>
                          {videoUrl && (
                            <video
                              src={videoUrl}
                              controls
                              style={{ width: "100%" }}
                            ></video>
                          )}
                        </Box>
                        <Box>
                          <Typography
                            variant="body"
                            component="div"
                            sx={{ color: "#fff", pb: 1 }}
                          >
                            Your Thumbnail
                          </Typography>
                          <Box sx={{ position: "relative" }}>
                            <img
                              src={Overlay}
                              alt=""
                              style={{ width: "100%" }}
                            />
                            {ThumbnailUrl && (
                              <img
                                src={ThumbnailUrl}
                                alt=""
                                className="thumbnail_overlay"
                                name="file"
                              />
                            )}
                          </Box>
                          <Typography
                            variant="body"
                            component="div"
                            sx={{ color: "red", mt: 1 }}
                          >
                            {formik.touched.file && Boolean(formik.errors.file)}
                            {formik.touched.file && formik.errors.file}
                          </Typography>
                          <label htmlFor="contained-button-file">
                            <input
                              name="file"
                              accept="image/*"
                              id="contained-button-file"
                              className="thumbnail"
                              type="file"
                              onChange={(e) => {
                                formik.handleChange("file")(e);
                                UploadThumbail(e);
                              }}
                            />
                            <Button
                              className="upload_btn"
                              variant="contained"
                              component="span"
                            // endIcon={<AddAPhotoIcon />}
                            >
                              Upload Thumbnail
                            </Button>
                          </label>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={8}>
                      <Grid
                        container
                        spacing={2}
                      // containerspacing={{ xs: 2, md: 3 }}
                      // columns={{ xs: 4, sm: 8, md: 12 }}
                      >
                        <Grid item xs={12}>
                          <Box
                            sx={{ display: "flex", flexDirection: "column" }}
                          >
                            <label>Title</label>
                            <TextField
                              sx={{
                                "& legend": { display: "none" },
                                "& fieldset": { top: 0 },
                              }}
                              fullWidth
                              name="title"
                              // label="title"
                              value={formik.values.title}
                              onChange={formik.handleChange}
                              error={
                                formik.touched.title &&
                                Boolean(formik.errors.title)
                              }
                              helperText={
                                formik.touched.title && formik.errors.title
                              }
                            // onBlur={formik.handleBlur}
                            />
                          </Box>
                        </Grid>
                        <Grid item xs={12}>
                          <Box
                            sx={{ display: "flex", flexDirection: "column" }}
                          >
                            <label>Description</label>
                          </Box>
                          <TextField
                            fullWidth
                            name="description"
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
                            // onBlur={formik.handleBlur}
                            multiline
                            rows={8}
                            maxRows={10}
                            sx={{
                              "& legend": { display: "none" },
                              "& fieldset": { top: 0 },
                              cursor: "pointer",
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Box
                            sx={{ display: "flex", flexDirection: "column" }}
                          >
                            <label>Amount</label>
                          </Box>
                          <TextField
                            fullWidth
                            name="amount"
                            // label="Amount"
                            value={formik.values.amount}
                            onChange={formik.handleChange}
                            error={
                              formik.touched.amount &&
                              Boolean(formik.errors.amount)
                            }
                            helperText={
                              formik.touched.amount && formik.errors.amount
                            }
                            // onBlur={formik.handleBlur}
                            sx={{
                              "& legend": { display: "none" },
                              "& fieldset": { top: 0 },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Box
                            sx={{ display: "flex", flexDirection: "column" }}
                          >
                            <label>Select Category</label>
                          </Box>
                          <FormControl sx={{ width: '100%' }}>
                            <Select
                              labelId="demo-multiple-name-label"
                              id="demo-multiple-name"
                              multiple
                              value={categories}
                              onChange={handleChange}
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
                            sx={{ ml: 0, mt: 1 }}
                            control={<Switch checked={isPublic} onChange={handlePublicSwitch} color="primary" />}
                            label="Public"
                            labelPlacement="start"
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ margin: "10px" }}
                    className="submitBtn"
                  >
                    Submit
                  </Button>
                </Box>
              </form>
            </Box>
          )}
        </Container>
      </UploadVideoStyled>
    </>
  );
};

export default UploadVideo;

const UploadVideoStyled = styled.section`
  background: #000;
  .css-1sumxir-MuiFormLabel-root-MuiInputLabel-root.Mui-focused {
    color: #fff !important;
  }
  .css-md26zr-MuiInputBase-root-MuiOutlinedInput-root {
    color: #fff !important;
  }
  .submitBtn {
    background: var(--green-color);
    padding: 8px 2rem;
    margin-top: 3rem;
    border: 2px solid var(--green-color);
    &:hover {
      background: #fff;
      color: var(--green-color);
    }
  }
  .thumbnail {
    display: none;
  }
  .thumbnail_overlay {
    object-fit: cover;
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    left: 0;
    border-radius: 10px;
  }
  .react-tag-input {
    background: #ffffff4d;
    cursor: pointer;
    input {
      &::placeholder {
        color: #fff;
      }
    }
  }
  .MuiSelect-select {
    background: #ffffff4d;
  }
  .progress-bar {
    background-color: var(--green-color);
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
  textarea {
    cursor: pointer !important;
  }
  label {
    color: #fff;
  }
  .MuiInputBase-multiline {
    background: #ffffff4d;
    border-radius: 5px;
    padding: 8px;
    color: #fff;
  }
  .upload_btn {
    background: transparent;
    border: 2px solid var(--green-color);
    margin-top: 1.5rem;
    color: var(--green-color);
    &:hover {
      background: var(--green-color);
      color: #fff;
    }
  }
`;
