import React, { useState, useEffect } from "react";
import ResponsiveDrawer from "../../pages/Admin/Admin";
import "@pathofdev/react-tag-input/build/index.css";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import CircularProgress from "@mui/material/CircularProgress";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import * as yup from "yup";
import { Link } from "react-router-dom";
import styled from "styled-components";
import {
  createCategory,
  deleteCategoryRoute,
  searchCategoryRoute,
} from "../../api/Url";
import Axios from "../../api/Axios";
import Table from "./TableContainer";
import { toast } from "react-toastify";
import LoadingButton from "@mui/lab/LoadingButton";

const Categories = () => {
  const [skip, setSkip] = React.useState(0);
  const [count, setCount] = React.useState();
  const [limit, setLimit] = React.useState(10);
  const [open, setOpen] = React.useState(false);
  const [allCategories, setallCategories] = useState([]);
  const [thumbnail, setThumbnail] = useState();
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [loader, setLoader] = useState(false);
  const [responseStatus, setResponseStatus] = useState(false);
  const [deleteDialogueOpen, setDeleteDialogueOpen] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState();
  const [sortName, setSortName] = React.useState("Name Ascending");
  const [sortValue, setSortValue] = React.useState("category_name");
  const [sortType, setSortType] = React.useState("asc");
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleClickOpenDeleteDialogue = (id) => {
    setDeleteDialogueOpen(true);
    setDeleteId(id);
  };

  const handleCloseDeleteDialogue = () => {
    setDeleteDialogueOpen(false);
  };

  useEffect(() => {
    getData(sortValue, sortType);
  }, [skip]);

  const getData = async (sortValue, sortType) => {
    setResponseStatus(true);
    setLoader(true);
    setallCategories([]);
    try {
      var yourObject = {};
      yourObject[sortValue] = sortType;

      const config = {
        headers: {
          Authorization: localStorage.getItem("uToken"),
        },
      };
      Axios.post(
        searchCategoryRoute,
        {
          sort: yourObject,
          category_name: name,
          category_description: description,
          skip,
          limit,
        },
        config
      )
        .then((response) => {
          setLoader(false);
          setallCategories(response.data.data);
          setCount(response.data.count);
          setResponseStatus(response.data.status);
        })
        .catch((err) => {
          setLoader(false);
          setallCategories([]);
          setResponseStatus(err.response.data.status);
        });
    } catch (e) {
      console.log(e);
    }
  };

  const columns = [
    {
      Header: "Name",
      accessor: "category_name",
      disableFilters: true,
    },
    {
      Header: "Description",
      accessor: "description",
      disableFilters: true,
      Cell: ({ cell: { value } }) => (
        <p className="text-description">{value}</p>
      ),
    },
    {
      Header: "Image",
      accessor: "category_image",
      disableFilters: true,
      Cell: ({ cell: { value } }) => (
        <img style={{ width: "100%" }} src={value} />
      ),
    },
    {
      Header: "Action",
      disableFilters: true,
      accessor: "_id",
      Cell: ({ cell: { value, row } }) => (
        <>
          {row.original.category_name != 'Uncategorized' &&
            <>
              <Button
                className="border-none"
                onClick={(e) => {
                  handleClickOpenDeleteDialogue(value);
                }}
              >
                <img src={"/images/icons/delete.png"} />
              </Button>
              <Link className={"edit-btn"} to={`/admin/edit/category/${value}`}>
                <img src={"/images/icons/edit.png"} />
              </Link>
            </>
          }
          <Link className="vid-icon" state={{ category: value }} to={`/admin/videos`}>
            <img src={"/images/icons/video.png"} />
          </Link>
        </>
      ),
    },
  ];

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = async () => {
    setOpen(false);
  };

  const deleteCategory = async (id) => {
    const response = await Axios.delete(deleteCategoryRoute, {
      data: {
        category_id: id,
      },
      headers: {
        Authorization: localStorage.getItem("uToken"),
      },
    });
    if (response.data.status) {
      window.location.reload();
    }
  };

  const uploadFile = async ({ currentTarget: input }) => {
    if (input.files && input.files[0]) {
      const files = input.files[0];
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
            if (height > 500 || width > 200) {
              const _url = URL.createObjectURL(input.files[0]);
              setThumbnailUrl(_url);
              setThumbnail(input.files[0]);
              return true;
            } else {
              setThumbnail();
              toast.warn("Atleast Upload a 500*200 photo size", {
                toastId: 'FE2',
              });
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

  const validationSchema = yup.object({
    name: yup.string("Enter your name").required("Name is required"),
    description: yup
      .string("Enter your email")
      .required("Discription is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      file: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (!thumbnail) {
        toast.error("Please select a file first", {
          toastId: 'FE3',
        });
      } else {
        setLoading(true);
        let data = new FormData();
        data.append("category_name", values.name);
        data.append("description", values.description);
        data.append("image", thumbnail);
        try {
          const config = {
            headers: {
              Authorization: localStorage.getItem("uToken"),
            },
          };
          var response = await Axios.post(createCategory, data, config);
          if (response) {
            setLoading(false);
          }
          if (response.data.status) {
            window.location.reload();
            setOpen(false);
          }
        } catch (e) {
          setLoading(false);
          console.log(e);
        }
      }
    },
  });

  const increaseSkip = () => {
    if (skip + 1 < count / limit) {
      setSkip(skip + 1);
    }
  };

  const decreaseSkip = () => {
    if (skip === 0) {
      setSkip(0);
    } else {
      setSkip(skip - 1);
    }
  };

  const handleChangeSort = (event) => {
    if (event.target.value === "Name Descending") {
      setSortName("Name Descending");
      setSortValue("category_name");
      setSortType("desc");
      getData("category_name", "desc");
    } else if (event.target.value === "Name Ascending") {
      setSortName("Name Ascending");
      setSortValue("category_name");
      setSortType("asc");
      getData("category_name", "asc");
    }
  };

  return (
    <div>
      <ResponsiveDrawer>
        <Styles>
          <Box className="header">
            <p className="heading">Categories</p>

            <Button
              sx={{
                p: 1,
                fontWeight: 700,
              }}
              className="border-none"
              size="small"
              variant="contained"
              onClick={handleClickOpen}
            >
              Add Category
            </Button>
          </Box>
          <Dialog
            fullScreen={fullScreen}
            open={open}
            onClose={handleClose}
            aria-labelledby="responsive-dialog-title"
          >
            <DialogTitle id="responsive-dialog-title">
              {"Please add name and description for category"}
            </DialogTitle>
            <DialogContent sx={{ py: 3 }}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <form onSubmit={formik.handleSubmit}>
                  <TextField
                    fullWidth
                    name="name"
                    label="Name"
                    size="small"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                    sx={{ my: 1 }}
                  />
                  <TextField
                    fullWidth
                    name="description"
                    label="Description"
                    multiline
                    rows={4}
                    sx={{ my: 1 }}
                    size="small"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.description &&
                      Boolean(formik.errors.description)
                    }
                    helperText={
                      formik.touched.description && formik.errors.description
                    }
                  />
                  <label for="file-upload" className="custom-file-upload">
                    Upload Thumbnail
                  </label>
                  <div>
                    {thumbnailUrl && (
                      <img
                        src={thumbnailUrl}
                        alt="thumnail"
                        style={{
                          margin: "10px 10px 10px 0px",
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
                  { }
                  <LoadingButton
                    type="submit"
                    loading={loading}
                    className="border-none"
                    variant="contained"
                  >
                    Submit
                  </LoadingButton>
                </form>
              </Box>
            </DialogContent>
          </Dialog>
          <Box
            className="wrapper"
            sx={{
              minWidth: 120,
            }}
          >
            <TextField
              onChange={(e) => setName(e.target.value)}
              className="search-input"
              id="outlined-basic"
              label="Search Name"
              size="small"
              variant="outlined"
            />
            <TextField
              sx={{
                ml: 2,
              }}
              onChange={(e) => setDescription(e.target.value)}
              className="search-input"
              size="small"
              id="outlined-basic"
              label="Search Description"
              variant="outlined"
            />
            <FormControl
              sx={{
                ml: 2,
                backgroundColor: "white",
                border: 0,
              }}
            >
              <InputLabel id="demo-simple-select-label">Sort By</InputLabel>
              <Select
                displayEmpty
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Sort By"
                autoWidth
                size="small"
                value={sortName}
                className="select-style"
                onChange={handleChangeSort}
              >
                <MenuItem value="Name Ascending">Name Ascending</MenuItem>
                <MenuItem value="Name Descending">Name Descending</MenuItem>
              </Select>
            </FormControl>
            <Button
              sx={{
                fontWeight: 700,
              }}
              onClick={(e) => getData(sortValue, sortType)}
              className="search-btn border-none"
              type="submit"
              variant="contained"
            >
              Search
            </Button>
          </Box>
          <Box>
            <Dialog
              open={deleteDialogueOpen}
              onClose={handleCloseDeleteDialogue}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {"Delete Category ?"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  All the paid videos in this category will also be deleted, Are you
                  sure you want to continue ?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  style={{
                    color: "red",
                  }}
                  onClick={handleCloseDeleteDialogue}
                >
                  Discard
                </Button>

                <Button
                  style={{
                    color: "green",
                  }}
                  className="delete-btn"
                  onClick={(e) => {
                    deleteCategory(deleteId);
                  }}
                >
                  Delete Category
                </Button>
              </DialogActions>
            </Dialog>
            {!responseStatus ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <h4 style={{ marginTop: "20px" }}>Sorry, No Category Found!</h4>
              </div>
            ) : loader ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <CircularProgress
                  style={{
                    marginTop: "30px",
                  }}
                />
              </div>
            ) : (
              <Box className="table-wrap">
                <Table
                  setData={setallCategories}
                  columns={columns}
                  data={allCategories}
                />
                <Box className="pagination">
                  <Button
                    className="border-none"
                    size="large"
                    variant="text"
                    onClick={decreaseSkip}
                  >
                    {"< pre"}
                  </Button>
                  <p className="">{skip}</p>
                  <Button
                    className="border-none"
                    size="large"
                    variant="text"
                    onClick={increaseSkip}
                  >
                    {"next >"}
                  </Button>
                  <p> Total Pages : {Math.ceil(count / limit)}</p>
                </Box>
              </Box>
            )}
          </Box>
        </Styles>
      </ResponsiveDrawer>
    </div>
  );
};

export default Categories;

const Styles = styled.section`
  .vid-icon {
    margin-left: 17px;
  }
  .header {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    margin-top: 40px;
    padding: 10px 20px 10px 15px;
    background-color: white;
    border-radius: 5px;
  }

  .heading {
    font-weight: 500;
  }

  .select-style {
    font-size: 12px !important;
    height: 100%;
  }

  .wrapper {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }

  .search-btn {
    margin-left: 8px;
    border: none !important;
  }

  .search-input {
    background-color: white;
  }

  .table-wrap {
    width: calc(100vw-10rem);
    overflow-x: auto;
  }

  .border-none {
    border: none !important;
  }
  .border-none:hover {
    background-color: white !important;
    color: black !important;
  }
  .pagination {
    padding: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .icon-space {
    margin-right: 20px;
  }
  .text-description {
    text-align: center;
    width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2; /* number of lines to show */
    -webkit-box-orient: vertical;
  }
`;
