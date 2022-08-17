import * as actionTypes from '../actions/actionTypes';

const initialState = {
    custLogin: false,
    custSignup: false,
    cookSignup: false,
    custForgotPwd: false,
    myOrders: false,
};

const popupUpdate = (state, action) => {
    return { ...initialState, ...action.payload };
};

// reducer
const reducer = ( state = initialState, action ) => {
    switch(action.type)
    {
        case actionTypes.POPUP_CUST_LOGIN: return popupUpdate(state, action);
        case actionTypes.POPUP_CUST_SIGNUP: return popupUpdate(state, action);
        case actionTypes.POPUP_COOK_SIGNUP: return popupUpdate(state, action);
        case actionTypes.POPUP_CUST_FORGOT_PWD: return popupUpdate(state, action);
        case actionTypes.POPUP_MY_ORDERS: return popupUpdate(state, action);
        default: 
            return state;
    }
};

export default reducer;