import * as actionTypes from '../actions/actionTypes';

const initialState = {
    loading: false,
    isLoggedIn: false,
    token: null,
    user: {},
};

const authUpdate = (state, action) => {
    return { ...state, ...action.payload };
};

const authLogout = (state) => {
    return { ...state, ...initialState };
};


// reducer
const reducer = ( state = initialState, action ) => {
    switch(action.type)
    {
        case actionTypes.AUTH_LOADING: return authUpdate(state, action);
        case actionTypes.AUTH_LOGIN: return authUpdate(state, action);
        case actionTypes.AUTH_LOGOUT: return authLogout(state);
        case actionTypes.AUTH_UPDATE_USER: return authUpdate(state, action);
        default: 
            return state;
    }
};

export default reducer;