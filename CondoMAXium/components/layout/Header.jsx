import React, { useState } from "react";
import {
  AppBar,
  Box,
  Container,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Tooltip,
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const Header = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseMenu = (type) => {
    type === "nav" ? setAnchorElNav(null) : setAnchorElUser(null);
  };

  return (
    <AppBar
      position="fixed"
      sx={{ paddingY: "20px", backgroundColor: "rgba(0, 0, 0, 0.1)" }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h4"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
              marginTop: "-15px",
              alignSelf: "center", // align to the vertical center
            }}
          >
            CondoMAXium
          </Typography>

          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "flex", md: "none" },
              alignSelf: "center",
            }}
          >
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={() => handleCloseMenu("nav")}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {/* You can add your custom menu items here */}
            </Menu>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginLeft: "auto",
              marginTop: "-15px",
            }}
          >
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="X" src="/static/images/avatar.jpg" />
              </IconButton>
            </Tooltip>
            <Typography variant="body1" sx={{ marginLeft: "8px" }}></Typography>
          </Box>
          {/*
                    <Menu
                        sx={{ mt: '45px' }}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={() => handleCloseMenu('user')}
                    > 
                        {/* You can add your custom menu items here */}
          {/* </Menu> */}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
