import React, {useContext, useEffect, useState} from "react";
import {Menu, Group, Center, Burger, Container, Button, Avatar, Text, parseColor} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronDown } from '@tabler/icons-react';
import { MantineLogo } from '@mantinex/mantine-logo';
import classes2 from './HeaderMenu.module.css';
import { checkUserLoggedIn } from "../../features/getCookies/getCookies";
import { logout } from "../../features/getCookies/getCookies";


const handleGetStartedClick = () => {
    window.location.href = "/pag";
};

export function HeaderMenu() {
    const UserField = () => {
        const [loggedIn, setLoggedIn] = useState(null);

        useEffect(() => {
            const fetchData = async () => {
                try {
                    const isLoggedIn = await checkUserLoggedIn();
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
                    onClick={logout}
                >
                    Wyloguj
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
