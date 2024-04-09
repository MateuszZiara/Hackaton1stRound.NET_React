import React, {useContext, useEffect, useState} from "react";
import {Menu, Group, Center, Burger, Container, Button, Avatar, Text, parseColor} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronDown } from '@tabler/icons-react';
import { MantineLogo } from '@mantinex/mantine-logo';
import classes2 from './HeaderMenu.module.css';
import { checkUserLoggedIn } from "../../features/getCookies/getCookies";


const handleGetStartedClick = () => {
    window.location.href = "/pag";
};

export function HeaderMenu() {
    const [Firstname,setFirstName] = useState("");
    async function getFirstName() {
        const response = await fetch("https://localhost:7071/api/AspNetUsers/info", {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials':'true'
            }

        });
        const data = await response.json();
        return data.firstName;
    }
    const UserField = () => {
        const [loggedIn, setLoggedIn] = useState(null);

        useEffect(() => {
            const fetchData = async () => {
                try {
                    const isLoggedIn = await checkUserLoggedIn();
                    setFirstName(await getFirstName())
                    setLoggedIn(isLoggedIn);
                } catch (error) {
                    console.error('Error checking user login status:', error);
                    setLoggedIn(false); // Ustawienie na false w przypadku błędu
                }
            };

            fetchData();
        }, []);

        if (!loggedIn) {
            return (
                <Button
                    variant="outline"
                    radius="xl"
                    size="sm"
                    styles={{
                        root: { paddingRight: "14px", height: "48px" },
                        section: { marginLeft: "22px" },
                    }}
                    onClick={handleGetStartedClick}
                >
                    Logowanie
                </Button>
            );
        }
        if (loggedIn) {
            return (
                <Button
                    variant="outline"
                    radius="xl"
                    size="sm"
                    styles={{
                        root: { paddingRight: "14px", height: "48px" },
                        section: { marginLeft: "22px" },
                    }}
                    onClick={handleGetStartedClick}
                >
                    {Firstname}
                </Button>
            );
        }
    };


    return (
        <header className={classes2.header}>
                <div className={classes2.inner}>
                    <MantineLogo size={28}/>
                    <UserField />
                </div>
        </header>
    );
}
