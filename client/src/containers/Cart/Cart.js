import React, { Component } from 'react'
import * as adminActions from '../../store/actions/admin';
import * as shopActions from '../../store/actions/shop';
import {connect} from 'react-redux';
import Spinner from '../../components/Spinner/Spinner';

class Cart extends Component {
    componentDidMount(){
        this.props.getCart();
    }

    componentWillUnmount(){
        this.props.resetLoading();
    }

    render() {
        let show;

        if(this.props.cart.length > 0){
            show = (<div className="container my-2 mx-auto p-0 w-60">
                        <div className="d-flex justify-content-between mx-1">
                            <div className="font-weight-bold">{this.props.cart.length} Items</div>
                            <div className="font-weight-bold">Total Price: &#8377;{this.props.price}</div>
                        </div>
                        {this.props.cart.map(item => {
                            return <div key={item.productId._id} className="container row p-0 my-3 mx-1" style={{boxShadow : "0px 1px 3px grey"}}>
                                        <div className="col-3 p-0 m-0">
                                            <img src={`https://selnby.herokuapp.com/${item.productId.imageUrl}`} alt="productImage" style={{width : "100%", height : "20vh", boxShadow: "0px 1px 4px grey"}} />
                                        </div>
                                        <div className="col-9 m-0">
                                            <h2 className="text-center font-weight-bolder">{item.productId.title}</h2>
                                            <p className="text-center text-justify text-capitalize ml-1">{item.productId.description}</p>
                                            <p className="text-center font-weight-bold">&#8377;{item.productId.price}</p>
                                            <div className="text-center align-bottom">
                                                Qty : {item.count} 
                                                <div className="btn-group">
                                                    <button className="btn btn-outline-primary" onClick={() => this.props.addToCart(item.productId._id)}>+</button>
                                                    <button className="btn btn-outline-primary" onClick={() => this.props.removeFromCart(item.productId._id)}>-</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                        })}
                        <button className="btn btn-primary d-block mx-auto" onClick={() => this.props.order(this.props.history)}>Order Now</button>
                    </div>);
        }else{
            show = <p className="text-center display-5">You have no Items in your cart.</p>;
        }

        if(this.props.loading){
            show = <Spinner />;
        }
        
        return (
            show
        );
    }
}

const mapStateToProps = state => {
    return {
        cart : state.admin.cart,
        price : state.admin.price,
        error : state.error.errors,
        loading : state.shop.loading
    };
}

const mapDispatchToProps = dispatch => {
    return {
        getCart : () => dispatch(adminActions.getCart()),
        addToCart : (productId) => dispatch(adminActions.addToCart(productId)),
        removeFromCart : (productId) => dispatch(adminActions.removeFromCart(productId)),
        order : (history) => dispatch(adminActions.order(history)),
        resetLoading : () => dispatch(shopActions.resetLoading())
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Cart);