import React, { Component } from 'react';
import {connect} from 'react-redux';
import * as authActions from '../../store/actions/auth';
import * as errorActions from '../../store/actions/error';
import {withRouter} from 'react-router-dom';
import classnames from 'classnames';

class ResetPassword extends Component {
    state = {
        errors : [],
        email : '',
        password : ''
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
        this.props.submitHandler(userData, this.props);
    }

    componentWillUnmount(){
        this.props.clearErrors();
        this.props.resetMsg();
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
        let inputField = (<div className="form-group">
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
                        </div>);
        
        if(this.props.location.pathname !== '/forgotPassword'){
            inputField = (<div className="form-group">
                            <label className="d-block">
                                Reset Password:
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
                        </div>);
        }

        return (
            <form className="container my-3 mx-3 mx-auto p-3 border rounded border-success w-55" noValidate>
                {this.props.msg ? <p className="text-center text-info">{this.props.msg}</p> : ''}
                {this.props.errorMsg ? <p className="text-center text-danger">{this.props.errorMsg}</p> : ''}
                {inputField}
                <button 
                    type="submit" 
                    onClick={(event) => this.onSubmitHandler(event)} 
                    className="btn btn-outline-success">
                        Submit
                </button>
            </form>
        );
    }
}

const mapStateToProps = state => {
    return {
        errors : state.error.errors,
        msg : state.auth.msg,
        errorMsg : state.error.msg
    };
}

const mapDispatchToProps = dispatch => {
    return {
        submitHandler : (userData, router) => dispatch(authActions.resetPassword(userData, router)),
        clearError : (indexes) => dispatch(errorActions.clearError(indexes)),
        clearErrors : () => dispatch(errorActions.clearErrors()),
        resetMsg : () => dispatch(authActions.resetMsg())
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ResetPassword));