import React, { useState, useEffect } from 'react';
import {
    Button,
    Text,
    Title,
    Flex,
    Card,
    Radio,
    Group,
    Alert
} from '@mantine/core';
import { checkUserLoggedIn } from '../../../../features/getCookies/getCookies';
import classes from './Payment.module.css';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import PaypalCheckoutButton from "../../../../pages/Checkout/PaypalCheckoutButton";
import {j} from "vite/dist/node/types.d-aGj9QkWt";
import {get} from "axios";

export function Payment() {
    const gameId = Math.floor(Math.random() * 1000000); // potem jako parametr wywolanej funkcji wraz z resztą wartości odnosnie gry
    const [product, setProduct] = useState({
        description: "Rejestracja na hackaton",
        price: 0,
    });
    const id = import.meta.env.REACT_APP_PAYPAL_CLIENT_ID; //zepsute

    const [isScriptLoaded, setIsScriptLoaded] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const isLoggedIn = await checkUserLoggedIn();
                if (!isLoggedIn) {
                    window.location.href = "/404";
                } else {
                    setIsScriptLoaded(true);
                }
            } catch (error) {
                console.error('Error checking user login status:', error);
            }
        };
        const getMoney = async () => {
            try{
                const response = await fetch("https://localhost:7071/api/AspNetUsers/getcash", {
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                    
                });
                const json = await response.json();
                console.log(json);
                product.price = json;
                console.log(product.price);
                setProduct(prevProduct => ({ ...prevProduct, price: json }));
            }catch (error) {
                console.error('Error checking user cash to pay:', error);
            }
        }
        fetchData();
        getMoney();
    }, []);

    return (
        <Card withBorder radius="md" p="xl" m="md" className={classes.card}>
            <Title order={2}>Płatność</Title>
            <Text fz="md" c="dimmed" mt={0} mb="xl" pb={"10"}>
                Dokonaj płatności aby móc pobrać wygenerowaną grę miejską
            </Text>

            <Title order={4}>Podsumowanie zamówienia</Title>
            <div style={{ textAlign: "left", display: "grid", gridTemplateColumns: "repeat(1, 100%)" }}>
                <div style={{ marginBottom: '16px' }}>
                    <Flex
                        justify="flex-start"
                        align="stretch"
                        direction="row"
                        wrap="wrap"
                        style={{ width: '100%' }}
                    >
                        <div style={{ width: '50%', flex: '1' }}>
                            <Text style={{ marginBottom: '16px' }}>Nazwa produktu: {product.description}</Text>
                            <Text style={{ marginBottom: '16px' }}>Do zapłaty: {(product.price).toPrecision(4) + "zł"}</Text>
                        </div>
                    </Flex>
                </div>
            </div>
            <Flex
                gap="xl"
                justify="flex-start"
                align="stretch"
                direction="row"
                wrap="wrap"
            >
                <div>
                    <Title order={4}>Wybierz metodę płatności</Title>
                    <Text fz="md" c="dimmed" mt={0} mb="xl" pb={"10"}>
                        Wykorzystujemy usługę PayPal. Wybierając metody płatności online zgadasz się na warunki korzystania z usługi
                    </Text>
                    {isScriptLoaded && (
                        <PayPalScriptProvider options={{currency: "PLN", clientId: 'ATGo_MyHThm6dXYw-mkIk78YSYa7tNzWCfUDM6rIqm7aNTic61DwwN5eNaxy-ljpQqIGprjrdrWxZFxj', locale: 'pl_PL'}}>
                            <div className="checkout">
                                <div className="paypal-button-container">
                                    <PaypalCheckoutButton product={product} />
                                </div>
                            </div>
                        </PayPalScriptProvider>
                    )}
                    <div className="paypal-button-container">
                    <Button>Płatność przelewem tradycyjnym</Button>
                    </div>
                </div>
            </Flex>
        </Card>
    );
}
export default Payment;
