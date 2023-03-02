import React, { useState, useEffect, useContext } from 'react'
import styled from "styled-components";
import Box from '@mui/material/Box';
import {
  Grid,
  Card,
  CardActions,
  Button,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import { io } from "socket.io-client";
import { ReactComponent as LivestreamIcon } from '../../assets/icons/livestream.svg'
import { ReactComponent as VideoStreamIcon } from '../../assets/icons/video-stream-type-icon.svg'
import { getToken, createMeeting, validateMeeting } from '../../api/VideoApi';
import { imgUrl, isContentCreator } from '../../api/Url';
import { useNavigate } from "react-router-dom";
import MainContext from "../../Context/MainContext.jsx";
import ConnectMessage from "../../components/UserLayout/Wallet/ConnectMessage";
import { toast } from "react-toastify";
import axios from 'axios';
import LoadingButton from "@mui/lab/LoadingButton";


const socket = io(imgUrl, {
  withCredentials: false,
});

const Streams = () => {
  useEffect(() => {
    localStorage.setItem('display', '')
  }, [])

  const navigate = useNavigate()
  const { walletIsConnected } = useContext(MainContext);

  const AvailableLivestreams = () => {

    const [videoStreams, setVideoStreams] = useState([]);
    const [audioStreams, setAudioStreams] = useState([]);

    useEffect(() => {
      socket.emit('view-live-streams', {})
      socket.on('view-audio-stream', (resp) => {
        // console.log(resp)
        if (!resp?.status) {
          setAudioStreams([])
        }
        else {
          setAudioStreams(resp.streams)
        }
      })
      socket.on('view-video-stream', (resp) => {
        if (!resp?.status) {
          setVideoStreams([])
        }
        else {
          setVideoStreams(resp.streams)
        }
      })
      // socket.on('livestream-created', (resp) => {
      //  console.log(resp,'dasdasd')
      // })
      return () => {
        socket.emit('discconnect')
      }
    }, [])

    const navigateToVideoLivestream = async (_meetingId) => {
      try {
        const id = localStorage.getItem('user_id')
        axios.post(isContentCreator, {
          user_id: id,
          type: 'viewer'
        })
          .then(async (res) => {
            if (res?.data?.status) {
              navigate(`/join/${_meetingId}`)
            }
            else {
              toast.error('please complete your profile to continue', {
                toastId: 'CPE1',
              })
            }
          })
          .catch((err) => {
            console.log(err)
            toast.error('sorry, could not join the meeting at this time', {
              toastId: 'ME1',
            })
          })

      } catch (error) {
        console.log(error.data, 'eqweqwe  ')
      }
    }

    const navigateToAudioLivestream = async (_meetingId) => {
      try {
        const id = localStorage.getItem('user_id')
        axios.post(isContentCreator, {
          user_id: id,
          type: 'viewer'
        })
          .then(async (res) => {
            if (res?.data?.status) {
              navigate(`/audio/join/${_meetingId}`)
            }
            else {
              toast.error('please complete your profile to continue', {
                toastId: 'CPE2',
              })
            }
          })
          .catch((err) => {
            console.log(err)
            toast.error('sorry, could not join the meeting at this time', {
              toastId: 'ME2',
            })
          })

      } catch (error) {
        console.log(error.data, 'eqweqwe  ')
      }
    }

    return (
      <StreamStyles>
        <Typography
          variant="h6"
          sx={{ color: "var(--green-color)", fontWeight: "bold", ml: 4, mb: 2, mt: 1 }}
        >
          Video Streams
        </Typography>
        <Grid container spacing={4} sx={{ p: 3 }}>
          {
            videoStreams.length > 0 ?
              videoStreams.map((item, index) => (
                <Grid
                  item
                  xs={12}
                  md={3}
                  style={{ paddingTop: 0 }}
                  sx={{
                    px: 1,
                  }}
                  key={index}
                  onClick={() => navigateToVideoLivestream(item.meeting_id)}
                >
                  <Box className="stream_box grounded-radiants">
                    <img
                      src={'../images/recommended2.png'}
                      alt=""
                      className="creator-img"
                    />
                    <VideoStreamIcon className='video-icon' />
                  </Box>
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: "#9E9E9E",
                        textTransform: "uppercase",
                        fontWeight: "bold",
                        textAlign: "center",
                        mt: 1,
                        "&:hover": {
                          cursor: 'pointer'
                        }
                      }}
                    >
                      {item?.channel.channel_name}
                    </Typography>
                  </Box>
                </Grid>
              )) :
              <Grid
                className='text-center text-white mt-4'
                item
                xs={12}
                md={12}
                sx={{
                  px: 1,
                }}
              >
                <Box>
                  <h6>No Video Livestreams Available</h6>
                </Box>
              </Grid>
          }
        </Grid>
        <Typography
          variant="h6"
          sx={{ color: "var(--green-color)", fontWeight: "bold", ml: 4, mb: 2 }}
        >
          Audio Streams
        </Typography>
        <Grid container spacing={4} sx={{ p: 3 }}>
          {
            audioStreams.length > 0 ?
              audioStreams.map((item, index) => (
                <Grid
                  item
                  xs={12}
                  md={3}
                  sx={{
                    px: 1,
                  }}
                  style={{ paddingTop: 0 }}
                  key={index}
                  onClick={() => navigateToAudioLivestream(item.meeting_id)}
                >
                  <Box className="stream_box grounded-radiants">
                    <img
                      src={'./images/recommended2.png'}
                      alt=""
                      className="creator-img"

                    />
                    <VideoStreamIcon className='video-icon' />
                  </Box>
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: "#9E9E9E",
                        textTransform: "uppercase",
                        fontWeight: "bold",
                        textAlign: "center",
                        mt: 1,
                        "&:hover": {
                          cursor: 'pointer'
                        }
                      }}
                    >
                      {item?.channel.channel_name}
                    </Typography>
                  </Box>
                </Grid>
              )) :
              <Grid
                className='text-center text-white mt-4'
                item
                xs={12}
                md={12}
                sx={{
                  px: 1,
                }}
              >
                <Box>
                  <h6>No Audio Livestreams Available</h6>
                </Box>
              </Grid>
          }
        </Grid>
      </StreamStyles>
    )
  }

  const CreateLivestream = () => {

    const [createMeetingLoader, setCreateMeetingLoader] = useState(false);
    const [createAudioMeetingLoader, setCreateAudioMeetingLoader] = useState(false);
    const [open, setOpen] = React.useState(false);

    const navigate = useNavigate()

    React.useEffect(() => {
      socket.on("connect", () => {
        console.log(socket.connected); // true
        console.log(socket.id); // true
      });
      socket.on("livestream-created", (resp) => {
        console.log(resp.type,'dasdasdas')
        if(resp.type == 'video'){
          navigate(`/live/${resp?.meeting_id}`)
        }
        else if( resp.type == 'audio'){
          navigate(`/audio/live/${resp?.meeting_id}`)
        }
      })
      return () => {
        socket.emit('discconnect')
      }
    }, [])

    const handleCreateMeetingDialogue = () => {
      setOpen(false);
    };

    const getProvider = () => {
      if ("solana" in window) {
        const anyWindow = window;
        const provider = anyWindow.solana;
        if (provider.isPhantom) {
          return provider;
        }
      }
      window.open("https://phantom.app/", "_blank");
    };

    const provider = getProvider();

    const createMeetingForLiveStream = async () => {
      setCreateMeetingLoader(true)
      try {
        const id = localStorage.getItem('user_id')
        axios.post(isContentCreator, {
          user_id: id,
          id: provider.publicKey,
          type: 'host'
        })
          .then(async (res) => {
            // console.log(res, 'dadas')
            const token = await getToken();
            const _meetingId = await createMeeting({ token: String(token), type: 'video' });
            const valid = await validateMeeting({ meetingId: _meetingId, token, type: 'stream' });
            if (valid) {

              const id = localStorage.getItem('user_id')
              const name = localStorage.getItem('user_name')
              localStorage.setItem('room', _meetingId)
              localStorage.setItem('display', `${id}-host-${name}`)

              socket.emit("save-meeting-id", {
                user_id: id,
                meeting_id: _meetingId,
                room_id: _meetingId,
                display_name: `${id}-host-${name}`,
                type: 'video'
              });
            }
          })
          .catch((err) => {
            console.log(err)
            setCreateMeetingLoader(false)
            toast.error(err.response.data.message, {
              toastId: 'ME3',
            })
          })
      } catch (error) {
        console.log(error.data, 'eqweqwe  ')
      }
    }

    const createMeetingForAudioLivestream = async () => {
      setCreateAudioMeetingLoader(true)
      try {
        const id = localStorage.getItem('user_id')
        axios.post(isContentCreator, {
          user_id: id,
          id: provider.publicKey,
          type: 'host'
        })
          .then(async (res) => {
            // console.log(res.data, 'dadas')
            const token = await getToken();
            const _meetingId = await createMeeting({ token: String(token), type: 'audio' });
            const valid = await validateMeeting({ meetingId: _meetingId, token, type: 'stream' });
            if (valid) {
              const id = localStorage.getItem('user_id')
              const name = localStorage.getItem('user_name')
              localStorage.setItem('room', _meetingId)
              localStorage.setItem('display', `${id}-host-${name}`)

              socket.emit("save-meeting-id", {
                user_id: id,
                meeting_id: _meetingId,
                room_id: _meetingId,
                display_name: `${id}-host-${name}`,
                type: 'audio'
              });
            }
          })
          .catch((err) => {
            console.log(err.response.data)
            setCreateAudioMeetingLoader(false)
            toast.error(err.response.data.message, {
              toastId: 'ME4',
            })
          })

      } catch (error) {
        console.log(error.data, 'eqweqwe  ')
      }
    }

    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: 'center',
          backgroundColor: '#454746',
          height: '50px',
          borderRadius: '10px',
          mx: 4
        }}
      >
        {
          <>
            <LivestreamIcon
              className='stream-icon'
            />
            <Typography
              variant="p"
              sx={{
                color: 'white',
                fontWeight: "bold",
                "&:hover": {
                  cursor: 'pointer'
                }
              }}
              onClick={e => { setOpen(true) }}
            >
              START LIVE STREAM
            </Typography>
            <Dialog
              className="dialogue"
              open={open}
              aria-labelledby="responsive-dialog-title"
              onClose={handleCreateMeetingDialogue}
            >
              <DialogTitle id="responsive-dialog-title">
                {"Create New Livestream"}
              </DialogTitle>
              <DialogContent sx={{ py: 3, width: "350px" }}>
                <Card
                  sx={{ minWidth: 275, mt: 1, bgcolor: "#1EDA6B", color: "white" }}
                >
                  <CardActions sx={{ justifyContent: 'center' }} >
                    <LoadingButton
                      sx={{ color: "white" }}
                      loading={createMeetingLoader}
                      size="small"
                      onClick={createMeetingForLiveStream}
                    >
                      Create Video Livestream
                    </LoadingButton>
                  </CardActions>
                </Card>
                <Card
                  sx={{ minWidth: 275, mt: 1, bgcolor: "#B624F4", color: "white" }}
                >
                  <CardActions sx={{ justifyContent: 'center' }}>
                    <LoadingButton
                      className='border-0'
                      sx={{ color: "white", textAlign: "center" }}
                      loading={createAudioMeetingLoader}
                      onClick={createMeetingForAudioLivestream}
                      size="small"
                    >
                      Create Audio Livestream
                    </LoadingButton>
                  </CardActions>
                </Card>
              </DialogContent>
              <DialogActions>
                <Button
                  style={{
                    color: "red",
                  }}
                  className="delete-btn"
                  onClick={() => setOpen(false)}
                >
                  CANCEL
                </Button>
              </DialogActions>
            </Dialog>
          </>
        }
      </Box>
    )
  }

  return (
    <div>
      {
        walletIsConnected ? (
          <>
            <StreamStyles>
              <CreateLivestream />
              <AvailableLivestreams />
            </StreamStyles>
          </>
        ) :
          (
            <ConnectMessage />
          )
      }
    </div>
  )
}

const StreamStyles = styled.section`
  .MuiButton-root {
    border: 0 !important
  }
  .border-0 {
    border:0 !important
  }
  .creator-img {
    width: 100%;
    border-radius: 36px;
    height: 200px;
    object-fit: cover;
  }

  .video-icon {
    position: absolute;
    z-index: 999;
    margin: 0 auto;
    left: 0;
    right: 0;
    top: 10%; /* Adjust this value to move the positioned div up and down */
    text-align: center;
    width: 60%; 
  }

  .stream_box {
    cursor: pointer;
  }

	.stream-icon {
		margin-right:8px;				
	}

	.border-gradient-green {
    border: 10px solid;
    border-radius: 10px;
    border-image: linear-gradient(to bottom, rgba(182, 36, 244, 1) 1%, rgba(30, 218, 107, 1) 100%);
    border-image-slice: 1;
	}
  .grounded-radiants {
    position: relative;
    border: 4px solid transparent;
    padding:10px;
    border-radius: 36px;
    background: linear-gradient(to bottom, rgba(182, 36, 244, 1) 1%, rgba(30, 218, 107, 1) 100%);;
    background-clip: padding-box;
  }

  .grounded-radiants::after {
    padding:10px;
    position: absolute;
    top: -4px; bottom: -4px;
    left: -4px; right: -4px;
    background: linear-gradient(to left, rgba(182, 36, 244, 1) 1%, rgba(30, 218, 107, 1) 100%);;
    content: '';
    z-index: -1;
    border-radius: 36px;
  }
`;


export default Streams