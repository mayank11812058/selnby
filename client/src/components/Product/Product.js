import React, {Component} from 'react';

class Product extends Component{
    render(){
        return (<div className="card productCard">
                    <img src={`https://selnby.herokuapp.com/${this.props.imageUrl}`} className="card-img-top" style={{width : "100%", height : "30vh"}} alt="productImage" />
                    <div className="card-body row m-0 p-0 pb-5">
                        <div className="col-12 font-weight-bold text-dark text-center">{this.props.title}</div>
                        <div className="col-12 font-weight-bold text-dark text-center">&#8377; {this.props.price}</div>
                    </div>
            </div>);
    }
};

export default Product;