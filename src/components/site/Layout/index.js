import React from "react";

import Header from "./Header";
import Footer from "./Footer";
import Location from "../Location";
import Cart from "../Cart";
import CustLogin from "../Auth/custLogin";
import CustSignup from "../Auth/custSignup";
import CookSignup from "../Auth/cookSignup";
import CustForgotPwd from "../Auth/custForgotPwd";
import MyOrders from "../MyOrders";

const Layout = (props) => {
  return (
    <>
      <Header />
      {props.children}
      <Footer />
      
      {/* modals */}
      <Location />
      <Cart />
      <CustLogin />
      <CustSignup />
      <CookSignup />
      <CustForgotPwd />
      <MyOrders />
    </>
  );
};

export default Layout;
