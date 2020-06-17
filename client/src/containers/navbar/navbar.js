import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import Hoc from '../../Hoc/Hoc';
import * as authActions from '../../store/actions/auth';
import * as shopActions from '../../store/actions/shop';
import {withRouter} from 'react-router';
import classnames from 'classnames';
import classes from './navbar.module.css';
import $ from 'jquery';

class Navbar extends Component {
    closeSidebar = () => {
        $('.Sidebar').css('width', '0');
        $('.Sidebar').css('display', 'none');
        this.props.resetNav();   
    }

    showSidebar = () => {
        $('.Sidebar').css('width', '25vw');
        $('.Sidebar').css('display', 'flex');
        this.props.setNav();
    }

    render() {
        let sideAuthLink;
        let authLink =  <Hoc>
                            <li className={classnames("nav-item", classes.navItem, {"active" : window.location.pathname === '/signin'})}>
                                <Link className={classnames("nav-link text-center text-dark authLink", classes.navLink)} style={{right : "9vmin"}} to="/signup">Sign Up</Link>
                            </li>
                            <li className={classnames("nav-item", classes.navItem, {"active" : window.location.pathname === '/login'})}>
                                <Link className={classnames("nav-link text-center text-dark authLink", classes.navLink)} style={{margin : "0px", right : "1vmin"}} to="/login">Login</Link>
                            </li>
                        </Hoc>;
        
        sideAuthLink = <Hoc>
                            <li className={classnames("nav-item", {"active" : window.location.pathname === '/signin'})}>
                                <Link className={classnames("nav-link text-center text-dark", classes.sideLink)} to="/signup">Sign Up</Link>
                            </li>
                            <li className={classnames("nav-item", {"active" : window.location.pathname === '/login'})}>
                                <Link className={classnames("nav-link text-center text-dark", classes.sideLink)} to="/login">Login</Link>
                            </li>
                        </Hoc>;
        
        if(this.props.isAuthenticated){
            authLink = <Hoc>
                            <li className={classnames("nav-item", classes.navItem, {"active" : window.location.pathname === '/addProduct'})}>
                                <Link className={classnames("nav-link text-center text-dark", classes.navLink)} to="/addProduct">Add Product</Link>
                            </li>
                            <li className={classnames("nav-item", classes.navItem, {"active" : window.location.pathname === '/myOrders'})}>
                                <Link className={classnames("nav-link text-center text-dark", classes.navLink)} to="/myOrders">Orders</Link>
                            </li>
                            <li className={classnames("nav-item", classes.navItem)}>
                                <Link className={classnames("nav-link text-center text-dark authLink", classes.navLink)} style={{right : "1vmin"}} onClick={() => this.props.logOut()} to="/login">Logout</Link>
                            </li>
                        </Hoc>;
            
            sideAuthLink = <Hoc>
                                <li className={classnames("nav-item", {"active" : window.location.pathname === '/addProduct'})}>
                                    <Link className={classnames("nav-link text-center text-dark", classes.sideLink, {"active" : window.location.pathname === '/addProduct'})} to="/addProduct">Add Product</Link>
                                </li>
                                <li className={classnames("nav-item", {"active" : window.location.pathname === '/myOrders'})}>
                                    <Link className={classnames("nav-link text-center text-dark", classes.sideLink, {"active" : window.location.pathname === '/myOrders'})} to="/myOrders">Orders</Link>
                                </li>
                                <li className={classnames("nav-item")}>
                                    <Link className={classnames("nav-link text-center text-dark", classes.sideLink, {"active" : window.location.pathname === '/logout'})} onClick={() => this.props.logOut()} to="/login">Logout</Link>
                                </li>
                            </Hoc>;
        }

        let navigationBar = (<div className={classnames('navbar navbar-expand p-0 mb-2', classes.navbar)}>
                                <ul className={classnames("navbar-nav")}>
                                    <li className={classnames("nav-item", classes.navItem)}>
                                        <img src="https://selnby.herokuapp.com/images/selnby.jpg" alt="Logo"/>
                                    </li>
                                    <li className={classnames("nav-item icon", classes.icon)}>
                                        <button className="btn btn-light" onClick={() => this.showSidebar()}><i className="fas fa-bars"></i></button>
                                    </li>
                                    <li className={classnames("nav-item", classes.navItem, {"active" : window.location.pathname === '/'})}>
                                        <Link className={classnames("nav-link text-center text-dark", classes.navLink)} to='/'>Home</Link>
                                    </li>
                                    <li className={classnames("nav-item", classes.navItem, {"active" : window.location.pathname === '/myProducts'})}>
                                        <Link className={classnames("nav-link text-center text-dark", classes.navLink)} to="/myProducts">My Products</Link>
                                    </li>
                                    <li className={classnames("nav-item", classes.navItem, {"active" : window.location.pathname === '/cart'})}>
                                        <Link className={classnames("nav-link text-center text-dark", classes.navLink)} to="/cart"><i className="fas fa-shopping-bag"></i>Cart</Link>
                                    </li>
                                    {authLink}
                                </ul>
                            </div>);
        
        if(!this.props.showNavBar){
            navigationBar = '';
        }

        let sidebar = (<div className={classnames('Sidebar navbar p-0', classes.Sidebar)}>
                        <ul className={classnames("navbar-nav", classes.SidebarNav)}>
                            <li className={classnames("nav-item")}>
                                <button className={classnames("text-dark btn", classes.closebtn)} onClick={() => this.closeSidebar()}>&times;</button>
                            </li>
                            <li className={classnames("nav-item")}>
                                <img src="http://localhost:5000/images/selnby.jpg" alt="Logo"/>
                            </li>
                            <li className={classnames("nav-item")}>
                                <Link className={classnames("nav-link text-center text-dark", classes.sideLink, {"active" : window.location.pathname === '/'})} to='/'>Home</Link>
                            </li>
                            <li className={classnames("nav-item")}>
                                <Link className={classnames("nav-link text-center text-dark", classes.sideLink, {"active" : window.location.pathname === '/myProducts'})} to="/myProducts">My Products</Link>
                            </li>
                            <li className={classnames("nav-item")}>
                                <Link className={classnames("nav-link text-center text-dark", classes.sideLink, {"active" : window.location.pathname === '/cart'})} to="/cart"><i className="fas fa-shopping-bag"></i>Cart</Link>
                            </li>
                            {sideAuthLink}
                        </ul>
                    </div>);

        if(!this.props.showSidebar){
            sidebar = '';
        }

        return (
            <Hoc>
                {navigationBar}
                {sidebar}
            </Hoc>
        );
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated : state.auth.isAuthenticated,
        showNavBar : state.shop.showNavBar,
        showSidebar : state.shop.showSidebar
    };
}

const mapDispatchToProps = dispatch => {
    return {
        logOut : () => dispatch(authActions.logOut()),
        setNav : () => dispatch(shopActions.setNav()),
        resetNav : () => dispatch(shopActions.resetNav())
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Navbar));