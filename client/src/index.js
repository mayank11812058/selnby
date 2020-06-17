import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './containers/App/App';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter} from 'react-router-dom';
import {Provider} from 'react-redux';
import store from './store/store';
import setAuth from './utility/setAuth';
import jwt_decode from 'jwt-decode';
import * as authActions from './store/actions/auth';

if(localStorage.getItem('jwtToken')){
  const token = localStorage.getItem('jwtToken');
  setAuth(token);
  const decodedToken = jwt_decode(token);
  store.dispatch(authActions.setLoginState(decodedToken, null));
}

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
