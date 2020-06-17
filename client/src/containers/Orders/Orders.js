import React, { Component } from 'react'
import * as adminActions from '../../store/actions/admin';
import * as shopActions from '../../store/actions/shop';
import {connect} from 'react-redux';
import Order from './Order/Order';
import Spinner from '../../components/Spinner/Spinner';

class Orders extends Component {
    state = {
        orders : []
    }

    componentDidMount(){
        this.props.getOrders();
    }

    componentWillUnmount(){
        this.props.resetLoading();
    }

    static getDerivedStateFromProps = (props, state) => {
        return {
            ...state,
            orders : props.orders.map(order => {
                return {
                    ...order
                };
            })
        };
    }

    render() {
        let orderList;

        if(this.props.orders.length > 0){
            orderList = this.props.orders.map(order => {
                            return <Order key={order._id} cart={order.cart} id={order._id}/>
                        });
        }else{
            orderList = <p>You have no Orders</p>;
        }

        if(this.props.loading){
            orderList = <Spinner />;
        }
        
        return (
            <div className="container-fluid">
                {orderList}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        orders : state.admin.orders,
        loading : state.shop.loading
    };
}

const mapDispatchToProps = dispatch => {
    return {
        getOrders : () => dispatch(adminActions.getOrders()),
        resetLoading : () => dispatch(shopActions.resetLoading())
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Orders);