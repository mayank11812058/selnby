import React, { Component } from 'react'
import {connect} from 'react-redux';
import {withRouter, Link} from 'react-router-dom';
import * as shopActions from '../../store/actions/shop';
import Product from '../../components/Product/Product';
import Spinner from '../../components/Spinner/Spinner';

class Home extends Component {
    state = {
        products : []
    };

    static getDerivedStateFromProps = (props, state) => {
        return {
            ...state,
            products : [...props.products]
        };
    }

    componentDidMount(){
        let path = this.props.location.pathname;
        
        if(path !== '/myProducts'){
            path = '/';
        }
        
        this.props.getProducts(path);
    }

    componentWillUnmount(){
        this.props.resetLoading();
    }

    render() {
        let products = this.state.products.map(productData => {
            return <Link key={productData._id} className="text-decoration-none col-6 col-sm-4 col-md-3 col-xl-2 productLink" to={`product/${productData._id}`}><Product title={productData.title} description={productData.description} price={productData.price} imageUrl={productData.imageUrl} /></Link>;
        });

        if(this.props.loading){
            products = <Spinner />
        }

        return (
            <div className="row m-2 mt-3 Home">
                {products}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        products : state.shop.products,
        loading : state.shop.loading,
        error : state.error.errors
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getProducts : (path) => dispatch(shopActions.getProducts(path)),
        resetLoading : () => dispatch(shopActions.resetLoading())
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home));