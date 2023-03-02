import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import styled from "styled-components";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import CategoryIcon from "@mui/icons-material/Category";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import Logo from "../../../assets/images/Mask Group 3.png";
const pages = [
  {
    name: "HOME",
    navigator: "/",
    icon: HomeIcon,
  },
  {
    name: "CATEGORIES",
    navigator: "/category",
    icon: CategoryIcon,
  },
  {
    name: "MY VIDEOS",
    navigator: "/my_videos",
    icon: VideoLibraryIcon,
  },
];
const DrawerComp = () => {
  const navigate = useNavigate();
  const [openDrawer, setOpenDrawer] = useState(false);

  return (
    <>
      <Drawer
        anchor="left"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      >
        <DrawerStyled>
          <List sx={{ background: "#000", height: "100%" }}>
            <img src={Logo} alt="" className="logo" />
            {pages.map((page, index) => (
              <ListItemButton
                key={index}
                onClick={() => {
                  navigate(page.navigator);
                  setOpenDrawer(false);
                }}
              >
                <ListItemIcon>
                  <page.icon sx={{ color: "var(--green-color)" }} />
                </ListItemIcon>
                <ListItemText sx={{ color: "#1dda6f" }}>
                  {page.name}
                </ListItemText>
              </ListItemButton>
            ))}
          </List>
        </DrawerStyled>
      </Drawer>
      <IconButton
        sx={{ color: "white", marginLeft: "auto" }}
        onClick={() => setOpenDrawer(!openDrawer)}
      >
        <MenuIcon color="white" />
      </IconButton>
    </>
  );
};

export default DrawerComp;

const DrawerStyled = styled.section`
  height: 100%;
  .logo {
    padding: 0 20px;
    max-width: 150px;
  }
  .css-g1fnhx-MuiList-root {
    padding: 10px 4rem 10px 10px !important;
  }
  .MuiListItemButton-root {
  }
`;
