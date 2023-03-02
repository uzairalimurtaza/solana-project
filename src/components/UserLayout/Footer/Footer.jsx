import React from "react";
import { useMediaQuery, useTheme, Box } from "@mui/material";
import styled from "styled-components";
import Container from "@mui/material/Container";
import Logo from "../../../assets/images/Mask Group 3.png";
import Twitter from "../../../assets/images/Group 300.png";
import Contact from "../../../assets/images/Group 299.png";
import TwitterTwo from "../../../assets/images/Icon awesome-twitter.png";
import Discord from "../../../assets/images/Path 168.png";
import Instagram from "../../../assets/images/instalogo.png";
import { Link } from "react-router-dom";
import Pdf from "../../../assets/file/SolanaTv Whitepaper.pdf";
const Footer = () => {

  const theme = useTheme();
  const SmallScreen = useMediaQuery(theme.breakpoints.down("xs"));
  const MediumScreen = useMediaQuery(theme.breakpoints.down("sm"));
  
  return (
    <>
      <FooterStyled
        $MediumScreen={MediumScreen}
        $SmallScreen={SmallScreen}
        id="footer"
      >
        <Container
          sx={{
            display: "flex",
            justifyContent: { xs: "", sm: "space-between" },
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            flexWrap: "wrap",
            padding: "6rem",
            textAlign: { xs: "center", sm: "initial" },
          }}
          maxWidth="xl"
          className="footer"
        >
          <Box>
            <img src={Logo} alt="" className="logo" />
          </Box>
          <Box>
            <ul className="main_pages">
              <Link to="/">
                <li>Home</li>
              </Link>
              <Link to="/category">
                <li>Categories</li>
              </Link>
              <Link to="/my_videos">
                <li>My Videos</li>
              </Link>
            </ul>
          </Box>
          <Box>
            <ul>
              <h4>Overview</h4>
              {/* <Link to="/aboutus" style={{ textDecoration: "none" }}> */}
              <a rel="noreferrer" href={Pdf} style={{ textDecoration: "none" }} target="_blank">
                <li>Whitepaper</li>
              </a>
              {/* </Link> */}
              <Link to="/privacypolicy" style={{ textDecoration: "none" }}>
                <li>Privacy Policy</li>
              </Link>
            </ul>
          </Box>
          <Box>
            <ul className="contact_ul">
              <h4>Contact us</h4>
              <li>
                <span>
                  <img src={Twitter} alt="twitter" />
                </span>
                Solana_TV
              </li>
              <li>
                <span>
                  <img src={Contact} alt="contact" />
                </span>
                contact@solanatv.io
              </li>
            </ul>
          </Box>
          <Box className="footer_social">
            <div className="social_icon">
              <a rel="noreferrer" href="https://twitter.com/Solana_Tv" target="_blank">
                <img src={TwitterTwo} alt="Twitter" />
              </a>
              <a rel="noreferrer" href="https://discord.gg/KdyVMseSdG" target="_blank">
                <img src={Discord} alt="Discord" />
              </a>
              <a rel="noreferrer" href="https://www.instagram.com/solanatv.io" target="_blank">
                <img src={Instagram} alt="Instagram" />
              </a>
            </div>
            <li>WWW.SolanaTv.io</li>
          </Box>
        </Container>
        <Box className="footer_bottom">
          <Container maxWidth="xl" sx={{ textAlign: "center" }}>
            &#169; Copyright by 2022 Solana.TV - All rights Reserved
          </Container>
        </Box>
      </FooterStyled>
    </>
  );
};

export default Footer;

const FooterStyled = styled.footer`
  background: #000;
  .logo {
    width: 100%;
    max-width: 110px;
  }
  li {
    color: #fff;
    list-style: none;
    font-size: 14px;
    display: flex;
    align-items: center;
    padding: 5px 0;
    cursor: pointer;
    span {
      margin-right: 10px;
    }
  }
  h4 {
    color: #1eda6b;
  }
  .contact_ul {
    li {
      display: ${(props) => props.$MediumScreen && "flex"};
      flex-direction: ${(props) => props.$MediumScreen && "column"};
      align-items: ${(props) => props.$MediumScreen && "center"};
    }
  }
  .footer_social {
    .social_icon {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
  li {
    &:hover {
      opacity: 0.7;
    }
  }
  .footer_bottom {
    background: #b624f4;
    padding: 12px 0;
    color: #fff;
  }
  ul {
    display: ${(props) => props.$MediumScreen && "flex"};
    flex-direction: ${(props) => props.$MediumScreen && "column"};
    align-items: ${(props) => props.$MediumScreen && "center"};
    padding-left: 0 !important;
  }
  a {
    text-decoration: none;
  }
`;
