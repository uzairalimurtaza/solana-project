import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useFormik } from "formik";
import * as yup from "yup";
import Axios from "../../api/Axios";
import ResponsiveDrawer from "../../pages/Admin/Admin";
import { editCategoryRoute, viewCategoryRoute } from "../../api/Url";
import styled from "styled-components";
import { useParams } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const EditCategory = (props) => {

	const navigate = useNavigate()

	let { id } = useParams();
	const [name, setName] = useState('')
	const [description, setDescription] = useState('')
	const [thumbnail, setThumbnail] = useState();
	const [thumbnailUrl, setThumbnailUrl] = useState(null);
	const [loader, setLoader] = useState(false);

	React.useEffect(() => {
		getCategory()
	}, [id])

	const validationSchema = yup.object({
		name: yup.string("Enter your name").required("Name is required"),
		description: yup
			.string("Enter your email")
			.required("Discription is required"),
	});

	const formik = useFormik({
		initialValues: {
			name: name,
			description: description,
			file: ''
		},
		enableReinitialize: true,
		validationSchema: validationSchema,
		onSubmit: async (values) => {
			setLoader(true)
			let data = new FormData()
			data.append('category_name', values.name)

			data.append('category_id', id)
			data.append('description', values.description)
			data.append('image', thumbnail)
			try {
				const config = {
					headers: {
						Authorization: localStorage.getItem("uToken"),
					},
				};
				var response = await Axios.post(editCategoryRoute, data, config);
				if (response) {
					setLoader(false)
				}
				if (response.data.status) {
					toast.success('Category Edited Successfully')
					navigate('/admin/categories')
				}
			} catch (e) {
				console.log(e);
				setLoader(false)
				toast.error('Could Not Edit Category')
			}
		},
	});

	const uploadFile = async ({ currentTarget: input }) => {
		if (input.files && input.files[0]) {
			const files = input.files[0];
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
							setThumbnailUrl(_url);
							setThumbnail(input.files[0]);
							return true;
						} else {
							alert("At least you can upload a 500*200 photo size.");
							return false;
						}
					};
				}
			} else {
				alert("This browser does not support HTML5.");
				return false;
			}
		} else {
			alert("Please select a valid Image file.");
			return false;
		}
	}

	const getCategory = async () => {
		try {
			setLoader(true)
			const response = await Axios.post(viewCategoryRoute, {
				category_id: id
			});
			if (response) {
				console.log(response.data.data, 'eer cad')
				setName(response.data.data.category_name)
				setDescription(response.data.data.description)
				setThumbnailUrl(response.data.data.category_image)
				setLoader(false)
			}

		} catch (e) {
			console.log(e);
			setLoader(false)
		}
	}
	return (
		<div>
			<ResponsiveDrawer>
				<EditCategoryStyles>
					<Box className="edit-wrapper" sx={{ display: "flex", flexDirection: "column" }}>
						<h4>{name}</h4>
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
									<form className='form-wrapper' onSubmit={formik.handleSubmit}>
										<TextField
											fullWidth
											name="name"
											label="Name"
											value={formik.values.name}
											onChange={formik.handleChange}
											error={formik.touched.name && Boolean(formik.errors.name)}
											helperText={formik.touched.name && formik.errors.name}
											sx={{ my: 1 }}
										/>
										<TextField
											fullWidth
											name="description"
											label="Description"
											multiline
											maxRows={4}
											sx={{ my: 1 }}
											value={formik.values.description}
											onChange={formik.handleChange}
											error={
												formik.touched.description &&
												Boolean(formik.errors.description)
											}
											helperText={
												formik.touched.description && formik.errors.description
											}
										/>
										<div className="img-sec">
											{thumbnailUrl && (
												<img
													src={thumbnailUrl}
													alt="thumnail"
													style={{
														width: "165px",
														height: "115px",
														objectFit: "cover",
													}}
													name="file"
												/>
											)}
											<input style={{ paddingTop: '5px' }} id="file-upload" type="file" onChange={uploadFile} />
										</div>
										<div className="submit-btn">
											<Button className='border-none' type="submit" variant="contained">
												Submit
											</Button>
										</div>
									</form>
								</>
						}
					</Box>
				</EditCategoryStyles>
			</ResponsiveDrawer>
		</div>
	)
}

const EditCategoryStyles = styled.section`
	.img-sec {
		display: flex;
		flex-direction: column
	}
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

export default EditCategory