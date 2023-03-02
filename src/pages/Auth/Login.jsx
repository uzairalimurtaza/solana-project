import React, { useState } from "react";
import { withFormik } from "formik";
import * as yup from "yup";
import Swal from "sweetalert2/dist/sweetalert2.js";
import Axios from "../../api/Axios";
import { SignIn } from "../../api/Url";
import {
  Container,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Box,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import { toast } from "react-toastify";
import styled from "styled-components";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import LoadingButton from "@mui/lab/LoadingButton";

const validationsForm = {
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup.string().required("Enter your password"),
};

const FormComponent = (props) => {
  // const [loginLoader, setLoginLoader] = React.useState(false)
  const [showPassword, setShowPassword] = useState(false);

  const {
    values,
    touched,
    errors,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = props;

  return (
    <div style={{ background: "#fff", minHeight: "55vh" }}>
      <LoginStyles>
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
              Sign in
            </Typography>
            <form onSubmit={handleSubmit}>
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
                type={showPassword ? "text" : "password"}
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={touched.password ? errors.password : ""}
                error={touched.password && Boolean(errors.password)}
                margin="dense"
                variant="outlined"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        onMouseDown={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <LoadingButton
                type="submit"
                fullWidth
                variant="contained"
                className="login-btn"
                sx={{ mt: 3, mb: 2 }}
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                Sign In
              </LoadingButton>

              {/* <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="/signup" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid> */}
            </form>
          </Box>
        </Container>
      </LoginStyles>
    </div>
  );
};

const Form = withFormik({
  mapPropsToValues: ({ email, password }) => {
    return {
      email: email || "",
      password: password || "",
    };
  },

  validationSchema: yup.object().shape(validationsForm),
  handleSubmit: async (values, { setSubmitting }) => {
    try {
      const response = await Axios.post(SignIn, values);
      const { status, message, token, role } = response.data;
      if (status) {
        setSubmitting(false);
        localStorage.setItem("uToken", `Bearer ${token}`);
        localStorage.setItem("role", `${role}`);
        if (role === "admin") {
          window.location.href = "/admin/videos";
        } else {
          window.location.href = "/";
        }
      } else {
        setSubmitting(false);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
      }
    } catch (err) {
      setSubmitting(false);
      toast.error(err.response.data.message, {
        toastId: 'LE',
      });
    }

    // end
  },
})(FormComponent);

const LoginStyles = styled.section`
  .login-btn {
    background-color: #1dda6f !important;
    color: black;
  }
  .login-btn:hover {
    background-color: #1dda6f !important;
    color: black;
  }
`;

export default Form;
// export default withStyles(styles)(Form);
