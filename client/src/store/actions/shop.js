import * as actionTypes from './actionTypes';
import axios from 'axios';

export const getProductsSucess = res => {
    if(res.error){
        return {
            type : actionTypes.SET_ERRORS,
            errors : res.error
        }
    }

    return {
        type : actionTypes.GET_PRODUCTS,
        products : res
    };
}

export const getProducts = (path) => {
    return dispatch => {
        if(path === '/'){
            path = '/shop';
        }

        axios.get(`https://selnby.herokuapp.com${path}`)
        .then(res => {
            dispatch(getProductsSucess(res.data));
        }).catch(err => {
            // console.log('error in getProducts action');
        });
    };
}

export const getProductSucess = (res, history) => {
    if(res.error){
        history.push('/');
        return {
            type : actionTypes.SET_ERRORS,
            errors : res.error
        }
    }

    return {
        type : actionTypes.GET_PRODUCT,
        res : res
    };
}

export const getProduct = (productId, history) => {
    return dispatch => {
        axios.get(`https://selnby.herokuapp.com/product/${productId}`)
        .then(res => {
            dispatch(getProductSucess(res.data, history));
        }).catch(err => {
            // console.log('Err occured in getProduct');
        })
    }
}

export const setLoading = () => {
    return {
        type : actionTypes.SET_LOADING
    };
}

export const resetLoading = () => {
    return {
        type : actionTypes.RESET_LOADING
    };
}

export const setNav = () => {
    return {
        type : actionTypes.SET_NAV
    };
}

export const resetNav = () => {
    return {
        type : actionTypes.RESET_NAV
    };
}
