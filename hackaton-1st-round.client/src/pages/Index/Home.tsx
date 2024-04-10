import {Container, Text, Button, Group, Flex} from '@mantine/core';
import classes from "./Home.module.css";
import { HeaderMenu } from "../../layouts/Header/HeaderMenu";
import {useEffect} from "react";
import {Footer} from "../../layouts/Footer/Footer";
import {Hero} from "../../components/Hero/Hero";


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
            }
        };
        checkCookies();
    }, []);

    
    

    return (
        <Flex
            gap="sm"
            justify="center"
            align="stretch"
            direction="column"
            wrap="nowrap"
        >
            <div>
                <HeaderMenu />
            </div>
            <div>
                <Hero/>
            </div>
            <div style={{textAlign: "center", width: "100%"}}>
                <Footer/>
            </div>
        </Flex>

    );
}
