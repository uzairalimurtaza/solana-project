import React from "react";
import { Box, Container, CircularProgress } from "@mui/material";
const Loader = () => {
  return (
    <>
      <Box sx={{ py: 3, display: "flex", justifyContent: "center" }}>
        <CircularProgress color="secondary" />
      </Box>
    </>
  );
};

export default Loader;
