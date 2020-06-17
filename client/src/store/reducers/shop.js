import * as actionTypes from '../actions/actionTypes';

const initialState = {
    products : [],
    productData : {
        userId : '',
        price : '',
        title : '',
        description : '',
        imageUrl : null,
        _id : '',
        reviews : []
    },
    loading : true,
    showNavBar : true,
    showSidebar : false
};

const reducer = (state = initialState, action) => {
    switch(action.type){
        case actionTypes.GET_PRODUCTS:
            return {
                ...state,
                products : action.products.products.map(product => {
                    return {
                        ...product
                    };
                }),
                loading : false
            };
        case actionTypes.GET_PRODUCT:
            return {
                ...state,
                productData : {
                    ...action.res.product
                },
                loading : false
            };
        case actionTypes.CLEAR_PRODUCT_DATA:
            return {
                ...state,
                productData : {
                    userId : '',
                    price : '',
                    title : '',
                    description : '',
                    _id : '',
                    imageUrl : null
                }
            };
        case actionTypes.SET_LOADING:
            return {
                ...state,
                loading : false
            };
        case actionTypes.RESET_LOADING:
            return {
                ...state,
                loading : true
            };
        case actionTypes.SET_NAV:
            return {
                ...state,
                showSidebar: true,
                showNavBar: false
            };
        case actionTypes.RESET_NAV:
            return {
                ...state,
                showSidebar: false,
                showNavBar: true
            };
        default:
            return state;     
    }
}

export default reducer;