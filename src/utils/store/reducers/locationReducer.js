import * as actionTypes from '../actions/actionTypes';

const initialState = {
    loading: false,
    popup: false,
    latitude: null,
    longitude: null,
    address: null,
};

const locationUpdate = (state, action) => {
    return { ...state, ...action.payload };
};

const locationDelete = (state) => {
    return { ...state, ...initialState };
};


// reducer
const reducer = ( state = initialState, action ) => {
    switch(action.type)
    {
        case actionTypes.LOCATION_POPUP: return locationUpdate(state, action);
        case actionTypes.LOCATION_UPDATE: return locationUpdate(state, action);
        case actionTypes.LOCATION_DELETE: return locationDelete(state);
        default: 
            return state;
    }
};

export default reducer;