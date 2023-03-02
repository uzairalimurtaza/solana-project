import React from "react";
import { contentCreatorStatus } from "../../api/Url";
import Axios from "../../api/Axios";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import LoadingButton from '@mui/lab/LoadingButton';
import { toast } from "react-toastify";
import styled from "styled-components";
import { Link } from "react-router-dom";

const ContentCreatorTable = ({ contentCreatorData, value, getData }) => {

  const [dialogueOpen, setDialogueOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [type, setType] = React.useState('');
  const [id, setId] = React.useState('');

  const statusHandler = async (e, id, status) => {
    const data = {
      channel_id: id,
      user_status: status,
    };
    const config = {
      headers: {
        Authorization: localStorage.getItem("uToken"),
      },
    };
    setLoading(true)
    const response = await Axios.post(contentCreatorStatus, data, config);
    if (response) {
      setLoading(false)
    }
    if (response.data.status) {
      toast.success(value === 1 && type == 'approve' ? 'User Approved' : 'User Rejected', {
        toastId: 'FS1',
      });
      value === 1 && type == 'approve' ? getData(1) : getData(2)
    }
  };

  const blockApprovedUser = async (e, id) => {
    const data = {
      channel_id: id,
      user_status: 3,
    };
    const config = {
      headers: {
        Authorization: localStorage.getItem("uToken"),
      },
    };
    setLoading(true)
    const response = await Axios.post(contentCreatorStatus, data, config);
    if (response) {
      setLoading(false)
    }
    if (response.data.status) {
      getData(2)
      toast.success('User Blocked Successfully', {
        toastId: 'FS2',
      });
    }
  }

  const approveRejectedUser = async (e, id) => {
    const data = {
      channel_id: id,
      user_status: 2,
    };
    const config = {
      headers: {
        Authorization: localStorage.getItem("uToken"),
      },
    };
    const response = await Axios.post(contentCreatorStatus, data, config);
    if (response.data.status) {
      getData(3)
      toast.success('User Approved Successfully', {
        toastId: 'FS3',
      });
    }
  }

  const handleClickOpenDialogue = (id, type) => {
    setDialogueOpen(true);
    setId(id)
    setType(type)
  };

  const handleCloseDialogue = () => {
    setDialogueOpen(false)
  };

  const handleOperation = (e) => {
    if (value === 1 && type == 'approve') {
      statusHandler(e, id, "2");
    }
    else if (value === 1 && type == 'reject') {
      statusHandler(e, id, "3");
    }
    else if (value === 2) {
      blockApprovedUser(e, id);
    }
    else if (value === 3) {
      approveRejectedUser(e, id);
    }
  }

  if (contentCreatorData.length === 0) {
    return (
      <h5>No Data Avaiable</h5>
    )
  }

  return (
    <>
      <Dialog
        open={dialogueOpen}
        onClose={handleCloseDialogue}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Alert!"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to continue ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button style={{
            color: 'red'
          }} onClick={handleCloseDialogue}>Discard</Button>

          <LoadingButton
            style={{
              color: 'green'
            }}
            loading={loading}
            type="submit"
            className="delete-btn btn"
            onClick={e => {
              handleOperation(e)
            }}>
            Continue
          </LoadingButton>
        </DialogActions>
      </Dialog>
      <TableStyles>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Channel Name</th>
              <th scope="col">Channel Type</th>
              {
                value === 2 &&
                <th scope="col">Edit</th>
              }
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {
              contentCreatorData.length > 0 ?
                contentCreatorData.map((item) => {
                  return (
                    <tr>
                      <td>{item?.channel_name || 'not available'}</td>
                      <td>{item?.channel_type || 'not available'}</td>
                      {
                        value === 2 &&
                        <td>
                          <Link className="edit-btn" to={`/admin/edit/channel/${item?._id}`}>
                            <img src={"/images/icons/edit.png"} />
                          </Link>
                        </td>
                      }
                      {
                        value === 1 &&
                        <td>
                          <Button
                            className='border-none'
                            onClick={(e) => {
                              handleClickOpenDialogue(item._id, 'reject')
                            }}
                          >
                            <img style={{ width: "50%" }} src={'/images/icons/reject.png'} />
                          </Button>
                          <Button
                            className='border-none'
                            onClick={(e) => {
                              handleClickOpenDialogue(item._id, 'approve')
                            }}
                          >
                            <img style={{ width: "50%" }} src={'/images/icons/approve.png'} />
                          </Button>
                        </td>
                      }
                      {
                        value === 2 &&
                        <td>
                          <Button
                            className='border-none'
                            onClick={(e) => {
                              handleClickOpenDialogue(item._id)
                            }}

                          >
                            <img style={{ width: "50%" }} src={'/images/icons/reject.png'} />
                          </Button>
                        </td>
                      }
                      {
                        value === 3 &&
                        <td>
                          <Button
                            className='border-none'
                            onClick={(e) => {
                              handleClickOpenDialogue(item._id)
                            }}
                          >
                            <img style={{ width: "50%" }} src={'/images/icons/approve.png'} />
                          </Button>
                        </td>
                      }
                    </tr>
                  )
                }) :
                <tr></tr>
            }
          </tbody>
        </table>
      </TableStyles>
    </>
  );
};

const TableStyles = styled.section`
  td {
    color: whitesmoke;
    border: 0px;
    border-bottom: 2px solid white;
    padding: 10px !important;
    background-color: rgb(61, 77, 102) !important;
    text-align:center !important
  }

  td:nth-child(3) {
    width: 20% !important
  }

  .table-tr {
    border: 2px solid white;
    padding: 15px !important;
    background-color:white !important
  }

  table {
    margin-top:20px;
    border-radius:5px !important;
  }

  th {
    background-color:white!important;
    color:rgb(61, 77, 102) !important;;
    text-align:center !important;
    border: 1px solid rgb(61, 77, 102) !important;
    box-sizing: border-box;
  }

  th:nth-child(1) {
    border-top-left-radius:5px
  }

  th:last-child {
    border-top-right-radius:5px
  }

  .pagination {
    display:flex;
    justify-content:center;
    align-items:center
  }

  .border-none {
    border:none !important
  }

  .border-none:hover {
    background-color: grey !important;
  }
`;

export default ContentCreatorTable;
