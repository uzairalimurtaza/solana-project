import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import Axios from "../../api/Axios";
import ResponsiveDrawer from "../../pages/Admin/Admin";
import { singleChannelInfo, editContentCreator } from "../../api/Url";
import styled from "styled-components";
import { useParams } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import { BsYoutube, BsTwitch, BsTwitter } from 'react-icons/bs';
import LoadingButton from "@mui/lab/LoadingButton";

const EditChannel = (props) => {

	let navigate = useNavigate()

	let { id } = useParams();
	const [loader, setLoader] = useState(false);
	const [loading, setLoading] = useState(false);
	const [thumbnailUrlChannel, setThumbnailUrlChannel] = useState("");
	const [thumbnailChannel, setThumbnailChannel] = useState(null);
	const [headerUrlChannel, setHeaderUrlChannel] = useState("");
	const [headerChannel, setHeaderChannel] = useState(null);
	const [channelType, setChannelType] = useState('')
	const [channelName, setChannelName] = useState('')
	const [creatorName, setCreatorName] = useState('')
	const [twitterLinkChannel, setTwitterLinkChannel] = useState('')
	const [youtubeLinkChannel, setYoutubeLinkChannel] = useState('')
	const [twitchLinkChannel, setTwitchLinkChannel] = useState('')
	const [candymachineId, setCandymachineId] = useState('')

	React.useEffect(() => {
		getChannelDetails(id)
	}, [id])

	const uploadHeader = async ({ currentTarget: input }) => {
		if (input.files && input.files[0]) {
			const files = input.files[0];
			validateHeader(input);
		}
	};

	const validateHeader = (input) => {
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
						if (height > 500 && width > 200) {
							const _url = URL.createObjectURL(input.files[0]);
							setHeaderUrlChannel(_url);
							setHeaderChannel(input.files[0]);
							return true;
						} else {
							toast("Upload a file of atleast 500*200");
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

	const getChannelDetails = async (id) => {
		try {
			setLoader(true)
			const response = await Axios.post(singleChannelInfo, {
				channel_id: id
			});
			if (response) {
				console.log(response.data, 'eer')
				setTwitterLinkChannel(response.data.data.twitter_link)
				setYoutubeLinkChannel(response.data.data.youtube_link)
				setTwitchLinkChannel(response.data.data.twitch_link)
				setThumbnailUrlChannel(response.data.data.channel_logo)
				setChannelName(response.data.data.channel_name)
				setCreatorName(response.data.data.creator_name)
				setChannelType(response.data.data.channel_type)
				setHeaderUrlChannel(response.data.data.channel_header);
				setCandymachineId(response.data.data.nft_collection_id.candy_machine_id)
				setLoader(false)
			}
		} catch (e) {
			console.log(e);
			setLoader(false)
		}
	}

	const formik = useFormik({
		initialValues: {
			channel_name: channelName,
			creator_name: creatorName,
			twitter_link_channel: twitterLinkChannel,
			youtube_link_channel: youtubeLinkChannel,
			twitch_link_channel: twitchLinkChannel,
			channel_type: channelType,
			candy_machine_id: candymachineId
		},
		enableReinitialize: true,
		onSubmit: async (values) => {
			setLoading(true)
			console.log(values.channel_type, 'dadas')
			let data = new FormData()
			data.append('channel_name', values.channel_name)
			data.append('channel_type', values.channel_type)
			data.append('creator_name', values.creator_name)
			data.append('twitter_link', values.twitter_link_channel)
			data.append('youtube_link', values.youtube_link_channel)
			data.append('twitch_link', values.twitch_link_channel)
			data.append('candy_machine_id', values.candy_machine_id)
			data.append('channel_id', id)
			data.append('type',true)
			if (thumbnailChannel != null) {
				data.append("logo", thumbnailChannel);
			}
			if (headerChannel != null) {
				data.append("header", headerChannel);
			}
			try {
				const config = {
					headers: {
						Authorization: localStorage.getItem("uToken"),
					},
				};
				var response = await Axios.post(editContentCreator, data, config);
				if (response) {
					setLoading(false)
				}
				if (response.data.status) {
					toast.success('Updated Channel Successfully', {
						toastId: 'FS34',
					});
					navigate('/admin/channels')
				}
			} catch (e) {
				toast.error('Could Not Update Channel')
				setLoading(false)
				console.log(e);
			}
		},
	});

	const uploadFile = async ({ currentTarget: input }) => {
		if (input.files && input.files[0]) {
			validateImg(input)
		}
	};

	const validateImg = (input) => {
		var regex = new RegExp("([a-zA-Z0-9\s_\\.\-:])+(.jpg|.png|.jpeg)$");
		if (regex.test(input.value.toLowerCase())) {
			if (typeof (input.files) != "undefined") {
				var reader = new FileReader();
				reader.readAsDataURL(input.files[0]);
				reader.onload = function (e) {
					var image = new Image();
					image.src = e.target.result;
					image.onload = function () {
						var height = this.height;
						var width = this.width;
						console.log(width, height)
						if (height > 500 || width > 200) {
							const _url = URL.createObjectURL(input.files[0]);
							setThumbnailUrlChannel(_url);
							setThumbnailChannel(input.files[0]);
							return true;
						} else {
							toast("Atleast Upload a 500*200 size photo");
							return false;
						}
					};
				}
			} else {
				toast("This browser does not support HTML5.");
				return false;
			}
		} else {
			toast("Please select a valid Image file.");
			return false;
		}
	}

	return (
		<div>
			<ResponsiveDrawer>
				<EditChannelStyles>
					<Box className="edit-wrapper" sx={{ display: "flex", flexDirection: "column" }}>
						<h4 style={{ textAlign: "left" }}>Edit Channel</h4>
						{
							loader ?
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
									<form onSubmit={formik.handleSubmit}>
										<TextField
											fullWidth
											name="channel_name"
											label="Channel Name"
											size="small"
											value={formik.values.channel_name}
											onChange={formik.handleChange}
											error={
												formik.touched.name && Boolean(formik.errors.name)
											}
											helperText={formik.touched.name && formik.errors.name}
											sx={{ my: 1 }}
										/>
										<TextField
											fullWidth
											name="creator_name"
											label="Creator Name"
											size="small"
											value={formik.values.creator_name}
											onChange={formik.handleChange}
											error={
												formik.touched.name && Boolean(formik.errors.name)
											}
											helperText={formik.touched.name && formik.errors.name}
											sx={{ my: 1 }}
										/>
										<TextField
											fullWidth
											name="candy_machine_id"
											label="Candy Machine ID"
											size="small"
											value={formik.values.candy_machine_id}
											onChange={formik.handleChange}
											sx={{ my: 1 }}
										/>
										<FormControl fullWidth sx={{ my: 1 }}>
											<InputLabel htmlFor="outlined-adornment-amount">Twitter</InputLabel>
											<OutlinedInput
												id="outlined-adornment-amount"
												value={formik.values.twitter_link_channel}
												onChange={formik.handleChange('twitter_link_channel')}
												startAdornment={<InputAdornment position="start"><BsTwitter /></InputAdornment>}
												label="Twitter"
											/>
										</FormControl>
										<FormControl fullWidth sx={{ my: 1 }}>
											<InputLabel htmlFor="outlined-adornment-amount">Youtube</InputLabel>
											<OutlinedInput
												id="outlined-adornment-amount"
												value={formik.values.youtube_link_channel}
												onChange={formik.handleChange('youtube_link_channel')}
												startAdornment={<InputAdornment position="start"><BsYoutube /></InputAdornment>}
												label="Youtube"
											/>
										</FormControl>
										<FormControl fullWidth sx={{ my: 1 }}>
											<InputLabel htmlFor="outlined-adornment-amount">Twitch</InputLabel>
											<OutlinedInput
												id="outlined-adornment-amount"
												value={formik.values.twitch_link_channel}
												onChange={formik.handleChange('twitch_link_channel')}
												startAdornment={<InputAdornment position="start"><BsTwitch /></InputAdornment>}
												label="Twitch"
											/>
										</FormControl>
										<FormControl sx={{ width: '250px' }}>
											<InputLabel id="demo-simple-select-label">Type</InputLabel>
											<Select
												labelId="demo-simple-select-label"
												id="demo-simple-select"
												value={formik.values.channel_type}
												label="Age"
												onChange={formik.handleChange('channel_type')}
											>
												<MenuItem value={'video'}>Video</MenuItem>
												<MenuItem value={'music'}>Music</MenuItem>
												<MenuItem value={'text'}>Text</MenuItem>
											</Select>
										</FormControl>
										<Box sx={{ mt: 1 }}>
											<div style={{ display: "flex" }}  >
												<Box
													sx={{ display: "flex", flexDirection: "column" }}
												>
													<label htmlFor="file-upload" className="custom-file-upload">
														Logo
													</label>
													<div>
														{thumbnailUrlChannel && (
															<img
																src={thumbnailUrlChannel}
																alt="thumnail"
																style={{
																	width: "165px",
																	height: "115px",
																	objectFit: "cover",
																}}
																name="file"
															/>
														)}
													</div>
													<input style={{ marginTop: "10px" }} id="file-upload" type="file" onChange={uploadFile} />
												</Box>
												<Box
													sx={{ display: "flex", flexDirection: "column" }}
												>
													<label htmlFor="file-upload" className="custom-file-upload">
														Header
													</label>
													<div>
														{headerUrlChannel && (
															<img
																src={headerUrlChannel}
																alt="thumnail"
																style={{
																	width: "165px",
																	height: "115px",
																	objectFit: "cover",
																}}
																name="file"
															/>
														)}
													</div>
													<input style={{ marginTop: "10px" }} id="file-upload" type="file" onChange={uploadHeader} />
												</Box>
											</div>
										</Box>
										<Box sx={{ mt: 1 }}>
											<LoadingButton
												type="submit"
												sx={{
													bgcolor: "#B624F4",
													color: "white",
												}}
												loading={loading}
												className="btn"
												variant="contained"
											>
												Submit
											</LoadingButton>
										</Box>
									</form>
								</>
						}
					</Box>
				</EditChannelStyles>
			</ResponsiveDrawer>
		</div>
	)
}

const EditChannelStyles = styled.section`
  .edit-wrapper {
    border-radius:5px;
    background-color:white;
    margin-top:30px;
    padding:30px
  }
  .submit-btn {
      margin-top:10px
  }
  .form-wrapper {
      margin-top:30px
  }
  .border-none {
    border: none !important;
  }
  .border-none:hover {
    background-color: white !important;
    color:black !important
  }
`;

export default EditChannel