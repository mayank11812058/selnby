import React, { Component } from 'react'
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import * as shopActions from '../../store/actions/shop';
import * as adminActions from '../../store/actions/admin';
import Spinner from '../../components/Spinner/Spinner';

class Product extends Component {
    state = {
        title : '',
        imageUrl : '',
        description : '',
        price : 0,
        userId : '',
        creator : '',
        productId : '',
        reviews : [],
        msg : ''
    }

    static getDerivedStateFromProps = (props, state) => {
        return {
            ...state,
            title : props.productData.title,
            imageUrl : props.productData.imageUrl,
            description : props.productData.description,
            price : props.productData.price,
            creator : props.productData.userId,
            productId : props.productData._id,
            userId : props.userId,
            reviews : props.productData.reviews
        };
    }

    componentDidMount(){
        this.props.getProduct(this.props.match.params.productId, this.props.history);
            
        if(this.props.isAuthenticated){
            this.props.getBoughtProducts();
        }
    }

    componentWillUnmount(){
        this.props.resetLoading();
    }

    addReview(){
        if(this.props.isAuthenticated){
            if(this.props.boughtProducts.find(product => product.productId && product.productId.toString() === this.state.productId.toString())){
                const review = document.getElementsByClassName('reviewData')[0].value;
    
                if(review.trim().length > 0){
                    this.props.addReview(this.state.productId, review);
                }
            }else{
                this.setState({msg : 'You can rate only bought products'});
            }
        }else{
            this.setState({msg : 'You must be logged in to rate products'});
        }
    }

    removeReview(){
        this.props.removeReview(this.state.productId);
    }

    render() {
        let buttons;

        if(this.props.isAuthenticated){
            if(this.state.userId && this.state.userId.toString() === this.state.creator.toString()){
                buttons = <div className="row mt-3">
                            <div className="col-4"><button className="btn btn-primary w-100" onClick={() => this.props.addToCart(this.state.productId, this.props.history)}>Add To Cart<i className="fas fa-shopping-bag"></i></button></div>
                            <div className="col-4"><button className="btn btn-primary w-100" onClick={() => this.props.history.push(`/editProduct/${this.state.productId}`)}>Edit</button></div>
                            <div className="col-4"><button className="btn btn-danger w-100" onClick={() => this.props.deleteProduct(this.state.productId, this.props.history)}>Delete</button></div>
                        </div>;
            }else{
                buttons = <div className="row mt-3">
                            <div className="col-4 mx-auto"><button className="btn btn-primary w-100" onClick={() => this.props.addToCart(this.state.productId, this.props.history)}>Add To Cart</button></div>
                        </div>;
            }
        }

        let show = (<div className="container-fluid m-2 mt-4">
                        <div className="row w-100">
                            <div className="col-sm-6 m-0 p-0">
                                <img 
                                    src={`https://selnby.herokuapp.com/${this.state.imageUrl}`} 
                                    alt="productImage"  
                                    style={{width : "100%", height : "60vh", boxShadow: "0px 1px 4px grey"}} 
                                />
                                {buttons}
                            </div>
                            <div className="col-sm-6">
                                <h2 className="text-center font-weight-bolder mt-2">{this.state.title}</h2>
                                <p className="text-center text-justify ml-1">{this.state.description}</p>
                                <p className="text-center font-weight-bold">&#8377;{this.state.price}</p>
                                <div className="mt-2">
                                    <h3 className="ml-1 mt-2 font-weight-bold">Reviews</h3>
                                    <textarea rows="5" className="reviewData form-control" style={{boxShadow : "1px 1px 3px grey"}} placeholder="Add review"></textarea>
                                    <button className="btn btn-outline-primary mt-2" onClick={() => this.addReview()}>Add</button>
                                    <p className="text-info">{this.state.msg}</p>
                                    {this.state.reviews ? this.state.reviews.map(review => {
                                        return (<div className="border p-2 my-2" key={review._id} style={{boxShadow : "1px 1px 3px grey"}}>
                                            <div>
                                                <span className="font-weight-bold font-size-large mr-1">
                                                    {review.userName}
                                                </span>
                                                {review.date}
                                            </div>
                                            <div className="text-justify my-1">
                                                {review.review}
                                            </div>
                                            {review.userId.toString() === this.props.userId.toString() ? <button className="btn btn-outline-danger" onClick={() => this.removeReview()}>Delete</button> : ''}
                                        </div>);
                                    }) : ''}
                                </div>
                            </div>
                        </div>
                    </div>);

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
        productData : state.shop.productData,
        userId : state.auth.userId,
        isAuthenticated : state.auth.isAuthenticated,
        loading : state.shop.loading,
        boughtProducts : state.auth.boughtProducts
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getProduct : (productId, history) => dispatch(shopActions.getProduct(productId, history)),
        addToCart : (productId, history) => dispatch(adminActions.addToCart(productId, history)),
        deleteProduct : (productId, history) => dispatch(adminActions.deleteProduct(productId, history)),
        resetLoading : () => dispatch(shopActions.resetLoading()),
        addReview : (productId, review) => dispatch(adminActions.addReview(productId, review)),
        removeReview : (productId) => dispatch(adminActions.removeReview(productId)),
        getBoughtProducts : () => dispatch(adminActions.getBoughtProducts())
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Product));