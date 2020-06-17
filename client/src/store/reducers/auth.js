import * as actionTypes from '../actions/actionTypes';

const initialState = {
    isAuthenticated : false,
    userId : '',
    msg : '',
    boughtProducts : []
};

const reducer = (state = initialState, action) => {
    switch(action.type){
        case actionTypes.LOGIN_SUCCESS:
            return {
                ...state,
                isAuthenticated : Boolean(action.res),
                userId : Boolean(action.res) ? action.res.user : '',
                boughtProducts : Boolean(action.res) ? action.res.boughtProducts : ''
            };
        case actionTypes.SET_MSG:
            return {
                ...state,
                msg : action.msg
            };
        case actionTypes.RESET_MSG:
            return {
                ...state,
                msg : ''
            };
        case actionTypes.GET_BOUGHT_PRODUCTS:
            return {
                ...state,
                boughtProducts: action.boughtProducts
            };
        default:
            return state;     
    }
}

export default reducer;