import React from "react";
import { Container, Divider, Grid, Stack, Typography } from "@mui/material";
import styled from "styled-components";

import StaticImages from "../../../utils/constants/Images";
import { IconBtn } from "../../../utils/constants/Styles";
import { Theme } from "../../../utils/constants/Theme";
import { StyledFacebookIcon, StyledInstagramIcon, StyledTwitterIcon, StyledYoutubeIcon } from "../../../utils/constants/Icons";

const Footer = () => {
  return (
    <FooterSection>
      <Container maxWidth="xl">
        <Grid container spacing={{ xs: 0, md: 3 }}>
          <Grid item xs={12} sm={6} md={4} lg>
            <FooterList>
              <FooterListHeader className="listTitle">
                Popular Locations
              </FooterListHeader>
              <FooterListItem>Barcelona</FooterListItem>
              <FooterListItem>Brazil</FooterListItem>
              <FooterListItem>Florida</FooterListItem>
              <FooterListItem>France</FooterListItem>
              <FooterListItem>United Kingdom</FooterListItem>
            </FooterList>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg>
            <FooterList>
              <FooterListHeader className="listTitle">
                Popular Cuisines
              </FooterListHeader>
              <FooterListItem>BB.Q</FooterListItem>
              <FooterListItem>Cheese Burger</FooterListItem>
              <FooterListItem>Hot Dogs</FooterListItem>
              <FooterListItem>Pizza</FooterListItem>
              <FooterListItem>Stakes</FooterListItem>
            </FooterList>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg>
            <FooterList>
              <FooterListHeader className="listTitle">Menu</FooterListHeader>
              <FooterListItem>Home</FooterListItem>
              <FooterListItem>Blog Large</FooterListItem>
              <FooterListItem>Contact</FooterListItem>
              <FooterListItem>FAQ’s</FooterListItem>
              <FooterListItem>How it works</FooterListItem>
            </FooterList>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg>
            <FooterList>
              <FooterListHeader className="listTitle">
                Connect With Us{" "}
              </FooterListHeader>
              <FooterListItem>+1255655488</FooterListItem>
              <FooterListItem>info@homecook.com</FooterListItem>
              <FooterListItem>coimbatore, India</FooterListItem>
              <FooterListItem>
                <Stack
                  alignItems={"center"}
                  justifyContent={{ xs: "center", md: "start" }}
                  direction={"row"}
                >
                  <IconBtn>
                    <StyledTwitterIcon hover="white" color="gray" />
                  </IconBtn>
                  <IconBtn>
                    <StyledFacebookIcon hover="white" color="gray" />
                  </IconBtn>
                  <IconBtn>
                    <StyledInstagramIcon hover="white" color="gray" />
                  </IconBtn>
                  <IconBtn>
                    <StyledYoutubeIcon hover="white" color="gray" />
                  </IconBtn>
                </Stack>
              </FooterListItem>
            </FooterList>
          </Grid>
          <Grid item sm={12} md={4} lg={3}>
            <FooterContent>
              {" "}
              <span
                style={{
                  color: Theme.secondary.dark,
                  textTransform: "uppercase",
                }}
              >
                Homecook
              </span>{" "}
              In Your Mobile! Get Our App
            </FooterContent>
            <Stack
              alignItems={{ xs: "center", sm: "center", md: "start" }}
              justifyContent="center"
              direction={{ xs: "column", sm: "row", md: "column" }}
              spacing={1}
              mb={4}
            >
              <img
                src={StaticImages.GooglePlay2x}
                alt="google play"
                width="160px"
              />
              <img
                src={StaticImages.AppStore2x}
                alt="App Store"
                width="160px"
              />
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <Divider style={{ backgroundColor: "white", marginBottom: 20 }} />
            <Stack
              alignItems={"center"}
              justifyContent="space-between"
              direction={"row"}
            >
              <CopyRightText>
                ©{" "}
                <span
                  style={{
                    color: Theme.secondary.dark,
                    textTransform: "uppercase",
                  }}
                >
                  Homecook
                </span>{" "}
                ALL RIGHTS RESERVED
              </CopyRightText>
              <CopyRightText>
                POWERED BY{" "}
                <span
                  style={{
                    color: Theme.secondary.dark,
                    textTransform: "uppercase",
                  }}
                >
                  intergy
                </span>{" "}
              </CopyRightText>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </FooterSection>
  );
};

export default Footer;

const FooterSection = styled.section`
  background-color: ${Theme.footerColor};
  color: #fff;
  padding-bottom: 30px;
  margin-top: 25px;
`;

const FooterContent = styled.div`
  font-size: 16px;
  color: white;
  font-weight: 600;
  margin-bottom: 0px;
  padding-block: 10px;
  @media (max-width: 900px) {
    text-align: center;
  }
`;

const FooterList = styled.ul`
  list-style: none;
  padding: 0;
  //   width: 100%;
`;

const FooterListHeader = styled.li`
  position: relative;
  padding-block: 10px;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  border-bottom: 2px solid #fff;
  margin-bottom: 5px;
  &:after {
    content: "";
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100px;
    height: 3px;
    background-color: ${Theme.secondary.dark};
  }
  @media (max-width: 900px) {
    text-align: center;
    &:after {
      right: 0;
      left: 0;
      margin-left: auto;
      margin-right: auto;
    }
  }
`;

const FooterListItem = styled.li`
  padding-block: 3px;
  font-size: 14px;
  font-weight: bold;
  color: #999999;
  &:last-child {
    margin-bottom: 20px;
  }
  @media (max-width: 900px) {
    text-align: center;
  }
`;

const CopyRightText = styled(Typography)`
  color: white;
  text-transform: uppercase;
  font-size: 14px;
`;
