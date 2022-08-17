import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AppBar, Avatar, Badge, Box, Container, IconButton, Menu, MenuItem, Toolbar, Typography, useScrollTrigger } from "@mui/material";
import { Drawer, List, ListItem, ListItemButton, ListItemText, Stack } from "@mui/material";
import { Menu as MenuIcon, ShoppingCart, Close as CloseIcon } from "@mui/icons-material";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";

import StaticImages from "../../../utils/constants/Images";
import { CloseBtn, PrimaryBtn, StyledDivider, TextBtn } from "../../../utils/constants/Styles";
import { Theme } from "../../../utils/constants/Theme";
import * as actions from "../../../utils/store/actions";
import url from "../url";

const pages = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "About Us",
    href: "/#",
  },
  {
    label: "Contact",
    href: "/#",
  },
];

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const cartState = useSelector((state) => state.cart);

  const logout = () => {
    dispatch(actions.authLogout());
    navigate(url.Home);
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

  const [state, setState] = React.useState({
    mobileView: false,
    drawerOpen: false,
  });

  const { mobileView, drawerOpen } = state;

  useEffect(() => {
    const setResponsiveness = () => {
      return window.innerWidth < 900
        ? setState((prevState) => ({ ...prevState, mobileView: true }))
        : setState((prevState) => ({ ...prevState, mobileView: false }));
    };
    setResponsiveness();
    window.addEventListener("resize", () => setResponsiveness());
    return () => {
      window.removeEventListener("resize", () => setResponsiveness());
    };
  }, []);

  const trigger = useScrollTrigger();

  const displayDesktop = () => {
    return (
      <Toolbar>
        <Link to="/">
          <img
            height={colorChange ? 50 : 70}
            src={colorChange ? StaticImages.LogoDark : StaticImages.LogoLight}
            alt="logo"
          />
        </Link>
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {getMenuButtons()}
        </Box>

        <Stack
          sx={{ flexGrow: 0 }}
          direction="row"
          alignItems={"center"}
          justifyContent="space-evenly"
          spacing={2}
        >
          <Badge
            color="primary"
            showZero
            badgeContent={cartState.cartItemsCount}
            max={77}
            sx={{ marginInline: 2 }}
            onClick={() => {
              dispatch(actions.cartPopup(true));
            }}
          >
            <ShoppingCart
              sx={{ fontSize: 18 }}
              color={trigger ? "black" : "white"}
              role="button"
            />
          </Badge>
          {authState.isLoggedIn && authState.token !== null && authState.user.role_id=="ROLE_CUSTOMER"  ? (
            <>
              <Box sx={{ flexGrow: 0 }}>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Typography marginRight={1} color="white">
                    {authState.user?.name}
                  </Typography>
                  <Avatar
                    sx={{ width: 35, height: 35, bgcolor: 'purple' }}
                    alt={authState.user?.name}
                    src={authState.user?.image || '/'}
                  />{" "}
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
                  <MenuItem
                    onClick={() => {
                      dispatch(actions.popupMyOrders(true));
                      handleCloseUserMenu();
                    }}
                  >
                    <Typography textAlign="center">My Orders</Typography>
                  </MenuItem>
                  <MenuItem onClick={() => logout()}>
                    <Typography textAlign="center">Logout</Typography>
                  </MenuItem>
                </Menu>
              </Box>
              {/* 
              <TextBtn
                className={location.pathname === url.MyOrders && "active"}
                onClick={() => {
                  dispatch(actions.popupMyOrders(true));
                }}
                key="My Order"
                sx={{
                  my: 2,
                  display: "block",
                  textAlign: "center",
                  marginInline: "10px",
                }}
              >
                My Orders
              </TextBtn> */}
            </>
          ) : (
            <>
              <PrimaryBtn
                variant="outlined"
                color="primary"
                sx={{ fontWeight: "bold", fontSize: "14px" }}
                round="true"
                onClick={() => {
                  dispatch(actions.popupCustLogin(true));
                }}
              >
                Login
              </PrimaryBtn>
              <PrimaryBtn
                variant="contained"
                color="primary"
                sx={{ fontWeight: "bold", fontSize: "14px" }}
                round="true"
                onClick={() => {
                  dispatch(actions.popupCustSignup(true));
                }}
              >
                Register
              </PrimaryBtn>

              <PrimaryBtn
                variant="contained"
                color="primary"
                sx={{ fontWeight: "bold", fontSize: "14px" }}
                round="true"
                onClick={() => {
                  dispatch(actions.popupCustForgotPwd(true));
                }}
              >
                Forget Password
              </PrimaryBtn>
            </>
          )}
        </Stack>
      </Toolbar>
    );
  };

  const getMenuButtons = () => {
    return pages.map((page, index) => (
      <TextBtn
        className={location.pathname === page.href && "active"}
        component={Link}
        to={page.href}
        key={page.label}
        sx={{
          my: 2,
          display: "block",
          textAlign: "center",
          marginInline: "10px",
        }}
      >
        {page.label}
      </TextBtn>
    ));
  };

  const displayMobile = () => {
    const handleDrawerOpen = () =>
      setState((prevState) => ({ ...prevState, drawerOpen: true }));
    const handleDrawerClose = () =>
      setState((prevState) => ({ ...prevState, drawerOpen: false }));

    return (
      <Toolbar>
        <Box
          sx={{
            flexGrow: 1,
            display: { xs: "flex", md: "none" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 3,
          }}
        >
          <IconButton
            style={{ marginRight: 30 }}
            {...{
              edge: "start",
              color: "inherit",
              "aria-label": "menu",
              "aria-haspopup": "true",
              onClick: handleDrawerOpen,
            }}
          >
            <MenuIcon />
          </IconButton>
          <img
            src={colorChange ? StaticImages.LogoDark : StaticImages.LogoLight}
            alt="logo"
            height={colorChange ? 50 : 70}
          />
          {authState.isLoggedIn && authState.token !== null ? (
            <>
              <Badge
                color="primary"
                showZero
                badgeContent={cartState.cartItemsCount}
                max={77}
                sx={{ marginInline: 2 }}
                onClick={() => {
                  dispatch(actions.cartPopup(true));
                }}
              >
                <ShoppingCart
                  sx={{ fontSize: 18 }}
                  color={trigger ? "black" : "white"}
                  role="button"
                />
              </Badge>
            </>
          ) : (
            <>
              <PrimaryBtn
                variant="outlined"
                color="primary"
                round="true"
                onClick={() => {
                  dispatch(actions.popupCustLogin(true));
                }}
              >
                Login
              </PrimaryBtn>
            </>
          )}
        </Box>

        <Sidebar
          {...{
            anchor: "left",
            open: drawerOpen,
            onClose: handleDrawerClose,
          }}
        >
          {authState.isLoggedIn && authState.token !== null && (
            <List>
              <TextBtn
                sx={{
                  my: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "start",
                  gap: "15px",
                }}
              >
                <Avatar>{(authState.user?.name).slice(0, 1)}</Avatar>{" "}
                {authState.user?.name}
              </TextBtn>

              <StyledDivider />
            </List>
          )}

          <List>{getDrawerChoices({ handleDrawerClose })}</List>
          {authState.isLoggedIn && authState.token !== null && (
            <List>
              <ListItem>
                <PrimaryBtn
                  onClick={() => logout()}
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                >
                  Logout
                </PrimaryBtn>
              </ListItem>
            </List>
          )}
          <CloseBtn VPosition="top" onClick={handleDrawerClose}>
            <CloseIcon />
          </CloseBtn>
        </Sidebar>
      </Toolbar>
    );
  };

  const getDrawerChoices = ({ handleDrawerClose }) => {
    return pages.map((page) => (
      <ListItem
        disablePadding
        key={page.label}
        component={Link}
        to={page.href}
        onClick={() => handleDrawerClose()}
        className="sidebarBtn"
      >
        <ListItemButton>
          <ListItemText primary={page.label} />
        </ListItemButton>
      </ListItem>
    ));
  };

  const [colorChange, setColorchange] = useState(false);
  const changeNavbarColor = () => {
    if (window.scrollY >= 80) {
      setColorchange(true);
    } else {
      setColorchange(false);
    }
  };
  window.addEventListener("scroll", changeNavbarColor);

  return (
    <TopBar
      location={location.pathname}
      elevation={colorChange ? 4 : 0}
      className={colorChange ? "bgChange" : "transparent"}
    >
      <Container maxWidth="xl">
        {mobileView ? displayMobile() : displayDesktop()}
      </Container>
    </TopBar>
  );
};
export default Header;

const TopBar = styled(AppBar)`
  transition: all 0.2s linear;
  ${({ location }) =>
    location === "/" &&
    `
    position:fixed;
    top:0;
    &.bgChange {
    background-color: #fff;
    color: ${Theme.color};
    padding-block: 0;
    & .MuiButton-text {
      color: inherit;
      &.active {
        color: ${Theme.palette.secondary.dark};
      }
    }
  }
  &.transparent {
    background-color: transparent;
    color: #fff;
    padding-block: 15px;
    & .MuiButton-text {
      color: inherit;
      &.active {
        font-weight:bold;
        color: ${Theme.palette.secondary.dark};
      }
    }

  }`}
  ${({ location }) =>
    location !== "/" &&
    `&.bgChange {
      background-color: #fff;
      position:fixed;
      top:0;
      color: ${Theme.color};
      padding-block: 0;
      & .MuiButton-text {
        color: inherit;
        &.active {
          font-weight:bold;
          color: ${Theme.palette.secondary.dark};
        }
      }
    }
    &.transparent {
      background-color: #fff;
      position:relative;
      color: ${Theme.color};
      padding-block: 15px;
      & .MuiButton-text {
        color: ${Theme.color};
        &.active {
          font-weight:bold;
          color: ${Theme.palette.secondary.dark};
        }
      }
     
    }`}

  & .MuiToolbar-root {
    padding-left: 0;
    padding-right: 0;
  }
  & .MuiBadge-badge {
    cursor: pointer;
  }
  & .sidebarBtn {
    & .MuiTypography-root {
      color: ${Theme.color};
    }
  }
`;

const Sidebar = styled(Drawer)`
  & .MuiPaper-root {
    width: 90%;
  }
`;
