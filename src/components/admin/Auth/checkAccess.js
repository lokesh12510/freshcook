import React from "react";
import { useSelector } from 'react-redux';

import * as actions from '../../../utils/store/actions';

const CheckAccess = ({ children, request }) => {
  const { user } = useSelector((state) => state.auth);
  const permission = actions.authGrantPermission(request, user);
  
  return (
    <>
      {permission && children}
    </>
  );
};

export default CheckAccess;