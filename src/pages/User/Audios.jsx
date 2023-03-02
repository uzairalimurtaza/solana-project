import React, { useState, useEffect, useRef } from 'react'
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Card, Button } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import styled from "styled-components";
import PersonIcon from '@mui/icons-material/Person';
import { red } from "@material-ui/core/colors";
import {
  MeetingProvider,
  useMeeting,
  useParticipant,
} from "@videosdk.live/react-sdk";
import { getToken, validateMeeting } from '../../api/VideoApi';
import { getStream } from '../../api/Url'
import { io } from "socket.io-client";
import { imgUrl } from '../../api/Url';
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from 'axios'
import { isHost } from '../../utils/common';
import { Beforeunload } from 'react-beforeunload';
import { toast } from 'react-toastify'
import CircularProgress from '@mui/material/CircularProgress';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import usePrompt from '../../utils/usePrompt';
import MicSharpIcon from '@mui/icons-material/MicSharp';
import MicOffSharpIcon from '@mui/icons-material/MicOffSharp';
import Popper from '@mui/material/Popper';
import Fade from '@mui/material/Fade';
import Paper from '@mui/material/Paper';
import ReactionEmoji from "../../assets/icons/emoji.png"
import AngryEmoji from "../../assets/icons/angry.png"
import SadEmoji from "../../assets/icons/sad.png"
import HappyEmoji from "../../assets/icons/happy.png"

const socket = io(imgUrl, {
  withCredentials: false,
});

const chunk = (arr) => {
  const newArr = [];
  while (arr.length) newArr.push(arr.splice(0, 3));
  return newArr;
};

const ParticipantView = ({ participantId }) => {

  const micRef = useRef(null);

  const {
    displayName,
    micStream,
    micOn,
  } = useParticipant(participantId, {
  });

  useEffect(() => {
    if (micRef.current) {
      if (micOn) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(micStream.track);

        micRef.current.srcObject = mediaStream;
        micRef.current
          .play()
          .catch((error) =>
            console.error("mic  play() failed", error)
          );
      } else {
        micRef.current.srcObject = null;
      }
    }
  }, [micStream, micOn]);

  return (
    <>
      <PersonIcon fontSize="large" sx={{ color: 'white' }} />
      <Typography
        variant="h6"
        component="div"
        sx={{
          color: "white",
          fontFamily: "Poppins",
          textAlign: "center",
          fontSize: "15px",
          mt: 0.5,
        }}
      >
        {String(displayName).split("-")[2]}
      </Typography>
    </>
  )
};

const LiveNow = () => {

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [placement, setPlacement] = React.useState();

  const [happyReactions,setHappyReactions]= React.useState()
  const [sadReactions,setSadReactions]= React.useState()
  const [angryReactions,setAngryReactions]= React.useState()

  const handleClick = (newPlacement) => (event) => {
    setAnchorEl(event.currentTarget);
    setOpen((prev) => placement !== newPlacement || !prev);
    setPlacement(newPlacement);
  };

  function onParticipantLeft(participant) {
    console.log(" onParticipantLeft", participant);
  }

  const { participants, end, leave, meetingId, localParticipant } = useMeeting({ onParticipantLeft })
  const { pathname } = useLocation()

  const navigate = useNavigate()

  useEffect(() => {
    socket.emit('reaction-count', {
      meeting_id:meetingId || localStorage.getItem('room'),
      room_id: localStorage.getItem('room'),
    })
    socket.on("latest-reactions-count",(payload)=>{
      console.log(payload,'lerwerw')
      setSadReactions(payload.data.sad_reaction_count)
      setHappyReactions(payload.data.happy_reaction_count)
      setAngryReactions(payload.data.angry_reaction_count)
    })
    socket.on("user-reactions-updated", (payload) => {
      console.log(payload,'dasdasdafasd')
      setSadReactions(payload.data.sad_reaction_count)
      setHappyReactions(payload.data.happy_reaction_count)
      setAngryReactions(payload.data.angry_reaction_count)
    })
    socket.on('meeting-end', (payload) => {
      if (payload.status) {
        navigate('/streams')
      }
    })
  }, [meetingId])

  const leaveMeetingAndClose = () => {
    // console.log('listernig =to event')
  }

  const leaveMeetingAndCloseSec = () => {
    let display = localStorage.getItem('display');
    const myArray = String(display).split("-");
    const id = localStorage.getItem('user_id')
    const name = localStorage.getItem('user_name')
    if (myArray[1] === 'host') {
      // console.log(myArray)
      console.log('here in leaveMeetingAndCloseSec1')
      localStorage.setItem('display', `${id}-viewer-${name}`)
      end()
      socket.emit("end-meeting", {
        meeting_id: meetingId
      });
    }
    else if (myArray[1] === 'cohost') {
      console.log('here in leaveMeetingAndCloseSec2')
      socket.emit('remove-user', {
        meeting_id: localStorage.getItem('room'),
        display_name: localStorage.getItem('display')
      })
      localStorage.setItem('display', `${id}-viewer-${name}`)

      leave()
    }
    else if (myArray[1] === 'viewer') {
      // console.log(myArray)
      console.log('here in leaveMeetingAndCloseSec3')
      localStorage.setItem('display', `${id}-viewer-${name}`)
      leave()
    }
  }

  const leaveMeeting = () => {
    const id = localStorage.getItem('user_id')
    const name = localStorage.getItem('user_name')

    if (!isHost(pathname)) {
      localStorage.setItem('display', `${id}-viewer-${name}`)
      leave()
      navigate('/streams')
    }
    else {
      end()
      socket.emit("end-meeting", {
        meeting_id: meetingId,
        display_name: localStorage.getItem('display')
      });
      localStorage.setItem('display', `${id}-viewer-${name}`)
      navigate('/streams')
    }
  }

  const requestToShare = () => {
    const id = localStorage.getItem('user_id')
    const name = localStorage.getItem('user_name')
    socket.emit('user-requested', {
      display_name: `${id}-viewer-${name}`,
      user_id: localStorage.getItem('user_id'),
      meeting_id: meetingId,
      room_id: localStorage.getItem('room')
    })
  }

  const addHappyReaction = () => {
    socket.emit("user-reactions",{
      room_id:localStorage.getItem('room'),
      meeting_id:meetingId || localStorage.getItem('room'),
      user_id:localStorage.getItem('user_id'),
      type:'happy'
    })
  }
  
  const addSadReaction = () => {
    socket.emit("user-reactions",{
      room_id:localStorage.getItem('room'),
      meeting_id:meetingId,
      user_id:localStorage.getItem('user_id'),
      type:'sad'
    })
  }

  const addAngryReaction = () => {
    socket.emit("user-reactions",{
      room_id:localStorage.getItem('room'),
      meeting_id:meetingId,
      user_id:localStorage.getItem('user_id'),
      type:'angry'
    })
  }

  useEffect(() => {
    window.addEventListener("beforeunload", leaveMeetingAndClose());
    return () => window.removeEventListener("beforeunload", leaveMeetingAndCloseSec());
  }, [])

  return (
    <Grid item xl={7} lg={7} mg={6} sm={6} xs={12}>
      <Card className="audio-host" sx={{ p: 2 }}>
        <div className="d-flex justify-content-between">
          <Typography
            variant="h5"
            component="div"
            sx={{ color: "#1EDA6B", fontFamily: "Poppins", mt: 2, ml: '30px' }}
          >
            Particpants
          </Typography>
          <Box sx={{ mt: 2 }} >
            <Popper open={open} anchorEl={anchorEl} placement={placement} transition>
              {({ TransitionProps }) => (
                <Fade {...TransitionProps} timeout={350}>
                  <Paper sx={{
                    display: 'flex',
                    justifyContent: "space-between",
                    flexDirection: 'row',
                    backgroundColor: 'transparent',
                    width: '120px',
                    p: 1,
                  }} >
                    <div style={{
                      display: "flex",
                      flexDirection:"column"
                      
                    }}>
                      <Avatar
                        alt="angry"
                        src={AngryEmoji}
                        sx={{ width: 24, height: 24 }}
                        onClick={addAngryReaction}
                      />
                      <p style={{color:"white",fontSize:"11px",marginLeft:"6px"}}>{angryReactions}</p>
                    </div>
                    <div style={{
                      display: "flex",
                      flexDirection:"column"
                      
                    }}>
                      <Avatar
                        alt="sad"
                        src={SadEmoji}
                        sx={{ width: 24, height: 24 }}
                        onClick={addSadReaction}
                      />
                      <p style={{color:"white",fontSize:"11px",marginLeft:"6px"}}>{sadReactions}</p>
                    </div>
                    <div style={{
                      display: "flex",
                      flexDirection:"column"
                      
                    }}>
                      <Avatar
                        alt="happy"
                        src={HappyEmoji}
                        sx={{ width: 24, height: 24 }}
                        onClick={addHappyReaction}
                      />
                      <p style={{color:"white",fontSize:"11px",marginLeft:"6px"}}>{happyReactions}</p>
                    </div>
                  </Paper>
                </Fade>
              )}
            </Popper>
            <Grid container justifyContent="center">
              <Grid item>
                <Avatar
                  alt="Remy Sharp"
                  src={ReactionEmoji}
                  onClick={handleClick('top')}
                />
              </Grid>
            </Grid>
          </Box>
          <div className="d-flex" style={{ textAlign: "right", marginTop: "20px" }}>
            {
              !isHost(pathname) &&
              <Typography onClick={e => { requestToShare(localParticipant.participantId) }} sx={{
                color: "#ffffff80",
                textDecoration: 'none',
                fontSize: '16px',
                mr: 1,
                "&:hover": {
                  cursor: 'pointer'
                }
              }}>
                Request
              </Typography>
            }
            <Typography onClick={leaveMeeting} sx={{
              color: "#FF6060",
              textDecoration: 'none',
              fontSize: '16px',
              "&:hover": {
                cursor: 'pointer'
              }
            }}>
              Leave
            </Typography>
          </div>
        </div>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {chunk([...participants.keys()]).map((k) => (
            k.map((l) => {
              return (
                <Grid
                  item
                  xl={3}
                  lg={3}
                  md={4}
                  sm={6}
                  xs={6}
                  key={l}
                  sx={{ mt: 2 }}
                >
                  <div style={{ textAlign: "center" }}>
                    <ParticipantView participantId={l} />
                  </div>
                </Grid>
              )
            })
          ))}
        </Grid>
      </Card>
      {
        isHost(pathname) &&
        <RequestedUsers />
      }
    </Grid>
  );
};

const HostsView = () => {

  const { participants } = useMeeting()

  return (
    <Grid item xl={5} lg={5} mg={6} sm={6} xs={12}>
      {
        chunk([...participants.keys()]).map((k) => (
          k.map((l) => {
            return (
              <Host key={l} participantId={l} />
            )
          })
        ))
      }
    </Grid>
  );
};

const Host = ({ participantId }) => {

  let navigate = useNavigate()

  function onParticipantLeft(participant) {
    console.log(" onParticipantLeftddd", participant);
    let id = localStorage.getItem('user_id')
    let name = localStorage.getItem('user_name')
    localStorage.setItem('display', `${id}-viewer-${name}`)
    navigate('/streams');
  }

  const {
    meetingId,
    toggleMic,
    localMicOn
  } = useMeeting(participantId, { onParticipantLeft });

  const micRef = useRef(null);

  useEffect(() => {
    socket.emit('call-approved-users', {
      meeting_id: meetingId
    })
    socket.on("user-request-accepted", (data) => {
      if (data.room_id == localStorage.getItem('room')) {
        console.log(data, 'user request accepted')
        const id = localStorage.getItem('user_id')
        const name = localStorage.getItem('user_name')
        if (data.display_name === `${id}-viewer-${name}`) {
          localStorage.setItem('display', `${id}-cohost-${name}`)
          window.location.reload()
        }
      }
    });
  }, []);


  const {
    displayName,
    micStream,
    micOn,
    isLocal,
    setViewPort,
  } = useParticipant(participantId, {
    onParticipantLeft,
  });


  useEffect(() => {
    if (micRef.current) {
      if (micOn) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(micStream.track);

        micRef.current.srcObject = mediaStream;
        micRef.current
          .play()
          .catch((error) =>
            console.error("mic  play() failed", error)
          );
      } else {
        micRef.current.srcObject = null;
      }
    }
  }, [micStream, micOn]);

  return displayName && displayName.includes("host") && (
    <>
      <Grid
        item
        xl={12}
        lg={12}
        md={12}
        sm={12}
        xs={12}
        sx={{ mb: 2 }}
      >
        <Card className="audio-host-card">
          <Box sx={{ display: "block", p: 2 }}>
            <audio ref={micRef} autoPlay muted={isLocal} />
            <div className="" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex" }}>
                <Avatar
                  aria-label="avatar"
                  src={`https://randomuser.me/api/portraits/women/${50}.jpg`}
                  sx={{ width: 56, height: 56 }}
                ></Avatar>
                <Box sx={{ ml: 2 }}>
                  <div>
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{ color: "#1EDA6B", fontFamily: "Poppins", textAlign: "left" }}
                    >
                      {String(displayName).split('-')[2]}
                    </Typography>
                  </div>
                  <div>
                    <Stack
                      sx={{
                        alignItems: "end",
                      }}
                      direction="row"
                      spacing={1}
                    >
                      <Chip
                        sx={{
                          borderRadius: 1,
                          backgroundColor: "#B624F4",
                          color: "white",
                          fontSize: "15px",
                          fontWeight: "500",
                        }}
                        size="small"
                        label="Host"
                      />

                      <Chip
                        sx={{
                          borderRadius: 1,
                          backgroundColor: "#DA1E1E",
                          color: "white",
                          fontSize: "15px",
                          fontWeight: "500",
                        }}
                        size="small"
                        label="Live"
                      />
                    </Stack>
                  </div>
                </Box>
              </div>
              {
                isLocal &&
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <Button
                    onClick={toggleMic}
                    variant="contained"
                    style={
                      micOn
                        ? { backgroundColor: "#c925ed" }
                        : {
                          backgroundColor: red[500],
                          color: "white",
                        }
                    }
                    className='toggleButton'>
                    {localMicOn ? <MicSharpIcon /> : <MicOffSharpIcon />}
                  </Button>
                </Box>
              }
            </div>
          </Box>
        </Card>
        <div style={{ textAlign: "center" }}>
        </div>
      </Grid>
    </>
  )
};

const RequestedUsers = () => {

  const [requestedUsers, setRequestedUsers] = useState([])

  const {
    meetingId
  } = useMeeting()

  useEffect(() => {
    socket.on("view-requested-users", (args) => {
      console.log(args, 'adasdas')
      setRequestedUsers(args?.data?.requested_users);
      // if (args?.data?.room_id == localStorage.getItem('room')) {
      // }
    })
  }, [socket])

  const acceptRequest = (name) => {
    console.log(name, 'name')
    socket.emit('accept-user-request', {
      display_name: name,
      meeting_id: meetingId,
      room_id: localStorage.getItem('room')
    })
  }

  const denyRequest = (name) => {
    console.log(name, 'name')
    socket.emit('deny-user-request', {
      display_name: name,
      meeting_id: meetingId,
      room_id: localStorage.getItem('room')
    })
  }

  return (
    <Card className="audio-host" sx={{ p: 2, mt: 3 }}>
      <div className="d-flex justify-content-between">
        <Typography
          variant="h5"
          component="div"
          sx={{ color: "#1EDA6B", fontFamily: "Poppins", mt: 2, ml: '30px' }}
        >
          Requested Users
        </Typography>
      </div>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {requestedUsers.map(item => {
          return (
            <Grid
              item
              xl={3}
              lg={3}
              md={4}
              sm={6}
              xs={6}
              key={String(item?.display_name).split("-")[1]}
              sx={{ mt: 2 }}
            >
              <div style={{ textAlign: "center" }}>
                <>
                  <PersonIcon fontSize="large" sx={{ color: 'white' }} />
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{
                      color: "white",
                      fontFamily: "Poppins",
                      textAlign: "center",
                      fontSize: "15px",
                      mt: 0.5,
                    }}
                  >
                    {String(item?.display_name).split("-")[2]}
                  </Typography>
                  <div>
                    <CheckCircleOutlineIcon
                      className='check-icon'
                      onClick={() => {
                        acceptRequest(item?.display_name)
                      }}
                    />
                    <CancelIcon
                      className='check-icon'
                      onClick={() => {
                        denyRequest(item?.display_name)
                      }}
                    />
                  </div>
                </>
              </div>
            </Grid>
          )
        }
        )}
      </Grid>
    </Card>
  );
}

const MeetingNow = ({ meetingId, micOn }) => {
  return (
    <MeetingProvider
      config={{
        meetingId,
        micEnabled: micOn,
        webcamEnabled: false,
        name: localStorage.getItem('display'),
      }}
      token={process.env.REACT_APP_VIDEOSDK_TOKEN}
      reinitialiseMeetingOnConfigChange={true}
      joinWithoutUserInteraction={true}
    >
      <HostsView />
      <LiveNow />
    </MeetingProvider>
  )
}

export default function Audios() {

  const params = useParams()
  const { pathname } = useLocation()
  const [token, setToken] = useState("");
  const [meetingId, setMeetingId] = useState("");
  const [participantName, setParticipantName] = useState("");
  const [micOn, setMicOn] = useState(false);
  const [isMeetingStarted, setMeetingStarted] = useState(false);

  usePrompt("Are you sure you want to leave?", true);

  useEffect(() => {
    onClickJoin(params.id)
  }, [params.id])

  useEffect(() => {
    socket.on("room-joined", (args) => {
      console.log(args, 'adasdas')
    })
  }, [])

  const onClickJoin = async (id) => {
    // console.log(id)
    const dn = localStorage.getItem('display')
    const config = {
      headers: {
        Authorization: localStorage.getItem("uToken"),
      },
    };
    const result = await axios.post(getStream, {
      meeting_id: id
    },
      config
    )
    if (result) {

      socket.emit('join-room', {
        room_id: id
      })
      if (isHost(pathname) && String(result.data.data.display_name) !== String(dn)) {
        window.location.href = `/audio/join/${id}`
      }
      else {

        const token = await getToken();
        const valid = await validateMeeting({ meetingId: id, token, type: 'live' });

        if (valid) {
          setMeetingId(id);
          setMeetingStarted(true);
          setToken(token);
          setMicOn(true);
          setParticipantName(dn)
        } else {
          toast.error("Invalid Meeting Id", {
            toastId: 'LSAE1',
          })
        };
      }
    }
  }

  return (
    <AudioStreamStyles>
      <div className="audio-container">
        <Grid container spacing={4}>
          {
            localStorage.getItem('user_name') === undefined ?
              <h3>Complete Your Profile</h3>
              :
              isMeetingStarted ?
                <Beforeunload onBeforeunload={(event) => event.preventDefault()}  >
                  <MeetingNow
                    meetingId={meetingId}
                    micOn={micOn}
                    participantName={participantName}
                    token={token}
                  />
                </Beforeunload>
                :
                <div className='d-flex justify-content-center align-item-center w-100'>
                  <CircularProgress color='secondary' />
                </div>
          }
        </Grid>
      </div>
    </AudioStreamStyles>
  );
}

const AudioStreamStyles = styled.section`
  .check-icon:hover {
    cursor:pointer
  }
  .audio-host-card, .audio-host {
    background-color: rgba(255, 255, 255, 0.2) !important;
  }
  .audio-host-card-footer {
    background-color: rgba(255, 255, 255, 0.2) !important;
  }
  .toggleButton {
    border-radius: 100%;
    min-width: auto;
    width: 44px;
    height: 44px;
  }
`;
