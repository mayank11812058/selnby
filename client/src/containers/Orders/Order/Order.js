import React from 'react';

const Order = (props) => {
    return (
    <div className="container my-2 mx-auto p-0 w-60">
        <div className="d-flex justify-content-between mx-1">
            <div className="font-weight-bold">{props.cart.items.length} Items</div>
            <div className="font-weight-bold">Total Price: &#8377;{props.cart.total}</div>
        </div>
        {props.cart.items.map(item => {
            return <div key={item.productId} className="container row p-0 my-3 mx-1" style={{boxShadow : "0px 1px 3px grey"}}>
                        <div className="col-3 p-0 m-0">
                            <img src={`https://selnby.herokuapp.com/${item.imageUrl}`} alt="productImage" style={{width : "100%", height : "20vh", boxShadow: "0px 1px 4px grey"}} />
                        </div>
                        <div className="col-9 m-0">
                            <h2 className="text-center font-weight-bolder">{item.title}</h2>
                            <p className="text-center text-justify text-capitalize ml-1">{item.description}</p>
                            <p className="text-center font-weight-bold">&#8377;{item.price}</p>
                            <div className="text-center align-bottom">Qty : {item.count} </div>
                        </div>
                    </div>
        })}
    </div>
)}

export default Order;
