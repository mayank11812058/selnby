import * as actionTypes from '../actions/actionTypes';

const initialState = {
    errors : [],
    msg : ''
};

const reducer = (state = initialState, action) => {
    switch(action.type){
        case actionTypes.SET_ERRORS:
            return {
                ...state,
                errors : action.errors.map(error => {
                    return {
                        ...error
                    };
                }),
                msg : action.msg ? action.msg : ''
            };
        case actionTypes.CLEAR_ERROR:
            return {
                ...state,
                // eslint-disable-next-line 
                errors : state.errors.filter((err, index) => {
                    if(!action.indexes.includes(index)){
                        return err;
                    }
                })
            };
        case actionTypes.CLEAR_ERRORS:
            return {
                ...state,
                errors : [],
                msg : ''
            };
        default:
            return state;     
    }
}

export default reducer;