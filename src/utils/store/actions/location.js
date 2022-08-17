import * as actionTypes from './actionTypes';
import * as commonHelper from '../../helpers/commonHelper';

export const locationLoading = (status) => {
    return {
        type: actionTypes.LOCATION_LOADING,
        payload: {
            loading: status,
        },
    };
};

export const locationPopup = (status) => {
    return {
        type: actionTypes.LOCATION_POPUP,
        payload: {
            popup: status,
        },
    };
};

export const updateLocation = (location) => {
    let payload = {
        latitude: location.latitude || null,
        longitude: location.longitude || null,
        address: location.address || null,
    };
    localStorage.setItem('location', JSON.stringify(payload));
    return {
        type: actionTypes.LOCATION_UPDATE,
        payload: {
            ...payload,
        },
    };
};

export const deleteLocation = () => {
    localStorage.removeItem('location');
    return {
        type: actionTypes.LOCATION_DELETE,
    };
};

export const locationOnLoad = () => {
    return dispatch => {
        let location = localStorage.getItem('location');
        if(location && location !== null)
        {
            location = commonHelper.parseJSON(location);
            if(location && location.latitude && location.longitude)
            {
                dispatch(updateLocation({
                    latitude: location.latitude,
                    longitude: location.longitude,
                    address: location.address,
                }));
            }
            else
            {
                dispatch(deleteLocation());
            }
        }
    };
};
