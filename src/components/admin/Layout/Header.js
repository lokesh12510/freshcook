import React, { useState } from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  useScrollTrigger,
  Tooltip,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Typography,
  Container,
} from "@mui/material";

import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import styled from "styled-components";

import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../../utils/store/actions";
import CheckAccess from "../Auth/checkAccess";
import url from "../url";
import StaticImages from "../../../utils/constants/Images";
import { Theme } from "../../../utils/constants/Theme";

const settings = ["Profile", "Logout"];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const trigger = useScrollTrigger();
  


  const [colorChange, setColorchange] = useState(false);
  const changeNavbarColor = () => {
    if (window.scrollY >= 80) {
      setColorchange(true);
    } else {
      setColorchange(false);
    }
  };
  window.addEventListener("scroll", changeNavbarColor);

  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  const logout = () => {
    dispatch(actions.authLogout());
    navigate(url.Login);
  };

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <Header position="sticky" elevation={trigger ? 4 : 0}>
      <Container maxWidth="lg">
        <Toolbar>
          {/* <Sidebar />
          <Typography variant="h6"></Typography> */}
          <Link to={url.Dashboard}>
            <img
              src={StaticImages.LogoDark}
              alt="logo"
              width="70"
              height="50"
            />
          </Link>

          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "flex" },
              justifyContent: "center",
            }}
          >
            <CheckAccess request={["ROLE_ADMIN", "ROLE_CHEF"]}>
              <Button
                onClick={() => navigate(url.Dashboard)}
                className={location.pathname === url.Dashboard && "active"}
              >
                Dashboard
              </Button>
            </CheckAccess>
            {/* <CheckAccess request={['ROLE_ADMIN', 'ROLE_CHEF']}>
                <Button color="secondary" onClick={() => navigate(url.Department) }>Department</Button>
              </CheckAccess> */}
            {/* <CheckAccess request={['ROLE_ADMIN', 'ROLE_CHEF']}>
                <Button color="secondary" onClick={() => navigate(url.Employee) }>Employee</Button>
              </CheckAccess> */}
            <CheckAccess request={["ROLE_ADMIN"]}>
              <Button
                color="primary"
                onClick={() => navigate(url.Customer)}
                className={location.pathname === url.Customer && "active"}
              >
                Customer
              </Button>
            </CheckAccess>
            <CheckAccess request={["ROLE_ADMIN"]}>
              <Button
                color="primary"
                onClick={() => navigate(url.Cook)}
                className={location.pathname === url.Cook && "active"}
              >
                Home Cook
              </Button>
            </CheckAccess>
            <CheckAccess request={["ROLE_ADMIN", "ROLE_CHEF"]}>
              <Button
                color="primary"
                onClick={() => navigate(url.Food)}
                className={location.pathname === url.Food && "active"}
              >
                Food
              </Button>
            </CheckAccess>
            <CheckAccess request={["ROLE_ADMIN", "ROLE_CHEF"]}>
              <Button
                color="primary"
                onClick={() => navigate(url.Order)}
                className={location.pathname === url.Order && "active"}
              >
                Orders
              </Button>
            </CheckAccess>
            {/* <Button
                color="primary"
                variant="contained"
                onClick={() => logout()}
              >
                Logout
              </Button> */}
          </Box>

          {authState.isLoggedIn && authState.token !== null ? (
            <Box sx={{ flexGrow: 0 }}>
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Typography marginRight={1}>
                  {authState.user?.name}
                </Typography>
                <Avatar 
                  sx={{ width: 35, height: 35, bgcolor: 'purple' }}
                  alt={authState.user?.name} 
                  src={authState.user?.image || '/'}
                />
              </IconButton>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={() => logout()}>
                  <Typography textAlign="center">Logout</Typography>
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <>
              <Button color="primary" onClick={() => navigate(url.Login)}>
                Login
              </Button>
              {/* <Button color="primary" onClick={() => navigate(url.Signup) }>Register</Button> */}
            </>
          )}
        </Toolbar>
      </Container>
    </Header>
  );
};

export default Navbar;

const Header = styled(AppBar)`
  background-color: #fff;
  & .MuiButton-root {
    color: #000;
  }
  & .MuiButton-root.active {
    color: ${Theme.palette.secondary.dark};
  }
`;
