import React, { useState, useEffect } from 'react'
import styled from "styled-components";
import Axios from "../../api/Axios";
import { getChannels } from "../../api/Url";
import { Box, CircularProgress, Grid } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

const Channels = () => {

	const navigate = useNavigate();
	const [channels, setChannels] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		viewChannels()
	}, []);

	const viewChannels = async () => {
		setIsLoading(true)
		const data = {
			user_status: 2,
		};
		const response = await Axios.post(getChannels, data);
		if (response) {
			setIsLoading(false)
			// console.log(response.data.data)
			setChannels(response.data.data)
		}
	}

	return (
		<CategoryStyled>
			<div className='channel-wrap'>
				<Typography variant="body" sx={{ color: "var(--green-color)" }}>
					Channels
				</Typography>
				{
					!isLoading ?
					<Grid container spacing={2} sx={{ py: 5 }}>
						{
							channels.length > 0 ?
								channels.map(item => (
									<Grid item xs={12} md={4} sx={{
										px: 1
									}}
										onClick={() =>
											navigate(`/channel/${item._id}`)
										} >
										<Box className="category_box">
											<img src={item?.channel_logo} alt="" className="creator-img" />
											<Box
											>
												<Typography
													variant="subtitle2"
													sx={{
														color: "#fff",
														textTransform: "uppercase",
														fontWeight: "bold",
														textAlign: 'center',
														mt: 1
													}}
												>
													{item?.channel_name}
												</Typography>
											</Box>
										</Box>
									</Grid>
								)) :
								<>
									<h5>No Data Avaiable</h5>
								</>
						}
					</Grid> :
					<Box className='loading'>
						<CircularProgress color="secondary" />
					</Box>
				}

			</div>
		</CategoryStyled>
	)
}
const CategoryStyled = styled.section`
  background: #000;
  .creator-img {
    width: 100%;
    border-radius: 20px;
    height: 160px;
    /* height: 100%; */
    /* filter: brightness(0.7); */
    object-fit: cover;
  }
  .category_box {
    cursor: pointer;
  }
  .category_box:hover img {
    filter: brightness(0.4);
    transition: 0.5s;
  }
	.channel-wrap{
		padding: 30px;
	}
	.loading{
		display: flex;
		justify-content: center;
		align-items: center;
	}
`;


export default Channels
