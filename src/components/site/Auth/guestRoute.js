import React from "react";
import { Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import * as actions from '../../../utils/store/actions';
import url from '../url';

const GuestRoute = ({ children, ...rest }) => {
    const dispatch = useDispatch();
    const location = useLocation();
    
    // redux store
    const { isLoggedIn, token, user, loading } = useSelector((state) => state.auth);
    
    // if loading 
    if(loading)
    {
        return (
            <p className="container">Checking auth..</p>
        );
    }
    
    // check if customer
    // const allowedRoles = ['ROLE_CUSTOMER'];
    // if(isLoggedIn && token !== null && !allowedRoles.includes(user.role))
    // {
    //     dispatch(actions.authLogout());
    //     return <Navigate to={ url.Home } state={{ from: location }} />;
    // }
    
    return children;
}

export default GuestRoute;