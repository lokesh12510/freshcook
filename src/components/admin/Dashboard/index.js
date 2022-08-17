import { Typography } from "@mui/material";
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { SectionBox, StyledContainer } from "../../../utils/constants/Styles";

export const Dashboard = (props) => {
  return (
    <>
      <StyledContainer maxWidth="lg">
        <SectionBox className="card">
          <Typography variant="h5" component="div" fontWeight="bold">
            Dashboard
          </Typography>
        </SectionBox>
      </StyledContainer>
    </>
  );
};
