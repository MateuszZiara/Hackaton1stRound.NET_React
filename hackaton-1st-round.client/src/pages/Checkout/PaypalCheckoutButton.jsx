import React, {useEffect, useState} from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import postNewPaypal from "../../features/payment/postNewPaypal.tsx"
async function reset()
{
    await fetch("https://localhost:7071/api/AspNetUsers/resetCash");
    window.location.reload();
}
const PaypalCheckoutButton = (props) => {
    const { product } = props;

    const [paidFor, setPaidFor] = useState(false);
    const [error, setError] = useState(null);
    const [user, setUserId] = useState();
    const [team, setTeamId] = useState();
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    const handleApprove = (orderId) => {
        setPaidFor(true);
    }

    if (paidFor) {
        alert("Purchased");
        reset();
        console.log("elo");
    }
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
            setIsDataLoaded(true);
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };
    useEffect(() => {
        

        fetchData();
    }, []);

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
                                description: product.description,
                                amount: {
                                    value: product.price
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
                    if (!isDataLoaded) {
                        await fetchData();
                    }
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