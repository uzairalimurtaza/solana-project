import React, { useState } from 'react'
import ResponsiveDrawer from '../../pages/Admin/Admin'
import Box from "@mui/material/Box";
import Axios from "../../api/Axios";
import { viewVideoRoute } from "../../api/Url";
import styled from "styled-components";
import { useParams } from 'react-router-dom';
import { Link } from "react-router-dom";

const VideoDetails = () => {

	let { id } = useParams();
	const [videoUrl, setVideoUrl] = useState('')
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [category, setCategory] = useState('')
	const [amount, setAmount] = useState('')
	const [viewsCount, setViewsCount] = useState('')

	React.useEffect(() => {
		getVideo()
	}, [id])

	const getVideo = async () => {
		try {
			const config = {
				headers: {
					Authorization: localStorage.getItem("uToken"),
				},
			};
			const response = await Axios.get(viewVideoRoute + id,config);
			// console.log(response.data)
			setTitle(response.data.video_detail.title)
			setDescription(response.data.video_detail.description)
			setVideoUrl(response.data.video_detail.video_url)
			setCategory(response.data.video_detail.category_id.category_name)
			setAmount(response.data.video_detail.amount)
			setViewsCount(response.data.video_detail.views_count)
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<div>
			<ResponsiveDrawer>
				<Box>
					{
						videoUrl.length > 0 &&
						<>
							<VideoStyle>
								<Box className='wrapper'>
									<video style={{ flexGrow: 1 }} className='vid' controls>
										<source src={`${videoUrl}`} type="video/mp4"></source>
									</video>
									<Box className='info'>
										<Box className='sub-info'>
											<h6>Title</h6>
											<p>{title}</p>
										</Box>
										<Box className='sub-info'>
											<h6>Description</h6>
											<p>{description}</p>
										</Box>
										<Box className='sub-info'>
											<h6>Category</h6>
											<p>{category}</p>
										</Box>
										<Box className='sub-info'>
											<h6>Amount</h6>
											<p>{amount}</p>
										</Box>
										<Link
											to={`/admin/edit/video/${id}`}
											className="edit-btn-detail" type="submit">
											EDIT
										</Link>
									</Box>
								</Box>
							</VideoStyle>
						</>
					}
				</Box>
			</ResponsiveDrawer>
		</div>
	)
}

export default VideoDetails;

const VideoStyle = styled.section`
	.wrapper {
		display:flex;
		align-items: top;
		margin-top: 40px;
	}
	.vid {
		border: 1px solid black;
		width:450px;
		height:450px;
	}
	.info {
		flex-grow: 1;
		padding: 50px;
		background-color: white;
	}
	.sub-info {
		display: flex;
	}
	.sub-info h6 {
		width: 170px;
		color:white;
		background-color: #3d4d66;
		padding:12px;
	}
	.sub-info p {
		padding-left: 7px;
		padding-right: 7px;
		padding-top: 5px;
		margin-bottom: 8px !important;
		width:100%;
		border:2px black solid;
		border-left: 0px;
		text-align: center;
	}
	.edit-btn-detail {
		padding:13px;
		width:100%;
		color:white;
		background-color: #3d4d66;
		text-align: center;
		text-decoration: none;
	}
`;