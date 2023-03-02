import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;
const sideMenu = [
  {
    name: "Videos",
    navigator: "/admin/videos",
  },
  {
    name: "Categories",
    navigator: "/admin/categories",
  },
  {
    name: "Channels",
    navigator: "/admin/channels",
  },
  {
    name: "Add Video",
    navigator: "/admin/add/video",
  },
  {
    name: "Users",
    navigator: "/admin/users",
  },
  {
    name: "Logout",
    navigator: "/",
  },
];
function ResponsiveDrawer(props) {
  const navigate = useNavigate();
  const { window } = props;
  // console.log(window,'window')
  // const {location} = window
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const Logout = (e) => {
    try {
      navigate('/')
      localStorage.clear()
    } catch (error) {
      console.log(error);
    }
  };

  const drawer = (
    <div
      style={{
        backgroundColor: "#3d4d66",
        height: "100%",
        paddingTop: "30px",
      }}
    >
      {/* <Divider /> */}
      <List>
        {sideMenu.map((item, index) => (
          <ListItemButton
            // selected={true}
            button
            key={index}
            onClick={(e) =>
              item.name === "Logout" ? Logout(e) : navigate(item.navigator)
            }
            sx={{ color: "#fff" }}
          >
            <ListItemIcon sx={{ color: "#fff" }}>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={item.name} />
          </ListItemButton>
        ))}
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          color: "black",
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          background: "white",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <h2 style={{ color: "black", marginBottom: "0px !important" }}>
            Solana TV
          </h2>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        sx={{
          px: 1,
          minHeight: "93vh",
          width: "100%",
          backgroundColor: "#f3f6fb",
          marginTop: "40px",
        }}
      >
        {props.children}
      </Box>
    </Box>
  );
}
export default ResponsiveDrawer;
