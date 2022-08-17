import * as actionTypes from '../actions/actionTypes';

const initialState = {
    loading: false,
    popup: false,
    previewId: null,
    cartItems: [],
    cartItemsCount: 0,
    cartTotalAmount: 0,
};

const cartCommon = (state, action) => {
    return {
        ...state,
        ...action.payload,
    };
};

const cartItemAdd = (state, action) => {
    const inCart = state.cartItems.some(item => item.id === action.payload.id);
    if(!inCart)    // if not exists
    {
        return {
            ...state,
            cartItems: [
                ...state.cartItems,
                {
                    ...action.payload,
                    // u_quantity: 1,
                },
            ],
        };
    }
    else
    {
        return {
            ...state,
            cartItems: state.cartItems.map(
                item => item.id === action.payload.id 
                ? {
                    ...item,
                    // u_quantity: item.u_quantity + 1,
                    ...action.payload,
                } 
                : item
            ),
        };
    }
};

const cartItemUpdate = (state, action) => {
    const inCart = state.cartItems.some(item => item.id === action.payload.id);
    if(!inCart)    // if not exists
    {
        return state;
    }
    else
    {
        return {
            ...state,
            cartItems: state.cartItems.map(
                item => item.id === action.payload.id 
                ? {
                    ...item,
                    ...action.payload,
                } 
                : item
            ),
        };
    }
};

const cartItemDelete = (state, action) => {
    const filteredItems = state.cartItems.filter((item) => item.id !== action.payload.id)
    return {
        ...state,
        cartItems: filteredItems,
    };
};

const cartItemQtyPlus = (state, action) => {
    const inCart = state.cartItems.some(item => item.id === action.payload.id);
    if(!inCart)    // if not exists
    {
        return state;
    }
    else
    {
        return {
            ...state,
            cartItems: state.cartItems.map(
                item => item.id === action.payload.id 
                ? {
                    ...item,
                    u_quantity: item.u_quantity + 1,
                    u_subtotal: (item.u_quantity + 1) * item.price,
                } 
                : item
            ),
        };
    }
};

const cartItemQtyMinus = (state, action) => {
    const inCart = state.cartItems.some(item => item.id === action.payload.id);
    if(!inCart)    // if not exists
    {
        return state;
    }
    else
    {
        const cartItem = state.cartItems.find(item => item.id === action.payload.id);
        if(cartItem?.u_quantity === 1)
        {
            return state;
        }
        else
        {
            return {
                ...state,
                cartItems: state.cartItems.map(
                    item => item.id === action.payload.id 
                    ? {
                        ...item,
                        u_quantity: item.u_quantity - 1,
                        u_subtotal: (item.u_quantity - 1) * item.price,
                    } 
                    : item
                ),
            };
        }
    }
};

// reducer
const reducer = ( state = initialState, action ) => {
    switch(action.type)
    {
        case actionTypes.CART_LOADING: return cartCommon(state, action);
        case actionTypes.CART_POPUP: return cartCommon(state, action);
        case actionTypes.CART_UPDATE: return cartCommon(state, action);
        case actionTypes.CART_CLEAR: return cartCommon(state, action);
        case actionTypes.CART_ITEM_ADD: return cartItemAdd(state, action);
        case actionTypes.CART_ITEM_UPDATE: return cartItemUpdate(state, action);
        case actionTypes.CART_ITEM_DELETE: return cartItemDelete(state, action);
        case actionTypes.CART_ITEM_QTY_PLUS: return cartItemQtyPlus(state, action);
        case actionTypes.CART_ITEM_QTY_MINUS: return cartItemQtyMinus(state, action);
        default: 
            return state;
    }
};

export default reducer;