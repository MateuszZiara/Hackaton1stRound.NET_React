import React from 'react';
import "./style.css";
import PaypalCheckoutButton from "./PaypalCheckoutButton";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

//OUTDATED
function Checkout() {
    const product = {
        description: "Learn how to build a website with React JS",
        price: 29,
    };
    const id = import.meta.env.REACT_APP_PAYPAL_CLIENT_ID;
    return (
        
        <PayPalScriptProvider options={{ currency: "PLN", clientId: 'ATGo_MyHThm6dXYw-mkIk78YSYa7tNzWCfUDM6rIqm7aNTic61DwwN5eNaxy-ljpQqIGprjrdrWxZFxj'}}>

            <div className="checkout">
                <h1>PayPal Checkout</h1>
                <p className="checkout-title">
                    Design and Code React PayPal Checkout Procedure
                </p>
                <p className="checkout-description">
                    Learn how to build a website with React JS
                </p>
                <h1 className="checkout-price">$29</h1>
                <div className="separator"></div>
                <div className="paypal">
                    <p className="checkout-title">PAY WITH PAYPAL</p>
                    <div className="paypal-button-container">
                        <PaypalCheckoutButton product={product} />
                    </div>
                </div>
            </div>
        </PayPalScriptProvider>
    );
}

export default Checkout;
