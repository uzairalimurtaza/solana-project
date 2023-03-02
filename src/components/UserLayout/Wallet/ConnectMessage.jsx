import React from "react";
import styled from "styled-components";
import { Box, Typography, Button } from "@mui/material";
import Wallet from "./Wallet.tsx";
const ConnectMessage = () => {
  return (
    <>
      <ConnectMessageStyled>
        <Typography
          variant="h4"
          component="div"
          sx={{ color: "#fff" }}
          className="heading"
        >
          Please Connect Your Wallet First
        </Typography>

        <Wallet style={{marginTop:'30px'}}>
          <Button
            variant="contained"
            // gutterBottom
            component="div"
            sx={{
              color: "#fff",
              my: 2,
              mx: 2,
              background: "var(--green-color)",
            }}
          >
            Connect your wallet
          </Button>
        </Wallet>
      </ConnectMessageStyled>
    </>
  );
};

export default ConnectMessage;

const ConnectMessageStyled = styled.section`
  background: #000;
  min-height: 55vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  @media (max-width: 900px) {
    .heading {
      font-size: 6vw;
    }
  }
`;
