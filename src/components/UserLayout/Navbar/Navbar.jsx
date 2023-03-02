import React, { useState, useEffect, useContext } from "react";
import {
  AppBar,
  Box,
  Tab,
  Tabs,
  Toolbar,
  useMediaQuery,
  useTheme,
  Container,
} from "@mui/material";
import { ReactComponent as StreamIcon } from '../../../assets/icons/stream-icon.svg'
import { ReactComponent as Discord } from "../../../assets/images/Path 168.svg";
import DrawerComp from "./Drawer";
import styled from "styled-components";
import Wallet from "../../UserLayout/Wallet/Wallet.tsx";
import NullImage from "../../../assets/images/uploadd.png";
import { Link } from "react-router-dom";
import Logo from "../../../assets/images/Mask Group 3.png";
import { useNavigate, useLocation } from "react-router-dom";
import MainContext from "../../../Context/MainContext";
import { viewUserDetail } from "../../../api/Url";
import Axios from "../../../api/Axios";

const Navbar = () => {
  const { setSearchValue, walletIsConnected } = useContext(MainContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState(0);

  const [navScroll, setNavScroll] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const theme = useTheme();
  const isMatch = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    // console.log(location.pathname,'oda')
    if (location.pathname === "/my_videos") {
      setValue(2);
    } else if (location.pathname === "/community") {
      setValue(1);
    }
    else if (location.pathname === "/music") {
      setValue(3);
    }
    else if (location.pathname === "/streams") {
      setValue(4);
    }
    else if (location.pathname === "/") {
      setValue(0);
    }
    if (walletIsConnected) {
      getUserDetail();
    }
  }, [location]);

  useEffect(() => {
    window.addEventListener("scroll", function () {
      if (window.pageYOffset > 0) {
        setNavScroll("active");
      } else {
        setNavScroll("");
      }
    });
  }, []);


  const getUserDetail = async () => {
    try {
      const header = {
        headers: {
          Authorization: localStorage.getItem("uToken"),
        },
      };
      const response = await Axios.post(viewUserDetail, {}, header);
      setProfileImage(response.data.profile_image);
    } catch (e) {
      console.log(e);
    }
  };

  const SearchHandler = (e) => {
    if (e.target.value) {
      setTimeout(() => {
        navigate("/search");
        setSearchValue(e.target.value);
      }, 3000);
    } else {
      navigate("/");
      setSearchValue("");
    }
  };

  return (
    <>
      <Nav>
        <AppBar
          sx={{
            position: "relative",
            display: "initial",
            boxShadow: "none",
          }}
          className={`${navScroll}`}
        >
          <Container maxWidth="xl">
            <Toolbar sx={{ p: 0 }}>
              <Link to="/">
                <img src={Logo} alt="logo" className="logo" />
              </Link>

              {isMatch ? (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                      justifyContent: "flex-end",
                    }}
                  >
                    <form
                      role="search"
                      className="search-form"
                      autocomplete="off"
                    >
                      <input
                        type="search"
                        name="q"
                        className="search-text"
                        placeholder="Search..."
                        autoComplete="off"
                        onChange={SearchHandler}
                      />
                    </form>
                    <Wallet />
                    <a href="https://discord.gg/KdyVMseSdG" rel="noreferrer" target="_blank">
                      <Discord style={{ margin: "0 15px" }} />
                    </a>
                    <Box
                      onClick={(e) => {
                        navigate("/profile");
                      }}
                    >
                      <img src={NullImage} alt="" className="upload_img" />
                    </Box>
                  </Box>
                  <DrawerComp />
                </>
              ) : (
                <>
                  <Tabs
                    indicatorColor="primary"
                    value={value}
                    onChange={(e, value) => {
                      setValue(value)
                    }}
                  >
                    <Tab
                      className="nav_links"
                      label="Home"
                      sx={{
                        color: 'rgba(255, 255, 255)',
                        '&.Mui-selected': {
                          color: '#1dda6f',
                        }
                      }}
                      onClick={(e) => {
                        navigate("/");
                      }}
                    />
                    <Tab
                      className="nav_links"
                      label="Channels"
                      sx={{
                        color: 'rgba(255, 255, 255)',
                        '&.Mui-selected': {
                          color: '#1dda6f',
                        },
                      }}
                      onClick={(e) => {
                        navigate("/community");
                      }}
                    />
                    <Tab
                      className="nav_links"
                      label="My Videos"
                      sx={{
                        color: 'rgba(255, 255, 255)',
                        '&.Mui-selected': {
                          color: '#1dda6f',
                        },
                      }}
                      onClick={(e) => {
                        navigate("/my_videos");
                      }}
                    />
                    <Tab
                      className="nav_links"
                      label="Music"
                      sx={{
                        color: 'rgba(255, 255, 255)',
                        '&.Mui-selected': {
                          color: '#1dda6f',
                        },
                      }}
                      onClick={(e) => {
                        navigate("/music");
                      }}
                    />
                    <Tab
                      icon={<StreamIcon />}
                      disabled
                      iconPosition="start"
                      className="nav_links"
                      label="Livestreams"
                      sx={{
                        color: 'rgba(255, 255, 255)',
                        '&.Mui-selected': {
                          color: '#1dda6f',
                        }
                      }}
                      onClick={(e) => {
                        // navigate("/streams");
                      }}
                    />
                  </Tabs>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <form role="search" className="search-form">
                      <input
                        type="search"
                        name="q"
                        className="search-text"
                        placeholder="Search..."
                        autoComplete="off"
                        onChange={SearchHandler}
                      />
                    </form>

                    <Wallet />
                    <a href="https://discord.gg/KdyVMseSdG" rel="noreferrer" target="_blank">
                      <Discord style={{ margin: "0 15px" }} />
                    </a>
                    <Box
                      onClick={(e) => {
                        navigate("/profile");
                      }}
                    >
                      <img
                        src={profileImage ? profileImage : NullImage}
                        alt=""
                        className="upload_img"
                      />
                    </Box>
                  </Box>
                </>
              )}
            </Toolbar>
          </Container>
        </AppBar>
      </Nav>
    </>
  );
};

export default Navbar;

const Nav = styled.nav`
  background: #000;
  .logo {
    width: 100%;
    max-width: 110px;
    padding: 10px 0;
  }
  .MuiTabs-indicator {
    top: 0;
    background: var(--green-color);
    border-radius: 15px;
    height: 3px;
  }
  .Mui-selected {
    color: var(--green-color);
  }
  .MuiToolbar-root {
    align-items: center;
    display: flex;
    justify-content: space-between;
  }

  .upload_img {
    cursor: pointer;
    border-radius: 50%;
    width: 35px;
    /* width: 100%; */
    height: 35px;
    &:hover {
      transition: 0.4s;
      filter: brightness(0.5);
    }
  }
  .nav_links {
    &:hover {
      opacity: 0.7;
    }
    &:hover .MuiTabs-indicator {
      background: red !important;
    }
  }
  .Mui-disabled {
    color:white !important
  }
  input.search-text {
    color: #000;
    margin: 0 15px;
    position: relative;
    z-index: 5;
    transition: z-index 0.8s, width 0.5s, background 0.3s ease, border 0.3s;
    height: 45px;
    width: 0px;
    padding: 0px 0 0px 40px;
    cursor: pointer;
    border-radius: 30px;
    border: 1px solid transparent;
    background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDUxMiA1MTIiIGhlaWdodD0iNTEycHgiIGlkPSJMYXllcl8xIiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiB3aWR0aD0iNTEycHgiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxwYXRoIGQ9Ik01MDMuODY2LDQ3Ny45NzRMMzYwLjk1OCwzMzUuMDUyYzI4LjcyNS0zNC41NDQsNDYuMDE3LTc4LjkxMiw0Ni4wMTctMTI3LjMzNiAgYzAtMTEwLjA4NC04OS4yMjctMTk5LjMxMi0xOTkuMzEyLTE5OS4zMTJDOTcuNTk5LDguNDAzLDguMzUxLDk3LjYzMSw4LjM1MSwyMDcuNzE1YzAsMTEwLjA2NCw4OS4yNDgsMTk5LjMxMiwxOTkuMzEyLDE5OS4zMTIgIGM0OC40MzUsMCw5Mi43OTItMTcuMjkyLDEyNy4zMzYtNDYuMDE3bDE0Mi45MDgsMTQyLjkyMkw1MDMuODY2LDQ3Ny45NzR6IE0yOS4zMzEsMjA3LjcxNWMwLTk4LjMzNCw3OS45ODctMTc4LjMzMiwxNzguMzMyLTE3OC4zMzIgIGM5OC4zMjUsMCwxNzguMzMyLDc5Ljk5OCwxNzguMzMyLDE3OC4zMzJzLTgwLjAwNywxNzguMzMyLTE3OC4zMzIsMTc4LjMzMkMxMDkuMzE4LDM4Ni4wNDcsMjkuMzMxLDMwNi4wNSwyOS4zMzEsMjA3LjcxNXoiIGZpbGw9IiMzNzQwNEQiLz48L3N2Zz4=)
      no-repeat left 9px center transparent;
    /* background: url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGN9jFlaBs1qCDBydlV9gub8VI0Gj1wNUp_w&usqp=CAU"); */
    background-size: 24px;
  }
  input.search-text:focus {
    z-index: 3;
    width: 200px;
    border: 1px solid #666;
    background-color: white;
    outline: none;
    cursor: auto;
    padding-right: 10px;
  }

  input.search-text::-webkit-search-cancel-button {
    cursor: pointer;
  }
`;
