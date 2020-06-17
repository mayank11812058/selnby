import React, { Component } from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import * as authActions from '../../store/actions/auth';
import * as errorActions from '../../store/actions/error';
import * as shopActions from '../../store/actions/shop';
import classnames from 'classnames';
import {withRouter} from 'react-router';
import Spinner from '../../components/Spinner/Spinner';

class Login extends Component {
    state = {
        errors : [],
        email: '',
        password: ''
    }

    componentDidMount(){
        this.props.setLoading();
    }

    static getDerivedStateFromProps = (props, state) => {
        return {
            ...state,
            errors : props.errors
        }
    }

    onChangeHandler = (event) => {
        const oldState = {...this.state};
        oldState[event.target.name] = event.target.value;
        const errors = this.state.errors.map(err => {
            return {...err};
        });
        let indexes = [];

        if(event.target.name === "password"){
            if(event.target.value.length >= 8){
                let index = errors.findIndex(error => error.param === "password");
                if(index >= 0){
                    indexes.push(index);
                }
            }
        }else{
            const format = /^\w+([-]?\w+)*@\w+([-]?\w+)*(\w{2,3})+$/;
            if(event.target.value.match(format)){
                let index = errors.findIndex(error => error.param === "email");

                if(index >= 0 && errors[index].msg !== 'Should be valid e-mail'){
                    index = -1;
                }

                if(index >= 0){
                    indexes.push(index);
                }
            }
        }

        if(indexes.length >= 0){
            this.props.clearError(indexes);
        }

        this.setState({
            ...oldState
        });
    }

    onSubmitHandler = (event) => {
        event.preventDefault();
        const userData = {
            email : this.state.email,
            password : this.state.password
        }
        this.props.submitHandler(userData, this.props.history);
        this.props.resetLoading();
    }

    componentWillUnmount(){
        this.props.clearErrors();
        this.props.resetLoading();
    }

    showPassword = (event) => {
        event.preventDefault();
        const inputField = event.target.parentNode.parentNode.parentNode.firstChild;
        if(inputField.type === "password"){
            inputField.type = "text";
        }else{
            inputField.type = "password";
        }
    }

    render() {
        let show = (<form className="my-3 mx-auto p-3 border rounded border-success w-55" noValidate>
            <div className="form-group">
                <label className="d-block">
                    E-mail:
                    <input 
                        type="mail" 
                        placeholder="E-mail" 
                        name="email" 
                        id="email" 
                        onChange={(event) => this.onChangeHandler(event)} 
                        className={classnames("form-control border border-success", {'is-invalid border-danger' : this.state.errors.findIndex(error => error.param === "email") >= 0})} 
                    />
                    <div className="invalid-feedback">
                        {this.state.errors.findIndex(error => error.param === "email") >= 0 ? this.state.errors[this.state.errors.findIndex(error => error.param === "email")].msg : ''}
                    </div>
                </label>
            </div>
            <div className="form-group">
                <label className="d-block">
                    Password:
                    <div className="input-group">
                        <input 
                            type="password" 
                            name="password" 
                            id="password" 
                            placeholder="Password" 
                            onChange={(event) => this.onChangeHandler(event)} 
                            className={classnames("form-control border border-success", {'is-invalid border-danger' : this.state.errors.findIndex(error => error.param === "password") >= 0})} 
                        />
                        <div className="input-append border border-success">
                            <button className='h-100 bg-white border-0' onClick={(event) => {this.showPassword(event)}}>
                                <i className="fas fa-eye"></i>
                            </button>
                        </div>
                    </div>
                    <div className="invalid-feedback">
                        {this.state.errors.findIndex(error => error.param === "password") >= 0 ? this.state.errors[this.state.errors.findIndex(error => error.param === "password")].msg : ''}
                    </div>
                </label>
            </div>
            <Link to='/forgotPassword' className="text-dark d-block m-2 text-decoration-none">Forgot Password</Link>
            <button 
                type="submit" 
                onClick={(event) => this.onSubmitHandler(event)} 
                className="btn btn-outline-success">
                    Login
            </button>
        </form>);

        let spinner;

        if(this.props.loading){
            spinner = <Spinner />;
        }

        return (
            <div className="container">
                {show}
                {spinner}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        errors : state.error.errors,
        isAuthenticated : state.auth.isAuthenticated,
        loading : state.shop.loading
    }
}

const mapDispatchToProps = dispatch => {
    return {
        submitHandler : (userData, history) => dispatch(authActions.login(userData, history)),
        clearError : (indexes) => dispatch(errorActions.clearError(indexes)),
        clearErrors : () => dispatch(errorActions.clearErrors()),
        setLoading : () => dispatch(shopActions.setLoading()),
        resetLoading : () => dispatch(shopActions.resetLoading())
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));