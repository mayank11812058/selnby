import React, {Component} from 'react';
import {Route, Switch, Redirect} from 'react-router-dom';
import Navbar from '../navbar/navbar';
import Home from '../Home/Home';
import Login from '../auth/Login'; 
import Signin from '../auth/Signin';
import Cart from '../Cart/Cart';
import AddProduct from '../AddProduct/AddProduct';
import {connect} from 'react-redux';
import Product from '../Product/Product';
import Orders from '../Orders/Orders';
import Footer from '../../components/Footer/Footer';
import ResetPassword from '../auth/ResetPassword';

class App extends Component{
    render(){
        let margin = '0px';

        if(this.props.showSidebar){
            margin = '25vw';
        }

        let myProducts = <Switch>
                            <Route exact path="/" component={Home} />
                            <Route exact path="/login"  component={Login} />
                            <Route exact path="/signup" component={Signin} />
                            <Route exact path="/product/:productId" component={Product} />
                            <Redirect exact from="/myProducts" to="/login" />
                            <Redirect exact from="/cart" to="/login" />
                            <Redirect exact from="/addProduct" to="/login" />
                            <Redirect exact from="/editProduct/:productId" to="/login" />
                            <Redirect exact from="/myOrders" to="/login" />
                            <Route exact path="/forgotPassword" component={ResetPassword} />
                            <Route exact path="/resetPassword/:token" component={ResetPassword} />
                            <Redirect  to="/" />
                        </Switch>;

        if(this.props.isAuthenticated){
           myProducts = (<Switch>
                            <Route exact path="/" component={Home} />
                            <Route exact path="/product/:productId" component={Product} />
                            <Route exact path="/myProducts" component={Home}/>
                            <Route exact path="/cart" component={Cart} />
                            <Route exact path="/addProduct" component={AddProduct} />
                            <Route exact path="/editProduct/:productId" component={AddProduct} />
                            <Route exact path="/myOrders" component={Orders} />
                            <Redirect to="/"/>
                        </Switch>); 
        }

        return <div className="app container-fluid p-0 m-0">
                    <Navbar />
                    <div style={{marginLeft : margin}}>
                        {myProducts}
                        <Footer />
                    </div>
               </div>;
    }
}

const mapStateToProps = (state) => {
    return {
        isAuthenticated : state.auth.isAuthenticated,
        showSidebar : state.shop.showSidebar
    };
}

export default connect(mapStateToProps)(App);