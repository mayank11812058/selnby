import thunk from 'redux-thunk';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import shopReducer from './reducers/shop';
import authReducer from './reducers/auth';
import adminReducer from './reducers/admin';
import errorReducer from './reducers/error';

const rootReducer = combineReducers({
    shop : shopReducer, 
    auth : authReducer,
    admin : adminReducer,
    error : errorReducer
});

//const composeEnhancers = process.env.NODE_ENV === 'development' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : null || compose;
const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;