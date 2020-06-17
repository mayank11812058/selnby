import * as actionTypes from './actionTypes';
import axios from 'axios';
import setAuth from '../../utility/setAuth';
import jwt_decode from 'jwt-decode';

export const signUpSuccess = (res, history) => {
    if(res.error){
        return {
            type : actionTypes.SET_ERRORS,
            errors : res.error
        };
    }else{
        history.push('/login');
        return {
            type : actionTypes.CLEAR_ERRORS
        };
    }
}

export const signUp = (userData, history) => {
    return dispatch => {
        axios.post(`https://selnby.herokuapp.com/signup`, userData)
        .then(res => {
            dispatch(signUpSuccess(res.data, history));
            dispatch(setLoading());
        }).catch(err => {
            
            // dispatch(signUpFail(err));
        });
    }
}

export const setLoginState = (decodedToken, history) => {
    if(history){
        history.push('/myProducts');
    }

    return {
        type : actionTypes.LOGIN_SUCCESS,
        res : decodedToken
    };
}

export const loginFail = (error) => {
    return {
        type : actionTypes.SET_ERRORS,
        errors : error
    };
}

export const loginSuccess = (res, history) => dispatch => {
    if(res.error){
        dispatch(loginFail(res.error));
        dispatch(setLoading());
    }else{
        localStorage.setItem('jwtToken', res.token);
        setAuth(res.token);
        const decodedToken = jwt_decode(res.token);
        dispatch(setLoginState(decodedToken, history));
        dispatch(setLoading());
    }
}

export const login = (userData, history) => {
    return dispatch => {
        axios.post(`https://selnby.herokuapp.com/login`, userData)
        .then(res => {
            dispatch(loginSuccess(res.data, history));
        }).catch(err => {
            
        });
    }
}

export const logOut = () => dispatch => {
    localStorage.removeItem('jwtToken');
    setAuth(null);
    dispatch(setLoginState(null));  
}

export const setLoading = () => {
    return {
        type : actionTypes.SET_LOADING
    };
}

export const resetPasswordSuccess = (res, location, history) => {
    if(!res.msg || res.msg !== 'Success'){
        return {
            type : actionTypes.SET_ERRORS,
            errors : res.error ? res.error : [],
            msg : res.msg
        };
    }else{
        if(location.pathname === '/forgotPassword'){
            return {
                type : actionTypes.SET_MSG,
                msg : 'We have send an email to specified address. Please check it.'
            };
        }else{
            history.push('/login');
            return {
                type : actionTypes.DEFAULT
            };
        }
    }
}

export const resetPassword = (userData, router) => {
    return dispatch => {
        if(router.location.pathname === '/forgotPassword'){
            axios.post('https://selnby.herokuapp.com/resetConfirm', {
                email : userData.email
            }).then(res => {
                dispatch(resetPasswordSuccess(res.data, router.location, router.history));
            })
            .catch(err => {
                // console.log('err in resetting password 1', err);
            });
        }else{
            axios.post(`https://selnby.herokuapp.com/resetPassword/${router.match.params.token}`, {
                password : userData.password
            }).then(res => {
                dispatch(resetPasswordSuccess(res.data, router.location, router.history));
            })
            .catch(err => {
                // console.log('err in resetting password 2', err);
            });
        }
    };
}

export const resetMsg = () => {
    return {
        type : actionTypes.RESET_MSG
    };
}