import React, { useState, useEffect } from "react";
import ResponsiveDrawer from "../../pages/Admin/Admin";
import "@pathofdev/react-tag-input/build/index.css";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import styled from "styled-components";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Axios from "../../api/Axios";
import { Link, useSearchParams } from "react-router-dom";
import Table from "./TableContainer";
import UploadVideo from "./UploadVideo";
import { useLocation } from "react-router-dom";
import {
  deleteVideoRoute,
  viewAllCategories,
  searchVideoRoute,
} from "../../api/Url";
import Swal from "sweetalert2";

const Videos = (props) => {
  const [skip, setSkip] = React.useState(0);
  const [count, setCount] = React.useState();
  const [limit, setLimit] = React.useState(10);
  const [allVideos, setAllVideos] = useState([]);
  const [layout, setlayout] = useState(true);
  const [responseStatus, setResponseStatus] = useState(true);
  const [videoFile, setvideoFile] = useState();
  const [VideoSrc, setVideoSrc] = useState(null);
  const [deleteDialogueOpen, setDeleteDialogueOpen] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState();
  const [category, setCategory] = React.useState("");
  const [categories, setCategories] = React.useState([]);
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [sortName, setSortName] = React.useState("Title Ascending");
  const [sortValue, setSortValue] = React.useState("title");
  const [sortType, setSortType] = React.useState("asc");
  const [search, setSearch] = useSearchParams();
  const location = useLocation();

  useEffect(() => {
    // console.log(location);
    if (location.state != null) {
      // console.log(location.state.category, "category");
      setCategory(location.state.category);
      getDataFromCategory(location.state.category);
    } else {
      getData(sortValue, sortType);
    }
  }, [skip, search]);

  const handleClickOpenDeleteDialogue = (id) => {
    setDeleteDialogueOpen(true);
    setDeleteId(id);
  };

  const handleCloseDeleteDialogue = () => {
    setDeleteDialogueOpen(false);
  };

  const getDataFromCategory = async (value) => {
    console.log(location.state.category);
    setResponseStatus(true);
    setAllVideos([]);
    try {
      const config = {
        headers: {
          Authorization: localStorage.getItem("uToken"),
        },
      };
      const response = await Axios.post(
        searchVideoRoute,
        {
          category_id: value,
          video_title: name,
          video_description: description,
          skip,
          limit,
        },
        config
      );
      setAllVideos(response.data.data);
      setCount(response.data.video_count);
    } catch (e) {
      setAllVideos(e.response.data.data);
      setResponseStatus(e.response.data.status);
    }
    try {
      const headers = {
        headers: {
          Authorization: localStorage.getItem("uToken"),
        },
      };
      const response = await Axios.get(viewAllCategories, headers);
      setCategories(response.data.data);
    } catch (e) {
      console.log(e);
    }
  };

  const getData = async (sortValue, sortType) => {
    setResponseStatus(true);
    try {
      const config = {
        headers: {
          Authorization: localStorage.getItem("uToken"),
        },
      };
      var yourObject = {};
      yourObject[sortValue] = sortType;
      const response = await Axios.post(
        searchVideoRoute,
        {
          sort: yourObject,
          category_id: category,
          video_title: name,
          video_description: description,
          skip,
          limit,
        },
        config
      );
      if(response){
        console.log(response.data, 'cdascas')
        setAllVideos(response.data.data);
        setCount(response.data.video_count);
      }
    } catch (e) {
      setAllVideos(e.response.data.data);
      setResponseStatus(e.response.data.status);
    }
    try {
      const config = {
        headers: {
          Authorization: localStorage.getItem("uToken"),
        },
      };
      const response = await Axios.get(viewAllCategories, config);
      setCategories(response.data.data);
    } catch (e) {
      console.log(e);
    }
  };

  const handleChange = (event) => {
    if (event.target.value === "") {
      setCategory("");
    } else {
      setCategory(event.target.value);
    }
  };

  const handleChangeSort = (event) => {
    if (event.target.value === "Title Descending") {
      setSortName("Title Descending");
      setSortValue("title");
      setSortType("desc");
      getData("title", "desc");
    } else if (event.target.value === "Title Ascending") {
      setSortName("Title Ascending");
      setSortValue("title");
      setSortType("asc");
      getData("title", "asc");
    } else if (event.target.value === "Category Descending") {
      setSortName("Category Descending");
      setSortValue("category_id");
      setSortType("desc");
      getData("category_id", "desc");
    } else if (event.target.value === "Category Ascending") {
      setSortName("Category Ascending");
      setSortValue("category_id");
      setSortType("asc");
      getData("category_id", "asc");
    }
  };

  const columns = [
    {
      Header: "Title",
      accessor: "title",
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
      accessor: "video_thumbnail",
      disableFilters: true,
      Cell: ({ cell: { value } }) => (
        <img alt="thumbnail" style={{ width: "100%" }} src={value} />
      ),
    },
    {
      Header: "Categories",
      accessor: "category_ids",
      disableFilters: true,
      Cell: (props) => {
        const { cell } = props;
        return (
          cell.value.map(item=><p>{item.category_id.category_name}</p>)
        )
      }
    },
    {
      Header: "Action",
      disableFilters: true,
      accessor: "_id",
      Cell: ({ cell: { value } }) => (
        <div className="w-100">
          <Link className="edit-btn" to={`/admin/edit/video/${value}`}>
            <img alt="thumbnail" src={"/images/icons/edit.png"} />
          </Link>
          <Button
            className="delete-btn border-none"
            onClick={(e) => {
              handleClickOpenDeleteDialogue(value);
            }}
          >
            <img alt="thumbnail" src={"/images/icons/delete.png"} />
          </Button>
          <Link className="view-btn" to={`/admin/video/${value}`}>
            <img alt="thumbnail" src={"/images/icons/view.png"} />
          </Link>
        </div>
      ),
    },
  ];

  const deleteVideo = async (id) => {
    const response = await Axios.delete(deleteVideoRoute, {
      data: {
        video_id: id,
      },
      headers: {
        Authorization: localStorage.getItem("uToken"),
      },
    });
    if (response.data.status) {
      window.location.reload();
    }
  };

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

  const uploadFile = async ({ currentTarget: input }) => {
    if (input.files && input.files[0]) {
      const files = input.files[0];
      if (files.type === "video/mp4") {
        const _url = URL.createObjectURL(files);
        var vid = document.createElement("video");
        vid.src = _url;
        vid.ondurationchange = function () {
          if (this.duration <= 0 && this.duration > 840) {
            console.log("duaration", this.duration);
            return Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Video should be atleat 1 sec or less than 14 mins",
              showDenyButton: true,
              denyButtonText: "ok",
              showConfirmButton: false,
            });
          } else {
            console.log("duaration", this.duration);
            const _url = URL.createObjectURL(files);
            setvideoFile(files);
            setlayout(false);
            setVideoSrc(_url);
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
    }
  };

  return (
    <div>
      <ResponsiveDrawer>
        <Styles>
          <Box className="header">
            <p className="heading">Videos</p>
            <Box className="search-btn border-none">
              <label htmlFor="file-upload" className="custom-file-upload">
                Add Video
              </label>
              <input id="file-upload" type="file" onChange={uploadFile} />
            </Box>
          </Box>
          {layout && (
            <Box
              className="wrapper"
              sx={{
                minWidth: 120,
              }}
            >
              <FormControl
                sx={{
                  mr: 2,
                }}
                style={{
                  width: "150px",
                  backgroundColor: "white",
                }}
              >
                <InputLabel id="demo-simple-select-label">Category</InputLabel>
                <Select
                  displayEmpty
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Category"
                  value={category}
                  size="small"
                  onChange={handleChange}
                >
                  <MenuItem className="empty-val" value="All">
                    All
                  </MenuItem>
                  {categories.map((item) => {
                    return (
                      <MenuItem key={item?._id} value={item?._id}>
                        {item?.category_name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              <FormControl
                sx={{
                  mr: 2,
                }}
                style={{
                  width: "150px",
                  backgroundColor: "white",
                }}
              >
                <InputLabel id="demo-simple-select-label">Sort By</InputLabel>
                <Select
                  displayEmpty
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Category"
                  value={sortName}
                  onChange={handleChangeSort}
                  size="small"
                >
                  <MenuItem value="Title Ascending">Title Ascending</MenuItem>
                  <MenuItem value="Title Descending">Title Descending</MenuItem>
                  <MenuItem value="Category Ascending">
                    Category Ascending
                  </MenuItem>
                  <MenuItem value="Category Descending">
                    Category Descending
                  </MenuItem>
                </Select>
              </FormControl>
              <TextField
                onChange={(e) => setName(e.target.value)}
                className="search-input"
                id="outlined-basic"
                label="Search Title"
                variant="outlined"
                size="small"
              />
              <TextField
                sx={{
                  ml: 2,
                }}
                onChange={(e) => setDescription(e.target.value)}
                className="search-input"
                id="outlined-basic"
                label="Search Description"
                variant="outlined"
                size="small"
              />
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
          )}
          <Box>
            {!responseStatus ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <h4 style={{ marginTop: "20px" }}>Sorry, No Video Found!</h4>
              </div>
            ) : allVideos.length === 0 && layout ? (
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
            ) : !layout ? (
              <UploadVideo
                videoFile={videoFile}
                VideoSrc={VideoSrc}
                setlayout={setlayout}
              />
            ) : (
              <>
                <Dialog
                  open={deleteDialogueOpen}
                  onClose={handleCloseDeleteDialogue}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">
                    {"Delete Video ?"}
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      Are you sure you want to continue ?
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
                        deleteVideo(deleteId);
                      }}
                    >
                      Delete Video
                    </Button>
                  </DialogActions>
                </Dialog>
                <Box className="table-wrap">
                  <Table columns={columns} data={allVideos} />
                  {layout && (
                    <>
                      <Box className="pagination">
                        <Button
                          size="large"
                          variant="text"
                          onClick={decreaseSkip}
                          className="border-none"
                        >
                          {"< pre"}
                        </Button>
                        <p className="">{skip}</p>
                        <Button
                          size="large"
                          variant="text"
                          onClick={increaseSkip}
                          className="border-none"
                        >
                          {"next >"}
                        </Button>
                        <p> Total Pages : {Math.ceil(count / limit)}</p>
                      </Box>
                    </>
                  )}
                </Box>
              </>
            )}
          </Box>
        </Styles>
      </ResponsiveDrawer>
    </div>
  );
};

export default Videos;

const Styles = styled.section`
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
  .wrapper {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .search-btn {
    margin-left: 8px;
    border: none !important;
  }
  .search-input {
    background-color: white;
    font-size: 12px !important;
  }
  .empty-val {
    padding: 20px !important;
  }
  .input-font {
    font-size: 12px !important;
  }

  .table-wrap {
    width: calc(100vw-10rem);
    overflow-x: auto;
  }

  input[type="file"] {
    display: none;
  }
  .custom-file-upload {
    display: flex;
    justify-content: flex-end;
    background: #1976d2;
    color: #fff;
    border-radius: 5px;
    margin: 15px 0;
    display: inline-block;
    padding: 6px 12px;
    cursor: pointer;
    transition: 0.5s;
    &:hover {
      background: #fff;
      font-weight: 700;
      color: black;
    }
  }
  .upload {
    display: flex;
    justify-content: flex-end;
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
