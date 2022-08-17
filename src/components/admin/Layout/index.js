import React from "react";
import {  useSelector } from "react-redux";

import Header from "./Header";
import Footer from "./Footer";

const Layout = (props) => {
  const authState = useSelector((state) => state.auth);

  return (
    <>
      {authState.isLoggedIn && authState.token !== null && <Header />}

      {props.children}

  
    </>
  );
};

export default Layout;
