import React from "react";
import { withStyles } from "@material-ui/core";
import { withFormik } from "formik";
import * as yup from "yup";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import ResponsiveDrawer from "../Admin/Admin";
import Axios from "../../api/Axios.jsx";
import { SignUp } from "../../api/Url";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import Container from "@mui/material/Container";
import { Navigate } from "react-router-dom";
const styles = () => ({
  card: {
    maxWidth: 420,
    marginTop: 50,
  },
  container: {
    display: "Flex",
    justifyContent: "center",
  },
  actions: {
    float: "right",
  },
});

const validationsForm = {
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .required("No password provided.")
    .min(8, "Password is too short - should be 8 chars minimum."),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Password does not match")
    .required("Confirm your password"),
  name: yup.string().required("Required"),
  surename: yup.string().required("Required"),
  phone: yup
    .string()
    .required("This field is Required")
    .matches(
      /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
      "Phone number is not valid"
    ),
};

const form = (props) => {
  const {
    classes,
    values,
    touched,
    errors,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    handleReset,
  } = props;

  return (
    // className={classes.container}
    <>
      <div>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <form onSubmit={handleSubmit}>
              {/* className={classes.card} */}
              <TextField
                id="name"
                label="First Name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={touched.name ? errors.name : ""}
                error={touched.name && Boolean(errors.name)}
                margin="dense"
                variant="outlined"
                fullWidth
              />
              <TextField
                id="surename"
                label="Last Name"
                value={values.surename}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={touched.surename ? errors.surename : ""}
                error={touched.surename && Boolean(errors.surename)}
                margin="dense"
                variant="outlined"
                fullWidth
              />
              <TextField
                id="email"
                label="Email"
                type="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={touched.email ? errors.email : ""}
                error={touched.email && Boolean(errors.email)}
                margin="dense"
                variant="outlined"
                fullWidth
              />
              <TextField
                id="password"
                label="Password"
                type="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={touched.password ? errors.password : ""}
                error={touched.password && Boolean(errors.password)}
                margin="dense"
                variant="outlined"
                fullWidth
              />
              <TextField
                id="confirmPassword"
                label="Confirm Password"
                type="password"
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={
                  touched.confirmPassword ? errors.confirmPassword : ""
                }
                error={
                  touched.confirmPassword && Boolean(errors.confirmPassword)
                }
                margin="dense"
                variant="outlined"
                fullWidth
              />
              <TextField
                id="phone"
                label="Phone Number"
                type="text"
                value={values.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={touched.phone ? errors.phone : ""}
                error={touched.phone && Boolean(errors.phone)}
                margin="dense"
                variant="outlined"
                fullWidth
              />
              {/* className={classes.actions} */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 2, mb: 2 }}
                disabled={isSubmitting}
              >
                Sign up
              </Button>
              <Grid container sx={{ mb: 3 }}>
                {/* <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid> */}
                <Grid item>
                  <Link href="/" variant="body2">
                    {"Already have an account? Sign in"}
                  </Link>
                </Grid>
              </Grid>
              {/* <Button color="secondary" onClick={handleReset}>
                  CLEAR
                </Button> */}
            </form>
          </Box>
        </Container>
      </div>
    </>
  );
};

const Form = withFormik({
  mapPropsToValues: ({
    surename,
    name,
    email,
    password,
    confirmPassword,
    phone,
  }) => {
    return {
      email: email || "",
      password: password || "",
      confirmPassword: confirmPassword || "",
      name: name || "",
      surename: surename || "",
      phone: phone || "",
    };
  },

  validationSchema: yup.object().shape(validationsForm),
  handleSubmit: async (values, { setSubmitting }) => {
    console.log(values);
    const data = {
      first_name: values.name,
      last_name: values.surename,
      password: values.password,
      email: values.email,
      phone_number: values.phone,
    };
    // const data = RegistrationData;
    // console.log(Submitting);
    console.log(setSubmitting);
    try {
      const response = await Axios.post(SignUp, data);
      const { status, message } = response.data;
      if (status) {
        Swal.fire({
          icon: "success",
          title: "Great...",
          text: "Your account has been registered successfully",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "/";
          }
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
      }
    } catch (err) {
      toast.error(err.response.data.message, {
        toastId: 'SE',
      });
    }

    // end
  },
})(form);

export default Form;
// export default withStyles(styles)(Form);
