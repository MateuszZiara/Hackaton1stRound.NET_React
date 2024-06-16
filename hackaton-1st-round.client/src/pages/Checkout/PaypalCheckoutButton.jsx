import React, {useEffect, useState} from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import postNewPaypal from "../../features/payment/postNewPaypal.tsx"
const PaypalCheckoutButton = (props) => {
    const { product } = props;

    const [paidFor, setPaidFor] = useState(false);
    const [error, setError] = useState(null);
    const [user, setUserId] = useState('');
    const [team, setTeamId] = useState('');
    const handleApprove = (orderId) => {
        setPaidFor(true);
    }

    if (paidFor) {
        alert("Purchased");
    }

    if (error) {
        alert(error);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseUserDetails = await fetch("https://localhost:7071/api/AspNetUsers/info", {
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Credentials': 'true'
                    }
                });
                const data = await responseUserDetails.json();
                setUserId(data.id);
                setTeamId(data.teamEntity_FK);
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        fetchData();
    }, []);
    const id = import.meta.env.REACT_APP_PAYPAL_CLIENT_ID;
    return (
        <PayPalScriptProvider>
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
                                description: product.description,
                                amount: {
                                    value: product.price
                                },
                            },
                        ],
                    });
                }}
                onApprove={async (data, action) => {
                    console.log(user);
                    console.log(team);
                    const order = await action.order.capture();
                    console.log("order", order);
                    //tutaj wstawić logikę dodawania entity
                    const props = {
                        name: order.id,
                        price: product.price, // corrected to use product.price
                        description: product.description,
                        isApproved: order.status === "APPROVED", // simpler boolean check
                        userId : user,
                        teamId : team
                    };
                    console.log('x'+props);
                    await postNewPaypal(props);
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