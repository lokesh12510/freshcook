import React, { useEffect } from "react";
import useBreadcrumbs from "use-react-router-breadcrumbs";
import { useSelector, useDispatch } from "react-redux";
import breadcrumbAction from "../../../utils/store/actions/breadcrumb";
import { Typography } from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import styled from "styled-components";
import { StyledContainer } from "../../../utils/constants/Styles";

const Breadcrumb = () => {
  const dispatch = useDispatch();
  const breadcrumbs = useSelector((state) => state.breadcrumbs);

  function handleClick(event) {
    event.preventDefault();
    console.info("You clicked a breadcrumb.");
  }

  return (
    <StyledContainer maxWidth={"lg"}>
      <div role="presentation" onClick={handleClick}>
        <Breadcrumbs aria-label="breadcrumb">
          {breadcrumbs.map(({ text, link }, index) => (
            <Link
              key={text}
              underline="hover"
              color="primary"
              onClick={() => dispatch(breadcrumbAction.popBreadcrumb())}
              href={link || ""}
            >
              {text}
            </Link>
          ))}

          <Typography color="text.primary">Food</Typography>
        </Breadcrumbs>
      </div>
    </StyledContainer>
  );
};

export default Breadcrumb;
