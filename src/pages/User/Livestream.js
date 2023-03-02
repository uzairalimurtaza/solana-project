import React, { useState, useEffect, useRef, useMemo } from 'react'
import styled from "styled-components";
import ReactPlayer from "react-player";
import { Box, Grid, Button } from '@mui/material';
import CardMedia from '@mui/material/CardMedia';
import { ReactComponent as CrossStream } from '../../assets/icons/cross-stream.svg'
import { ReactComponent as VideoRequestIcon } from '../../assets/icons/video-request.svg'
import dp from '../../assets/images/dp.png'
import Stack from '@mui/material/Stack';
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
import Chip from '@mui/material/Chip';
import { toast } from 'react-toastify'
import { Beforeunload } from 'react-beforeunload';
import CircularProgress from '@mui/material/CircularProgress';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import usePrompt from '../../utils/usePrompt';
import VideocamOffRoundedIcon from '@mui/icons-material/VideocamOffRounded';
import VideocamRoundedIcon from '@mui/icons-material/VideocamRounded';
import MicSharpIcon from '@mui/icons-material/MicSharp';
import MicOffSharpIcon from '@mui/icons-material/MicOffSharp';
import Popper from '@mui/material/Popper';
import Fade from '@mui/material/Fade';
import Paper from '@mui/material/Paper';
import Avatar from "@mui/material/Avatar";
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

const ParticipantView = ({ participantId, approvedUsersList }) => {

	let navigate = useNavigate()
	const {
		meetingId,
		toggleWebcam,
		localWebcamOn,
		toggleMic,
		localMicOn
	} = useMeeting();
	const webcamRef = useRef(null);
	const micRef = useRef(null);
	const [approvedArr, setApprovedArr] = useState([])

	const socket = io(imgUrl, {
		withCredentials: false,
	});

	useEffect(() => {
		socket.emit('call-approved-users', {
			meeting_id: meetingId
		})
		socket.on("user-request-accepted", (data) => {
			// console.log(data, 'user request accepted')
			const id = localStorage.getItem('user_id')
			const name = localStorage.getItem('user_name')
			// console.log(data, 'in data')
			if (data.status && data.display_name === `${id}-viewer-${name}`) {
				localStorage.setItem('display', `${id}-cohost-${name}`)
				window.location.reload()
			}
		});
		socket.on("view-requested-users", (args) => {
			console.log(args?.data?.approved_users.length, 'lengtrhhtt', new Date().getMinutes(), new Date().getSeconds())
			setApprovedArr(args?.data?.approved_users)
		})
		return () => { socket.disconnect() }
	}, [approvedArr]);

	const onStreamEnabled = (stream) => { };
	const onStreamDisabled = (stream) => { };

	function onParticipantLeft(participant) {
		let id = localStorage.getItem('user_id')
		let name = localStorage.getItem('user_name')
		localStorage.setItem('display', `${id}-viewer-${name}`)
		navigate('/streams');
	}

	const {
		displayName,
		webcamStream,
		micStream,
		webcamOn,
		micOn,
		isLocal,
		setViewPort,
	} = useParticipant(participantId, {
		onStreamEnabled,
		onStreamDisabled,
		onParticipantLeft,
	});

	useEffect(() => {
		if (webcamRef.current && !isLocal && webcamStream) {
			setViewPort(webcamRef.current.wrapper.offsetWidth, webcamRef.current.wrapper.offsetHeight);
		}
	}, [webcamRef.current?.offsetHeight, webcamRef.current?.offsetWidth, webcamStream])

	const webcamMediaStream = useMemo(() => {
		if (webcamOn) {
			const mediaStream = new MediaStream();
			mediaStream.addTrack(webcamStream.track);
			return mediaStream;
		}
	}, [webcamStream, webcamOn]);

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

	const flipStyle = useMemo(
		() =>
			isLocal ? { transform: "scaleX(-1)", WebkitTransform: "scaleX(-1)" } : {},
		[isLocal]
	);

	return displayName && displayName.includes("host") ?
		<Grid item xs={12} md={approvedArr?.length == 1 ? 12 : approvedArr?.length == 2 ? 6 : approvedArr?.length == 3 ? 4 : approvedArr?.length == 4 ? 6 : 12}>
			<div
				style={{
					display: "flex",
					flex: 1,
					flexDirection: "column",
					position: "relative",
				}}
			>
				<audio ref={micRef} autoPlay muted={isLocal} />
				<div
					style={{
						position: "relative",
						backgroundColor: "#454746",
						height: approvedArr?.length == 4 ? "210px" : '450px',
					}}
				>
					<div
						user={String(displayName)}
						style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
					>
						<ReactPlayer
							ref={webcamRef}
							playsinline // very very imp prop
							playIcon={<></>}
							pip={false}
							light={false}
							controls={false}
							muted={true}
							playing={true}
							url={webcamMediaStream}
							height={"100%"}
							width={"100%"}
							style={flipStyle}
							onError={(err) => {
								console.log(err, "participant video error");
							}}
						/>
						{
							isLocal &&
							<Box sx={{
								position: "absolute",
								bottom: "10px",
								left: "50%",
								display: "flex",
								justifyContent: 'center',
							}}>
								<Button
									onClick={toggleWebcam}
									variant="contained"
									style={
										webcamOn
											? {
												backgroundColor: "#c925ed",
												marginRight: "5px"
											}
											: {
												backgroundColor: red[500],
												color: "white",
												marginRight: "5px"
											}
									}
									className='toggleButton'>
									{localWebcamOn ? <VideocamRoundedIcon /> : <VideocamOffRoundedIcon />}
								</Button>
								<Button
									onClick={toggleMic}
									variant="contained"
									className='toggleButton'
									style={
										micOn
											? { backgroundColor: "#c925ed" }
											: {
												backgroundColor: red[500],
												color: "white",
											}
									}>
									{localMicOn ? <MicSharpIcon /> : <MicOffSharpIcon />}
								</Button>
							</Box>
						}
					</div>
				</div>
			</div>
		</Grid>
		: null
};

const ParticipantsView = ({ setWebcamOn, webcamOn }) => {

	const { pathname } = useLocation()
	const navigate = useNavigate()
	const {
		participants,
		localParticipant,
		end,
		leave,
		meetingId
	} = useMeeting()

	const [host, setHost] = useState(null)
	const [requestedUsers, setRequestedUsers] = useState([])
	const [approvedArr, setApprovedArr] = useState([])
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [open, setOpen] = React.useState(false);
	const [placement, setPlacement] = React.useState();

	const [happyReactions, setHappyReactions] = React.useState()
	const [sadReactions, setSadReactions] = React.useState()
	const [angryReactions, setAngryReactions] = React.useState()

	const handleClick = (newPlacement) => (event) => {
		setAnchorEl(event.currentTarget);
		setOpen((prev) => placement !== newPlacement || !prev);
		setPlacement(newPlacement);
	};

	useEffect(() => {
		window.addEventListener("beforeunload", leaveMeetingAndClose());
		return () => window.removeEventListener("beforeunload", leaveMeetingAndCloseSec());
	}, [])

	useEffect(() => {
		socket.on("view-requested-users", (args) => {
			console.log(args, 'sadasddd')
			setApprovedArr(args?.data?.approved_users)
			setRequestedUsers(args?.data?.requested_users);
		})
		socket.emit('reaction-count', {
			meeting_id: meetingId || localStorage.getItem('room'),
			room_id: localStorage.getItem('room'),
		})
		socket.on("latest-reactions-count", (payload) => {
			console.log(payload, 'lerwerw')
			setSadReactions(payload.data.sad_reaction_count)
			setHappyReactions(payload.data.happy_reaction_count)
			setAngryReactions(payload.data.angry_reaction_count)
		})
		socket.on("user-reactions-updated", (payload) => {
			console.log(payload, 'dasdasdafasd')
			setSadReactions(payload.data.sad_reaction_count)
			setHappyReactions(payload.data.happy_reaction_count)
			setAngryReactions(payload.data.angry_reaction_count)
		})
		return () => { socket.disconnect() }
	}, [])

	useEffect(() => {
		meetingId && getMeetingDetails()
	}, [meetingId])

	const addHappyReaction = () => {
		socket.emit("user-reactions", {
			room_id: localStorage.getItem('room'),
			meeting_id: meetingId || localStorage.getItem('room'),
			user_id: localStorage.getItem('user_id'),
			type: 'happy'
		})
	}

	const addSadReaction = () => {
		socket.emit("user-reactions", {
			room_id: localStorage.getItem('room'),
			meeting_id: meetingId,
			user_id: localStorage.getItem('user_id'),
			type: 'sad'
		})
	}

	const addAngryReaction = () => {
		socket.emit("user-reactions", {
			room_id: localStorage.getItem('room'),
			meeting_id: meetingId,
			user_id: localStorage.getItem('user_id'),
			type: 'angry'
		})
	}

	const leaveMeetingAndClose = () => {
		console.log('listernig =to event')
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
			leave()
			socket.emit('remove-user', {
				meeting_id: localStorage.getItem('room'),
				display_name: localStorage.getItem('display')
			})
			localStorage.setItem('display', `${id}-viewer-${name}`)

		}
		else if (myArray[1] === 'viewer') {
			// console.log(myArray)
			console.log('here in leaveMeetingAndCloseSec3')
			localStorage.setItem('display', `${id}-viewer-${name}`)
			leave()
		}
	}

	const getMeetingDetails = async () => {
		// console.log(meetingId, "id")
		const config = {
			headers: {
				Authorization: localStorage.getItem("uToken"),
			},
		};
		axios.post(getStream, {
			meeting_id: localStorage.getItem('room')
		},
			config
		).then((result) => {
			// console.log(result?.data?.data)
			const arr = String(result?.data?.data?.display_name).split('-')
			// console.log(arr[2], 'name')
			setHost(arr[2])
		})
			.catch((err) => {
				console.log(err, 'eqwdqw')
			})
	}

	const leaveMeeting = () => {
		const id = localStorage.getItem('user_id')
		const name = localStorage.getItem('user_name')
		if (!isHost(pathname)) {
			localStorage.setItem('display', `${id}-viewer-${name}`)
			leave()
			navigate('/streams')
			console.log('here in leave 1')
		}
		else {
			localStorage.setItem('display', `${id}-viewer-${name}`)
			end()
			socket.emit("end-meeting", {
				meeting_id: meetingId
			});
			navigate('/streams')
			console.log('here in leave 2')
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
		<div
			style={{
				display: "flex",
				flexWrap: "wrap",
				flexDirection: "column",
			}}
		>
			<LivestreamStyled>
				<Grid container spacing={2}>
					<Grid item xs={isHost(pathname) ? 6 : 12} md={isHost(pathname) ? 9 : 12}>
						<Box className='wrapper' >
							<Box className="taskbar">
								<Box
									style={{
										display: 'flex'
									}} >
									<Box>
										<CardMedia
											component="img"
											sx={{ width: 76 }}
											image={dp}
											alt="img"
										/>
									</Box>
									<Box
										sx={{
											display: 'flex',
											flexDirection: 'column',
										}}>
										<h6
											style={{
												marginTop: '10px',
												color: '#1EDA6B',
												fontWeight: 'bold'
											}}
										>{host}</h6>
										<Stack
											sx={{
												alignItems: 'end',
											}}
											direction="row"
											spacing={1}
										>
											{
												isHost(pathname) &&
												<Chip
													sx={{
														borderRadius: 1,
														backgroundColor: '#B624F4',
														color: 'white',
														fontSize: '15px',
														fontWeight: '700'
													}}
													size='small'
													label="Host"
												/>
											}

											<Chip
												sx={{
													borderRadius: 1,
													backgroundColor: '#DA1E1E',
													color: 'white',
													fontSize: '15px',
													fontWeight: '700'
												}}
												size='small'
												label="Live"
											/>
										</Stack>
									</Box>
								</Box>
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
														flexDirection: "column"

													}}>
														<Avatar
															alt="angry"
															src={AngryEmoji}
															sx={{ width: 24, height: 24 }}
															onClick={addAngryReaction}
														/>
														<p style={{ color: "white", fontSize: "11px", marginLeft: "6px" }}>{angryReactions}</p>
													</div>
													<div style={{
														display: "flex",
														flexDirection: "column"

													}}>
														<Avatar
															alt="sad"
															src={SadEmoji}
															sx={{ width: 24, height: 24 }}
															onClick={addSadReaction}
														/>
														<p style={{ color: "white", fontSize: "11px", marginLeft: "6px" }}>{sadReactions}</p>
													</div>
													<div style={{
														display: "flex",
														flexDirection: "column"

													}}>
														<Avatar
															alt="happy"
															src={HappyEmoji}
															sx={{ width: 24, height: 24 }}
															onClick={addHappyReaction}
														/>
														<p style={{ color: "white", fontSize: "11px", marginLeft: "6px" }}>{happyReactions}</p>
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
								<Box
									sx={{
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
									}}>
									{
										!isHost(pathname) &&
										<VideoRequestIcon
											onClick={e => { requestToShare(localParticipant.participantId) }}
											className='request-icon'
										/>
									}
									<Box style={{
										display: "flex",
										justifyContent: 'center',
										alignItems: 'center',
										flexDirection: 'column',
										color: '#B624F4',
										fontSize: '14px',
										marginRight: '20px'
									}} >
										<p>Viewers</p>
										<p style={{
											fontWeight: 'bold'
										}} >{Number(participants.size) > 0 ? Number(participants.size - 1) : 0}</p>
									</Box>
									<CrossStream
										className='cross-btn'
										onClick={leaveMeeting}
									/>
								</Box>
							</Box>
							<Grid container sx={{ height: "80vh" }} spacing={2}>
								{chunk([...participants.keys()]).map((k) => (
									k.map((l) => {
										// console.log(approvedArr?.length, 'approved length')
										return (
											<ParticipantView approvedUsersList={approvedArr} key={l} participantId={l} />
										)

									})
								))}
							</Grid>
						</Box >
					</Grid>
					{
						isHost(pathname) &&
						<Grid item xs={6} md={3} >
							<Box className="sidebar-taskbar">
								<Box
									className='text-center' >
									<h6
										style={{
											color: '#1EDA6B',
											fontWeight: 'bold',

										}}
									>Requested Users</h6>
								</Box>
							</Box>
							<Box className="sidebar-users">
								{
									requestedUsers?.length > 0 &&
									requestedUsers.map(item => {
										return (
											<div className='requested-users-name'>
												<p className=''>{String(item?.display_name).split('-')[2]}</p>
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
											</div>
										)
									})
								}
							</Box>
						</Grid>
					}
				</Grid>
			</LivestreamStyled>
		</div>
	);
};

const MeetingNow = ({ meetingId, micOn, webcamOn, participantName, inRequestArr, token, setWebcamOn }) => {
	// console.log({ participantName })
	return (
		<MeetingProvider
			config={{
				meetingId,
				micEnabled: micOn,
				webcamEnabled: webcamOn,
				name: localStorage.getItem('display'),
			}}
			token={process.env.REACT_APP_VIDEOSDK_TOKEN}
			reinitialiseMeetingOnConfigChange={true}
			joinWithoutUserInteraction={true}
		>
			<ParticipantsView
				inRequestArr={inRequestArr}
				webcamOn={webcamOn}
				setWebcamOn={setWebcamOn}
			/>
		</MeetingProvider>
	)
}

const Livestream = (props) => {

	const params = useParams()
	const { pathname } = useLocation()
	const [token, setToken] = useState("");
	const [meetingId, setMeetingId] = useState("");
	const [participantName, setParticipantName] = useState("");
	const [micOn, setMicOn] = useState(false);
	const [webcamOn, setWebcamOn] = useState(false);
	const [isMeetingStarted, setMeetingStarted] = useState(false);
	const [videoTrack, setVideoTrack] = useState(null);
	const videoPlayerRef = useRef();

	usePrompt("Are you sure you want to leave?", true);

	useEffect(() => {
		onClickJoin(params.id)
	}, [])

	useEffect(() => {
		if (webcamOn && !videoTrack) {
			getVideo();
		}
	}, [webcamOn]);

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
			// console.log(String(result.data.data.display_name) !== String(dn), 'conditon reroute', result.data.data.display_name, String(dn))
			if (isHost(pathname) && String(result.data.data.display_name) != String(dn)) {
				window.location.href = `/join/${id}`
			}
			else {
				const token = await getToken();
				const valid = await validateMeeting({ meetingId: id, token, type: 'live' });

				if (valid) {
					setMeetingId(id);
					_handleToggleWebcam();
					_handleToggleMic()
					setMeetingStarted(true);
					setToken(token);
					setWebcamOn(true);
					setMicOn(true);
					setParticipantName(dn)
				} else {
					toast.error("Invalid Meeting Id")
				};
			}
		}
	}

	const _handleToggleMic = () => {
		setMicOn(!micOn);
	};

	const _handleToggleWebcam = async () => {
		setWebcamOn(!webcamOn);
	};

	const getVideo = async () => {
		if (videoPlayerRef.current) {
			console.log(videoPlayerRef, 'dasdas')
			const stream = await navigator.mediaDevices.getUserMedia(
				{ audio: true, video: true }
			);
			const videoTracks = stream.getVideoTracks();
			const videoTrack = videoTracks.length ? videoTracks[0] : null;
			videoPlayerRef.current.srcObject = new MediaStream([videoTrack]);
			videoPlayerRef.current.play();
			if (!videoTrack) {
				setWebcamOn(false);
			}
			setVideoTrack(videoTrack);
		}
	};

	return (
		<>
			{
				localStorage.getItem('user_name') === undefined ?
					<h3>Complete Your Profile</h3>
					:
					isMeetingStarted ?
						<Beforeunload onBeforeunload={(event) => event.preventDefault()}  >
							<MeetingNow
								meetingId={meetingId}
								micOn={micOn}
								webcamOn={webcamOn}
								setWebcamOn={_handleToggleWebcam}
								participantName={participantName}
								token={token}
							/>
						</Beforeunload>
						:
						<div className='d-flex justify-content-center align-item-center w-100'>
							<CircularProgress />
						</div>
			}
		</>
	)
}

const LivestreamStyled = styled.section`
	.check-icon:hover {
		cursor:pointer
	}

	.toggleButton {
    border-radius: 100%;
    min-width: auto;
    width: 44px;
    height: 44px;
  }

	.cross-btn {
		color: #DA1E1E;
		margin-right:20px;
		width:40px;
	}

	.cross-btn:hover{
		cursor: pointer;
	}

	.wrapper {
		margin-left: 10px;
	}

	.comment-input {
		height: 60px;
		width: 300px;
		border: 2px #282C2D solid;
		border-radius: 20px;
		padding-left: 10px;
		background-color: #282C2D !important;
		color:white;
	}

	.requested-users-name {
		display:flex;
		justify-content:space-between;
		padding : 10px 20px 10px 20px
	}

	.requested-users-name:hover {
		background-color: #e1e6e2;
	}

	.taskbar {
		display: flex;
		justify-content: space-between;
		background-color: #F2FFFF !important;
    -webkit-backdrop-filter: blur(5px);
		border-top-right-radius: 10px ;
		border-top-left-radius: 10px ;
    backdrop-filter: blur(5px);
		height:70px;
	}

	.sidebar-taskbar {
		margin-right: 10px;
		border-bottom:2px solid #1dda6f;
		padding-top:24px;
		background-color: #F2FFFF !important;
    -webkit-backdrop-filter: blur(5px);
		border-top-right-radius: 10px ;
		border-top-left-radius: 10px ;
    backdrop-filter: blur(5px);
		height:70px;
	}

	.sidebar-users {
		margin-right: 10px;
		background-color: #F2FFFF !important;
    backdrop-filter: blur(5px);
		height:72vh;
	}

	video {
		object-fit: cover; // use "cover" to avoid distortion
  }

  .creator-img {
    width: 100%;
    border-radius: 20px;
    height: 159px;
    object-fit: cover;
  }

	.request-icon {
		width: 60%;
		height: 60%;
	}
	.request-icon:hover {
		cursor: pointer;
	}

  .stream_box {
    cursor: pointer;
  }

	.stream-icon {
		margin-right:8px;				
	}

  .stream_box:hover img {
    filter: brightness(0.4);
    transition: 0.5s;
  }

	.border-gradient-green {
  	border-image-source: linear-gradient(to left, #00C853, #B2FF59);
	}
`;


export default Livestream
