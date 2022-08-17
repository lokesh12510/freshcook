import * as actionTypes from './actionTypes';

export const popupCustLogin = (status) => {
    return {
        type: actionTypes.POPUP_CUST_LOGIN,
        payload: {
            custLogin: status,
        },
    };
};

export const popupCustSignup = (status) => {
    return {
        type: actionTypes.POPUP_CUST_SIGNUP,
        payload: {
            custSignup: status,
        },
    };
};

export const popupCookSignup = (status) => {
    return {
        type: actionTypes.POPUP_COOK_SIGNUP,
        payload: {
            cookSignup: status,
        },
    };
};

export const popupCustForgotPwd = (status) => {
    return {
        type: actionTypes.POPUP_CUST_FORGOT_PWD,
        payload: {
            custForgotPwd: status,
        },
    };
};

export const popupMyOrders = (status) => {
    return {
        type: actionTypes.POPUP_MY_ORDERS,
        payload: {
            myOrders: status,
        },
    };
};
