import React, { useState, useEffect } from 'react';
import {
    Button,
    Text,
    Title,
    Flex,
    Card,
    Radio,
    Group,
    Alert, rem, Modal, MantineProvider
} from '@mantine/core';
import { checkUserLoggedIn } from '../../../../features/getCookies/getCookies';
import classes from './Payment.module.css';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import PaypalCheckoutButton from "../../../../pages/Checkout/PaypalCheckoutButton";
import postNewPaypal from "../../../../features/payment/postNewPaypal";
import postNewOfflinePayment from "../../../../features/payment/postNewOfflinePayment";
import checkIfPaymentEntityExists from "../../../../features/payment/checkIfPaymentEntityExists";

export function Payment() {
    const [user, setUserId] = useState(null);
    const [team, setTeamId] = useState(null);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const [iszero, setiszero] = useState(false);
    const [pendingPayment, setPendingPayment] = useState(false);
    const gameId = Math.floor(Math.random() * 1000000); // potem jako parametr wywolanej funkcji wraz z resztą wartości odnosnie gry
    const [product, setProduct] = useState({
        description: "Rejestracja na hackaton",
        price: 0,
    });
   // const id = import.meta.env.REACT_APP_PAYPAL_CLIENT_ID; //zepsute

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
                product.price = json;
                if(product.price === 0)
                {
                   setiszero(true);
                }
                setProduct(prevProduct => ({ ...prevProduct, price: json }));
            }catch (error) {
                console.error('Error checking user cash to pay:', error);
            }
        }
        fetchData();
        getMoney();
    }, []);

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

    const checkPaymentStatus = async () => {
        try {
            const isLoggedIn = await checkIfPaymentEntityExists(team);
            console.log(isLoggedIn);
            if (isLoggedIn) {
                setPendingPayment(true);
            }
        } catch (error) {
            console.error('Error checking payment status:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (team !== null) {
            checkPaymentStatus();
        }
    }, [team]);

        const props = {
            price: product.price, // corrected to use product.price
            description: product.description,
            isApproved: false, // simpler boolean check
            userId : user,
            teamId : team,
            name: ''
        };

        const classicPayment = async () => {
            await postNewOfflinePayment(props);
            setModalOpen(true);
        }

    return (

        <Card withBorder radius="md" p="xl" m="md" className={classes.card}>
            
            <Modal
                opened={pendingPayment}
                onClose={() => setPendingPayment(false)}
                style={{ position: 'fixed', top: '50%', left: '0%'}}
                withCloseButton={false}
                closeOnClickOutside={false}
                closeOnEscape={false}
                overlayProps={{
                    backgroundOpacity: 0.55,
                    color: '#ffffff',
                    blur: 6
                }}
            >
                <Text fz="lg" className={classes.title} fw={500}>
                    Płatność została wykonana
                </Text>
                <Text fz="xs" c="dimmed" mt={3} mb="xl">
                    W razie jakichkolwiek problemów, skontaktuj się z administratorem.
                </Text>
            </Modal>
            <Modal
                opened={iszero}
                onClose={() => setPendingPayment(false)}
                style={{ position: 'fixed', top: '50%', left: '0%'}}
                withCloseButton={false}
                closeOnClickOutside={false}
                closeOnEscape={false}
                overlayProps={{
                    backgroundOpacity: 0.55,
                    color: '#ffffff',
                    blur: 6
                }}
            >
                <Text fz="lg" className={classes.title} fw={500}>
                   Utwórz zespół aby móc dokonać płatności
                </Text>
                <Text fz="xs" c="dimmed" mt={3} mb="xl">
                    Przejdź do modułu tworzenia zespołu
                </Text>
            </Modal>
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
                    <div style={{backgroundColor: 'white', padding:rem(10), borderRadius:rem(10)}}>
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
                    <Button h={50} fullWidth onClick={classicPayment}>Płatność przelewem tradycyjnym</Button>
                        <Modal
                            opened={isModalOpen}
                            onClose={() => setModalOpen(false)}
                            style={{ position: 'fixed', top: '50%', left: '0%'}}
                        >
                            <Text fz="lg" className={classes.title} fw={500}>
                                Przyjęto płatność
                            </Text>
                            <Text fz="xs" c="dimmed" mt={3} mb="xl">
                                Płatności dokonasz stacjonarnie na PŚK.
                            </Text>
                        </Modal>
                    </div>
                    </div>
                </div>
            </Flex>
         
        </Card>
        
    );
}
export default Payment;
