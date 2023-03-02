import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Button,
  CircularProgress,
  Pagination,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Axios from "../../../api/Axios";
import { deleteVideoRoute, userUploadedVideos } from "../../../api/Url";
import { ObjectSchema } from "yup";

const AllUserUploadVideos = () => {
  
  const navigate = useNavigate();
  const [myUploadedVideos, setMyUploadedVideos] = useState([]);
  const [skip, setSkip] = React.useState(0);
  // console.log("page", skip);
  const [count, setCount] = React.useState();
  const [limit, setLimit] = React.useState(8);
  const [loading, setLoading] = useState(false);
  const [responseStatus, setResponseStatus] = useState(false);

  useEffect(() => {
    getUploadedVideo();
  }, [skip]);

  const getUploadedVideo = async () => {
    setLoading(true);
    setResponseStatus(true);
    try {
      const headers = {
        headers: {
          Authorization: localStorage.getItem("uToken"),
        },
      };
      const response = await Axios.post(
        userUploadedVideos,
        {
          skip,
          limit,
        },
        headers
      );
      if (response) {
        // console.log(response.data,'in all user')
        setMyUploadedVideos(response.data.data);
        setLoading(false);
        setResponseStatus(response.data.status);
        setCount(response.data.video_count);
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
      setResponseStatus(err.response.data.status);
    }
  };
  const DeleteVideoHandler = (videoID, index_num) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "var(--green-color)",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // console.log("SDfsf");
        try {
          const Filter_name = myUploadedVideos.filter((item, index) => {
            // console.log(index, index_num);
            return parseInt(index) !== parseInt(index_num);
          });
          // console.log(Filter_name);
          var obj = { ...myUploadedVideos };
          obj["array"] = Filter_name;
          setMyUploadedVideos(Filter_name);
          const response = Axios.delete(deleteVideoRoute, {
            data: {
              video_id: videoID,
            },
          });
        } catch (e) {
          console.log(e);
        }
      }
    });
  };

  return loading ? (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          py: 5,
          height: "53vh",
          alignItems: "center",
        }}
      >
        <CircularProgress color="secondary" />
      </Box>
    </>
  ) : (
    <UserVideosStyled>
      {myUploadedVideos.length > 0 ? (
        <Box className="table-wrap">
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow sx={{ background: "var(--green-color)" }}>
                  <TableCell>Thumbnail</TableCell>
                  <TableCell align="right">Title</TableCell>
                  <TableCell align="right">Description</TableCell>
                  <TableCell align="right">Category</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {myUploadedVideos.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell component="th" scope="row">
                      <img src={row.video_thumbnail} />
                    </TableCell>
                    <TableCell align="right">{row.title}</TableCell>
                    <TableCell align="right">{row.description}</TableCell>
                    <TableCell align="right">
                      {row?.category_info.map(item=><p>{item.category_name}</p>)}
                    </TableCell>
                    <TableCell align="right">
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          alignItems: "center",
                        }}
                      >
                        <Box
                          onClick={() => {
                            navigate(`/my_videos/edit/${row._id}`);
                          }}
                        >
                          <EditIcon className="edit" />
                        </Box>
                        <Box
                          onClick={(e) => {
                            DeleteVideoHandler(row._id, index);
                          }}
                        >
                          <DeleteIcon className="delete" />
                        </Box>
                        <Box
                          onClick={() => {
                            navigate(`/video/${row._id}`);
                          }}
                        >
                          <VisibilityIcon className="view" />
                        </Box>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              pt: 2,
            }}
          >
            <Box className="pagination">
              <Pagination
                count={Math.ceil(count / limit)}
                color="secondary"
                variant="outlined"
                page={skip + 1}
                onChange={(e, value) => setSkip(value - 1)}
              />
            </Box>
            <Typography variant="body" sx={{ color: "#fff", pl: 3 }}>
              Total Videos : {count}
            </Typography>
          </Box>
        </Box>
      ) : (
        <Box sx={{ background: "#000" }}>
          <Typography variant="h3" sx={{ color: "#fff" }}>
            No Data
          </Typography>
        </Box>
      )}
    </UserVideosStyled>
  );
};

export default AllUserUploadVideos;

const UserVideosStyled = styled.section`
  .pagination {
    .css-1v2lvtn-MuiPaginationItem-root {
      color: #fff;
    }
    .Mui-selected {
      background: var(--green-color) !important;
      color: #fff !important;
    }
    button {
      color: #fff !important;
      border-color: #fff !important;
    }
  }

  .edit {
    color: var(--green-color);
    cursor: pointer;
    transition: 0.5s;
    &:hover {
      opacity: 0.8;
    }
  }
  .delete {
    color: red;
    cursor: pointer;
    margin: 0 5px;
    transition: 0.5s;
    &:hover {
      opacity: 0.8;
    }
  }
  .view {
    color: var(--purple-color);
    cursor: pointer;
    transition: 0.2s;
    &:hover {
      opacity: 0.5;
    }
  }

  img {
    width: 100%;
    max-width: 178px;
    height: 100px;
    object-fit: fill;
    border-radius: 10px;
  }
  tbody {
    background: #000;
    color: #ffff;
  }
  td {
    color: #ffff;
  }
`;
