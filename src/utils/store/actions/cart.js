import * as actionTypes from './actionTypes';
import * as commonHelper from '../../helpers/commonHelper';

export const cartLoading = (status) => {
    return {
        type: actionTypes.CART_LOADING,
        payload: {
            loading: status,
        },
    };
};

export const cartPopup = (status) => {
    return {
        type: actionTypes.CART_POPUP,
        payload: {
            popup: status,
            previewId: null,
        },
    };
};

export const cartUpdate = (payload) => {
    return {
        type: actionTypes.CART_UPDATE,
        payload: {
            ...payload,
        },
    };
};

export const cartClear = () => {
    localStorage.removeItem('cartItems');
    return {
        type: actionTypes.CART_CLEAR,
        payload: {
            cartItems: [],
        },
    };
};

export const cartItemAdd = (item) => {
    return {
        type: actionTypes.CART_ITEM_ADD,
        payload: {
            ...item,
        },
    };
};

export const cartItemUpdate = (item) => {
    return {
        type: actionTypes.CART_ITEM_UPDATE,
        payload: {
            ...item,
        },
    };
};

export const cartItemDelete = (item) => {
    return {
        type: actionTypes.CART_ITEM_DELETE,
        payload: {
            ...item,
        },
    };
};

export const cartItemQtyPlus = (item) => {
    return {
        type: actionTypes.CART_ITEM_QTY_PLUS,
        payload: {
            ...item,
        },
    };
};

export const cartItemQtyMinus = (item) => {
    return {
        type: actionTypes.CART_ITEM_QTY_MINUS,
        payload: {
            ...item,
        },
    };
};

export const cartItemsLocalSync = (cartItems) => {
    if(cartItems && cartItems.length > 0)
    {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
    else
    {
        localStorage.removeItem('cartItems');
    }
};

export const cartItemsOnLoad = () => {
    return dispatch => {
        let cartItems = localStorage.getItem('cartItems');
        if(cartItems && cartItems !== null)
        {
            cartItems = commonHelper.parseJSON(cartItems);
            if(cartItems && cartItems.length > 0)
            {
                dispatch(cartUpdate({
                    cartItems: cartItems,
                }));
            }
            else
            {
                localStorage.removeItem('cartItems');
            }
        }
    };
};
