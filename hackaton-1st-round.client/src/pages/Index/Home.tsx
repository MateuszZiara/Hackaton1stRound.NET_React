import {Container, Text, Button, Group, Flex} from '@mantine/core';
import classes from "./Home.module.css";
import { HeaderMenu } from "../../layouts/Header/HeaderMenu";
import {useEffect} from "react";
import CarouselHome from "../../components/CarouselHome/CarouselHome";
import {Footer} from "../../layouts/Footer/Footer";


export default function Home() {

    async function getCookies() {
        const response = await fetch("https://localhost:7142/api/AspNetUsers/info", {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials':'true'
            }

        });

        if (response.ok) {

            return true;
        } else {

            return false;
        }


    }
    useEffect(() => {
        const checkCookies = async () => {
            const isLoggedIn = await getCookies();
            if (isLoggedIn) {
                window.location.href = "/main";
            } else {

            }
        };
        checkCookies();
    }, []);
    const handleGetStartedClick = () => {
        window.location.href = "/pag";
    };

    return (
        <Flex
            mih={50}
            gap="lg"
            justify="center"
            align="center"
            direction="column"
            wrap="wrap"
        >
            <div className={classes.footer}>
                <HeaderMenu/>
            </div>
            <div>
                <CarouselHome/>
            </div>
            <div style={{ textAlign: "left", width: "100%" }}> {/* Ensure the button takes full width */}
                <Button
                    size="xl"
                    className={classes.control}
                    variant="filled"
                    onClick={handleGetStartedClick} // Add onClick event handler
                    style={{ marginLeft: 0 }} // Reset any default margin for the button
                >
                    Get started
                </Button>
            </div>
            <div style={{textAlign: "center", width: "100%"}}>
                <Footer/>
            </div>
        </Flex>

    );
}
