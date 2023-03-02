import React, { useState, useEffect } from "react";
import ResponsiveDrawer from "../../pages/Admin/Admin";
import "@pathofdev/react-tag-input/build/index.css";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from '@mui/material/CircularProgress';
import styled from "styled-components";
import { deleteUserRoute, searchUserRoute } from "../../api/Url";
import Table from './TableContainer'
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import TextField from "@mui/material/TextField";
import DialogTitle from "@mui/material/DialogTitle";
import Axios from "../../api/Axios";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';

const Videos = () => {

  const [skip, setSkip] = React.useState(0);
  const [count, setCount] = React.useState()
  const [limit, setLimit] = React.useState(10)
  const [status, setStatus] = useState(true);
  const [keyword, setKeyword] = useState('')
  const [allUsers, setAllUsers] = useState([]);
  const [deleteDialogueOpen, setDeleteDialogueOpen] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState();
  const [username, setUsername] = React.useState('');
  const [sortName, setSortName] = React.useState('CreatedAt Ascending');
  const [sortValue, setSortValue] = React.useState('createdAt');
  const [sortType, setSortType] = React.useState('asc');

  const handleClickOpenDeleteDialogue = (id) => {
    setDeleteDialogueOpen(true);
    setDeleteId(id)
  };

  const handleCloseDeleteDialogue = () => {
    setDeleteDialogueOpen(false);
  };

  useEffect(() => {
    getData(sortValue, sortType);
  }, [skip]);

  const getData = async (sortValue, sortType) => {
    // console.log(skip)
    setStatus(true)
    setAllUsers([])
    const config = {
      headers: {
        Authorization: localStorage.getItem("uToken"),
      },
    };
    try {
      var yourObject = {};
      yourObject[sortValue] = sortType;
      const response = await Axios.post(searchUserRoute, {
        sort: yourObject,
        user_name: username,
        skip,
        limit
      },config);
      setAllUsers(response.data.data);
      setCount(response.data.count)
    } catch (e) {
      console.log(e);
      setStatus(e.response.data.status)
      setAllUsers(e.response.data.data)
    }
  };

  const handleChangeSort = (event) => {
    if (event.target.value === 'CreatedAt Ascending') {
      setSortName('CreatedAt Ascending')
      setSortValue('createdAt')
      setSortType('asc')
      getData("createdAt", "asc")
    }
    else if (event.target.value === 'CreatedAt Descending') {
      setSortName('CreatedAt Descending')
      setSortValue('createdAt')
      setSortType('desc')
      getData("createdAt", "desc")
    }
  };

  const deleteUser = async (id) => {
    const response = await Axios.delete(deleteUserRoute, {
      data: {
        user_id: id
      },
      headers: {
        Authorization: localStorage.getItem("uToken"),
      }
    });
    if (response.data.status) {
      window.location.reload()
    }
  }

  const increaseSkip = () => {
    if (skip + 1 < (count / limit)) {
      setSkip(skip + 1)
    }
  }

  const decreaseSkip = () => {
    if (skip === 0) {
      setSkip(0)
    } else {
      setSkip(skip - 1)
    }
  }

  const columns = [
    {
      Header: "Username",
      accessor: "user_name",
      disableFilters: true,
      Cell: ({ cell: { value } }) => <p>{value || 'not available'}</p>
    },
    {
      Header: "Bio",
      accessor: "user_bio",
      disableFilters: true,
      Cell: ({ cell: { value } }) => <p>{value || 'not available'}</p>
    },
    {
      Header: "Status",
      accessor: "user_status",
      disableFilters: true,
      Cell: ({ cell: { value } }) =>
        <>
          {
            value === "0" ?
              <p>User</p> :
              value === "1" ?
                <p>Requested</p> :
                value === "2" ?
                  <p>Content Creator</p> :
                  <p>Rejected</p>
          }
        </>
    },
    {
      Header: "Joining Date",
      accessor: "createdAt",
      disableFilters: true,
      Cell: ({ cell: { value } }) =>
        <>
          <p>
            {
              value.toString().slice(0, 10)
            }
          </p>
        </>
    },
    {
      Header: "Action",
      disableFilters: true,
      accessor: "_id",
      Cell: ({ cell: { value } }) =>
        <>
          <Button
            className="delete-btn border-none"
            onClick={e => {
              handleClickOpenDeleteDialogue(value)
            }
            }
          >
            <img style={{ width: "50%" }} src={'/images/icons/delete.png'} />
          </Button>
        </>
    },
  ];

  return (
    <div>
      <ResponsiveDrawer>
        <Styles>
          <Box sx={{ 
              display: "flex", 
              alignItems: 'center', 
              marginTop: '40px', 
              padding: '10px 20px 10px 15px', 
              backgroundColor: 'white', 
              borderRadius: '5px' 
            }}>
            <p style={{ 
              fontWeight: '500', 
              flexGrow: 1 
            }}>Users</p>
          </Box>
          <Box className="wrapper" sx={{
            minWidth: 120,
          }}>
            <FormControl
              sx={{
                mr: 2
              }}
              style={{
                width: "150px",
                backgroundColor: 'white'
              }}
            >
              <InputLabel id="demo-simple-select-label">Sort By</InputLabel>
              <Select
                displayEmpty
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Category"
                value={sortName}
                size="small"
                onChange={handleChangeSort}
                className="select-font"
              >
                <MenuItem value="CreatedAt Ascending" >Joining Date Asc</MenuItem>
                <MenuItem value="CreatedAt Descending" >Joining Date Desc</MenuItem>
              </Select>
            </FormControl>
            <TextField
              onChange={e => setUsername(e.target.value)}
              className="search-input"
              id="outlined-basic"
              label="Search  Username"
              variant="outlined"
              size="small"
            />
            <Button
              sx={{
                ml: 2,
                fontWeight: 700
              }} onClick={e => getData(sortValue, sortType)} className="search-btn border-none" type="submit" variant="contained"
            >
              Search
            </Button>
          </Box>
          <Box>
            {!status ?
              <div style={{
                display: 'flex',
                justifyContent: 'center'
              }}>
                <h4 style={{ marginTop: '20px' }}>Sorry, No User Found!</h4>
              </div> :
              allUsers.length === 0 ?
                <div style={{
                  display: 'flex',
                  justifyContent: 'center'
                }}>
                  <CircularProgress
                    style={{
                      marginTop: '30px',
                    }}
                  />
                </div> :
                <>
                  <Dialog
                    open={deleteDialogueOpen}
                    onClose={handleCloseDeleteDialogue}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <DialogTitle id="alert-dialog-title">
                      {"Delete User ?"}
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText id="alert-dialog-description">
                        Are you sure you want to continue ?
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button style={{
                        color: 'red'
                      }} className='border-none' onClick={handleCloseDeleteDialogue}>Discard</Button>

                      <Button style={{
                        color: 'green'
                      }} className="delete-btn border-none" onClick={e => {
                        deleteUser(deleteId)
                      }}>
                        Delete User
                      </Button>
                    </DialogActions>
                  </Dialog>
                  <Box className="table-wrap">
                    <Table columns={columns} data={allUsers} />
                    <Box className="pagination" >
                      <Button className='border-none' size='large' variant="text" onClick={decreaseSkip}>{"< pre"}</Button>
                      <p className="" >{skip}</p>
                      <Button className='border-none' size='large' variant="text" onClick={increaseSkip}>{"next >"}</Button>
                      <p> Total Pages : {Math.ceil(count/limit)}</p>
                    </Box>
                  </Box>
                </>
            }
          </Box>
        </Styles>
      </ResponsiveDrawer>
    </div>
  )
};

export default Videos;

const Styles = styled.section`
  .select-font {
    font-size:12px !important;
    height:100%
  }
  .table-wrap {
    width: calc(100vw-10rem);
    overflow-x: auto;
  }

  .wrapper {
    margin-top:20px;
    display: flex;
    justify-content:center;
  }

  .search-btn {
    margin-left:8px;
    border:none !important
  }

  .search-input {
    background-color:white;
  }

  .border-none {
    border: none !important;
  }

  .border-none:hover {
    background-color: white !important;
    color:black !important
  }

  .pagination {
    padding:20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;
