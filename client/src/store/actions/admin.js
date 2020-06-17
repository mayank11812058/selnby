import * as actionTypes from './actionTypes';
import axios from 'axios';
import * as shopActions from './shop';

export const cartFail = (error) => {
    return {
        type : actionTypes.SET_ERRORS,
        errors : [...error]
    };
}

export const addToCartSuccess = (res, history) => {
    return dispatch => {
        if(res.error){
            dispatch(cartFail(res.error));
        }else{
            if(history){
                history.push('/cart');
            }

            dispatch(getCart());
        }
    }
}

export const addToCart = (productId, history) => {
    return dispatch => {
        axios.post(`https://selnby.herokuapp.com/addToCart` , {productId : productId})
        .then(res => {
            dispatch(addToCartSuccess(res.data, history));
        }).catch(err => {

        });
    }
}

export const removeFromCartSuccess = (res) => {
    return dispatch => {
        if(res.error){
            dispatch(cartFail(res.error));
        }else{
            dispatch(getCart());
        }
    }
}

export const removeFromCart = (productId) => {
    return dispatch => {
        axios.post(`https://selnby.herokuapp.com/removeFromCart` , {productId : productId})
        .then(res => {
            dispatch(removeFromCartSuccess(res.data));
        }).catch(err => {
            
        });
    }
}


export const getCartSuccess = (res) => {
    return {
        type : actionTypes.GET_CART,
        res : res.cart
    };
}

export const getCart = () => {
    return dispatch => {
        axios.get(`https://selnby.herokuapp.com/getCart`)
        .then(res => {
            dispatch(getCartSuccess(res.data));
            dispatch(setLoading());
        }).catch(err => {
            
        });
    }
}

export const productDeleted = (res, history) => {
    if(res.error){
        return {
            type : actionTypes.SET_ERRORS,
            errors : res.error
        };
    }else{
        history.push('/myProducts');
        return {
            type : actionTypes.DEFAULT
        };
    }
}

export const deleteProductSuccess = (productId, history) => {
    return dispatch => {
        axios.delete(`https://selnby.herokuapp.com/delete/${productId}`)
        .then(res => {
            dispatch(productDeleted(res.data, history));
        }).catch(err => {
            
        });
    };
}

export const deleteProduct = (productId, history) => {
    return dispatch => {
        axios.post(`https://selnby.herokuapp.com/clearItemFromCart`, {productId : productId})
        .then(res => {
            if(!res.error){
                dispatch(deleteProductSuccess(productId, history));
            }else{

            }
        }).catch(err => {
            
        })
    };
}

export const addProductSuccess = (res, history) => {
    if(res.error){
        return { 
            type : actionTypes.SET_ERRORS,
            errors : res.error
        };
    }else{
        history.push('/myProducts');
        return {
            type : actionTypes.DEFAULT
        };
    }
}

export const addProduct = (productData, history, productId) => {
    return dispatch => {
        let path = `https://selnby.herokuapp.com/addProduct`;
        
        if(productId){
            path = `https://selnby.herokuapp.com/editProduct/${productId}?edit=true`;
        }

        axios.post(path, productData, {
            headers : {
                'Content-Type' : 'multipart/form-data'
            }
        })
        .then(res => {
            dispatch(addProductSuccess(res.data, history));
            dispatch(setLoading());
        })
        .catch(err => {
            
        })
    }
}

export const clearProductData = () => {
    return {
        type : actionTypes.CLEAR_PRODUCT_DATA
    };
} 

export const orderSuccess = (res, history) => {
    if(res.error){
        return {
            type : actionTypes.SET_ERRORS,
            errors : res.error
        };
    }else{
        history.push('/myOrders');
        return {
            type : actionTypes.DEFAULT
        };
    }
}

export const order = (history) => {
    return dispatch => {
        axios.post(`https://selnby.herokuapp.com/order`)
        .then(res => {
            dispatch(orderSuccess(res.data, history));
        }).catch(err => {
            
        })
    };
}

export const getOrdersSuccess = (res) => {
    if(res.error){
        return { 
            type : actionTypes.SET_ERRORS,
            errors : res.error
        };
    }else{
        return { 
            type : actionTypes.GET_ORDERS_SUCCESS,
            orders : res.orders
        };
    }
}

export const getOrders = () => {
    return dispatch => {
        axios.get(`https://selnby.herokuapp.com/myOrders`)
        .then(res => {
            dispatch(getOrdersSuccess(res.data));
            dispatch(setLoading());
        }).catch(err => {
            
        })
    };
}

export const setLoading = () => {
    return {
        type : actionTypes.SET_LOADING
    };
}

export const addReviewSuccess = (res, productId) => {
    return dispatch => {
        if(res.error){
            return {
                type : actionTypes.SET_ERRORS,
                errors : res.error
            };
        }else{
            dispatch(shopActions.getProduct(productId));
        }
    }
}

export const addReview = (productId, review) => {
    return dispatch => {
        axios.post(`https://selnby.herokuapp.com/addReview`, {
            productId : productId,
            review : review
        }).then(res => {
            dispatch(addReviewSuccess(res.data, productId));
        }).catch(err => {
            // console.log('err in addReview reducer');
        });
    }
}

export const removeReviewSuccess = (res, productId) => {
    return dispatch => {
        if(res.error){
            return {
                type : actionTypes.SET_ERRORS,
                errors : res.error
            };
        }else{
            dispatch(shopActions.getProduct(productId));
        }
    }
}

export const removeReview = (productId) => {
    return dispatch => {
        axios.post(`https://selnby.herokuapp.com/removeReview`, {
            productId : productId
        }).then(res => {
            dispatch(removeReviewSuccess(res.data, productId));
        }).catch(err => {
            // console.log('err in removeReview reducer');
        });
    }
}

export const getBoughtProductsSuccess = (res) => {
    if(res.error){
        return {
            type : actionTypes.SET_ERRORS,
            errors : res.error
        };
    }else{
        return {
            type : actionTypes.GET_BOUGHT_PRODUCTS,
            boughtProducts : res.boughtProducts
        };
    }
}

export const getBoughtProducts = () => {
    return dispatch => {
        axios.get(`https://selnby.herokuapp.com/getBoughtProducts`)
        .then(res => {
            dispatch(getBoughtProductsSuccess(res.data));
        }).catch(err => {
            // console.log('error in getBoughtProducts', err);
        });
    };
}