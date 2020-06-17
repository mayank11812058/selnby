import * as actionTypes from './actionTypes';

export const clearError = (indexes) => {
    return {
        type : actionTypes.CLEAR_ERROR,
        indexes : indexes
    };
}

export const clearErrors = () => {
    return {
        type : actionTypes.CLEAR_ERRORS
    };
}