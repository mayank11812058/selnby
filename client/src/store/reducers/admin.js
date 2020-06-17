import * as actionTypes from '../actions/actionTypes';

const initialState = {
    price : 0,
    cart : [],
    orders : []
};

const reducer = (state = initialState, action) => {
    switch(action.type){
        case actionTypes.GET_CART:
            return {
                ...state,
                price : action.res.total,
                cart : action.res.items.map(item => {
                    return {...item}
                }),
            };
        case actionTypes.GET_ORDERS_SUCCESS:
            return {
                ...state,
                orders : action.orders.map(order => {
                    return {...order};
                })
            };
        default:
            return state;     
    }
}

export default reducer;