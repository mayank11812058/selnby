import React, { Component } from 'react';
import * as adminActions from '../../store/actions/admin';
import * as shopActions from '../../store/actions/shop';
import * as errorActions from '../../store/actions/error';
import {connect} from 'react-redux';
import classnames from 'classnames';
import {withRouter} from 'react-router';
import Spinner from '../../components/Spinner/Spinner';

class AddProduct extends Component {
    state = {
        errors : [],
        title : '',
        price : '',
        description : '',
        imageUrl : null,
        productId : '',
        filename : 'Choose Image:'
    }
 
    static getDerivedStateFromProps = (props, state) => {
        if(state.errors.length > 0){
            return {
                ...state
            };
        }else if(props.errors.length > 0){
            return {
                ...state,
                errors : [...props.errors]
            };
        }else if(!state.title && !state.imageUrl && !state.price && !state.description){
            return {
                ...state,
                title : props.productData.title,
                description : props.productData.description,
                price : props.productData.price,
                productId : props.productData.productId,
                filename : props.productData.imageUrl ? props.productData.imageUrl.split('-')[1] : 'Choose Image:'
            };
        }else{
            return {
                ...state
            };
        }
    }

    onChangeHandler = (event) => {
        const oldState = {...this.state};
        oldState[event.target.name] = event.target.value;
        const errors = this.state.errors.map(err => {
            return {...err};
        });
        let index = -1;

        if(event.target.name === 'title'){
            if(event.target.value.length >= 3){
                index = errors.findIndex(error => error.param === 'title');
            }
        }else if(event.target.name === 'price'){
            if(+event.target.value > 0){
                index = errors.findIndex(error => error.param === 'price');
            }
        }else{
            if(+event.target.value.length >= 10){
                index = errors.findIndex(error => error.param === 'description');
            }
        }

        if(index >= 0){
            errors.splice(index, 1);
        }

        this.setState({
            ...oldState,
            errors : errors
        });
    }

    onChangeHandlerFile = (event) => {
        if (event.target.files.length) {
            const upload_file = event.target.files[0];
            const oldState = {...this.state};
            oldState.imageUrl = upload_file;
            oldState.filename = upload_file.name;
            const errors = this.state.errors.map(err => {
                return {...err};
            });
            
            const index = errors.findIndex(error => error.param === 'imageUrl');

            if(index >= 0){
                errors.splice(index, 1);
            }

            this.setState({
                ...oldState,
                errors : errors
            });
        }
    }

    onSubmitHandler = (event, history) => {
        event.preventDefault();

        if(!this.state.imageUrl && !this.props.match.params.productId){
            let errors = [];
            errors.push({
                location : "body",
                param : "imageUrl",
                msg : "You have to choose a image"
            });

            if(!this.state.title){
                errors.push({
                    location : "body",
                    param : "title",
                    msg : "Enter a title"
                });
            }

            if(!this.state.price){
                errors.push({
                    location : "body",
                    param : "price",
                    msg : "Enter price"
                });
            }

            if(!this.state.description){
                errors.push({
                    location : "body",
                    param : "description",
                    msg : "Please describe the product"
                });
            }

            this.setState({
                errors : [...errors]
            });
        }else{
            this.setState({errors : []});
            let productData = new FormData();
            productData.append('title', this.state.title);
            productData.append('price', this.state.price);
            productData.append('description', this.state.description);

            if(this.state.imageUrl){
                productData.append('imageUrl', this.state.imageUrl);
            }
            this.props.resetLoading();
            this.props.addProduct(productData, history, this.props.match.params.productId);
        }
    }

    componentDidMount(){
        if(this.props.match.params.productId){
            this.props.getProduct(this.props.match.params.productId);
        }else{
            this.props.clearProductData();
            this.setState({
                errors : [],
                title : '',
                price : '',
                description : '',
                imageUrl : null,
                productId : '',
                filename : 'Choose a Image'
            });
        }

        this.props.setLoading();
    }

    componentWillUnmount(){
        this.props.clearProductData();
        this.props.clearErrors();
        this.props.resetLoading();
    }

    render() {
        let show;

        if(this.props.loading){
            show = <Spinner />;
        }

        return (
            <div className="container">
                <form className="my-3 mx-auto p-3 border rounded border-success w-55" noValidate>
                    <div className="form-group">
                        <label className="d-block">
                            Title:
                            <input 
                                type="text" 
                                placeholder="Title" 
                                name="title" 
                                id="title" 
                                value={this.state.title}
                                onChange={(event) => this.onChangeHandler(event)} 
                                className={classnames("form-control border border-success", {'is-invalid border-danger' : this.state.errors.findIndex(error => error.param === "title") >= 0})} 
                            />
                            
                        </label>
                        <div className="invalid-feedback d-block">
                            {this.state.errors.findIndex(error => error.param === "title") >= 0 ? this.state.errors[this.state.errors.findIndex(error => error.param === "title")].msg : ''}
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="custom-file">
                            <label className={classnames("custom-file-label border border-success", {'is-invalid border-danger' : this.state.errors.findIndex(error => error.param === "imageUrl") >= 0})}>
                                {this.state.filename}
                                <input 
                                    type="file" 
                                    name="imageUrl" 
                                    id="imageUrl" 
                                    files={this.state.imageUrl}
                                    onChange={(event) => this.onChangeHandlerFile(event)} 
                                    className="border border-success custom-file-input" 
                                />
                            </label>
                        </div>
                        <div className="invalid-feedback d-block">
                            {this.state.errors.findIndex(error => error.param === "imageUrl") >= 0 ? this.state.errors[this.state.errors.findIndex(error => error.param === "imageUrl")].msg : ''}
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="d-block">
                            Price:
                            <input 
                                type="number" 
                                name="price" 
                                id="price" 
                                value={this.state.price}
                                placeholder="price" 
                                onChange={(event) => this.onChangeHandler(event)} 
                                className={classnames("form-control border border-success", {'is-invalid border-danger' : this.state.errors.findIndex(error => error.param === "price") >= 0})} 
                            />
                            <div className="invalid-feedback">
                                {this.state.errors.findIndex(error => error.param === "price") >= 0 ? this.state.errors[this.state.errors.findIndex(error => error.param === "price")].msg : ''}
                            </div>
                        </label>
                    </div>
                    <div className="form-group">
                        <label className="d-block">
                            Description:
                            <textarea 
                                type="text" 
                                name="description" 
                                id="description"  
                                value={this.state.description}
                                onChange={(event) => this.onChangeHandler(event)} 
                                className={classnames("form-control border border-success", {'is-invalid border-danger' : this.state.errors.findIndex(error => error.param === "description") >= 0})} 
                            />
                            <div className="invalid-feedback">
                                {this.state.errors.findIndex(error => error.param === "description") >= 0 ? this.state.errors[this.state.errors.findIndex(error => error.param === "description")].msg : ''}
                            </div>
                        </label>
                    </div>
                    <button 
                        type="submit" 
                        onClick={(event) => this.onSubmitHandler(event, this.props.history)} 
                        className="btn btn-outline-success">
                            Add Product
                    </button>
                </form>
                {show}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        errors : state.error.errors,
        productData : state.shop.productData,
        loading : state.shop.loading
    };
}

const mapDispatchToProps = dispatch => {
    return {
        addProduct : (productData, history, productId) => dispatch(adminActions.addProduct(productData, history, productId)),
        getProduct : (productId) => dispatch(shopActions.getProduct(productId)),
        clearProductData : () => dispatch(adminActions.clearProductData()),
        clearErrors : () => dispatch(errorActions.clearErrors()),
        setLoading : () => dispatch(shopActions.setLoading()),
        resetLoading : () => dispatch(shopActions.resetLoading())
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddProduct));