import React, {useEffect, useState} from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import postNewPaypal from "../../features/payment/postNewPaypal.tsx"
async function reset()
{
    await fetch("https://localhost:7071/api/AspNetUsers/resetCash");
    window.location.reload();
}
const PaypalCheckoutButton = (props) => {
    const { product } = props.product;

    const [paidFor, setPaidFor] = useState(false);
    const [error, setError] = useState(null);

    const handleApprove = (orderId) => {
        setPaidFor(true);
    }

    if (paidFor) {
        alert("Purchased");
        reset();
        console.log("elo");
    }

    //const id = import.meta.env.REACT_APP_PAYPAL_CLIENT_ID;
    return (
        <PayPalScriptProvider options={{ currency: "PLN", clientId: 'ATGo_MyHThm6dXYw-mkIk78YSYa7tNzWCfUDM6rIqm7aNTic61DwwN5eNaxy-ljpQqIGprjrdrWxZFxj', locale: 'pl_PL' }}>
            <PayPalButtons
                onClick={(data, actions) => {
                    const hasAlreadyBoughtCourse = false;
                    if (hasAlreadyBoughtCourse) {
                        setError("You already bought this");
                        return actions.reject();
                    } else {
                        return actions.resolve();
                    }
                }}

                createOrder={(data, actions) => {
                    return actions.order.create({
                        purchase_units: [
                            {
                                description: props.product.description,
                                amount: {
                                    value: props.product.price
                                },
                            },
                        ],
                    });
                }}
                onApprove={async (data, action) => {
                    const url2 = "https://localhost:7071/api/AspNetUsers/resetCash";
                    try {
                        const response = await fetch(url2, {
                            credentials: 'include',
                            method: 'PUT',
                        });
                    }catch (error) {
                        console.error('Error adding cash:', error);
                    }
                    const order = await action.order.capture();

                    console.log("order", order);
                    
                    //tutaj wstawić logikę dodawania entity
                    const prps = {
                        name: order.id,
                        price: props.product.price, // corrected to use product.price
                        description: props.product.description,
                        isApproved: order.status === "APPROVED", // simpler boolean check
                        userId : props.user,
                        teamId : props.team
                    };
                    console.log('x'+prps);
                    await postNewPaypal(prps);
                    handleApprove(data.orderID);
                    
                }}
                onCancel={() => { }}
                onError={(err) => {
                    setError(err);
                    console.log("PayPal Checkout onError", err);
                }}
            />
        </PayPalScriptProvider>

    )
}

export default PaypalCheckoutButton