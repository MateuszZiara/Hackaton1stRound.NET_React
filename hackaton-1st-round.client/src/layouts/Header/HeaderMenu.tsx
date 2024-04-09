import React, {useContext, useEffect, useState} from "react";
import {Menu, Group, Center, Burger, Container, Button, Avatar, Text} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronDown } from '@tabler/icons-react';
import { MantineLogo } from '@mantinex/mantine-logo';
import { Link } from 'react-router-dom';
import classes2 from './HeaderMenu.module.css';
import { checkUserLoggedIn } from "../../features/getCookies/getCookies";

const links = [
    { link: '/pag', label: 'Nowości' },
    {
        link: '/kwiaty',
        label: 'Kwiaty',
        links: [
            { link: '/buyflower', label: 'Cięte' },
            { link: '/resources', label: 'Doniczkowe' },
            { link: '/community', label: 'Balkonowe' },
            { link: '/blog', label: 'Sukulenty' },
        ],
    },
    { link: '/about', label: 'O nas' },
    { link: '/pricing', label: 'Liściki z życzeniami' },
    {
        link: '#2',
        label: 'Dodatki',
        links: [
            { link: '/faq', label: 'Wstążki' },
            { link: '/demo', label: 'Book a demo' },
            { link: '/forums', label: 'Forums' },
        ],
    },
];

const handleGetStartedClick = () => {
    window.location.href = "/pag";
};

export function HeaderMenu() {
    const [opened, { toggle }] = useDisclosure(false);

    const UserField2 = () => {
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

        if (loggedIn === null) {
            return (
                <Button
                    variant="filled"
                    radius="xl"
                    size="sm"
                    styles={{
                        root: { paddingRight: "14px", height: "48px" },
                        section: { marginLeft: "22px" },
                    }}
                    onClick={handleGetStartedClick}
                >
                    Zaloguj się
                </Button>
            );
        } else if (loggedIn) {
            return (
                <Avatar color="green.9" radius="xl">XY</Avatar>
            );
        } else {
            return (
                <Button
                    variant="filled"
                    radius="xl"
                    size="sm"
                    styles={{
                        root: { paddingRight: "14px", height: "48px" },
                        section: { marginLeft: "22px" },
                    }}
                    onClick={handleGetStartedClick}
                >
                    Zaloguj się
                </Button>
            );
        }
    };

    const items = links.map((link) => {
        const menuItems = link.links?.map((item) => (
            <Menu.Item key={item.link}>
                <Link to={item.link}>{item.label}</Link>
            </Menu.Item>
        ));

        if (menuItems) {
            return (
                <Menu key={link.label} trigger="hover" transitionProps={{ exitDuration: 44 }} withinPortal>
                    <Menu.Target>
                        <Link to={link.link} className={classes2.link}>
                            <Center>
                                <span className={classes2.linkLabel}>{link.label}</span>
                                <IconChevronDown size="0.9rem" stroke={1.5} />
                            </Center>
                        </Link>
                    </Menu.Target>
                    <Menu.Dropdown>{menuItems}</Menu.Dropdown>
                </Menu>
            );
        }

        return (
        <Text
            key={link.label}
            className={classes2.link}
            component="a"
            href={link.link}
            onClick={(event) => {
                event.preventDefault(); // Zapobieganie domyślnej akcji przekierowania
                window.location.href = link.link; // Ręczne przekierowanie po kliknięciu
            }}
        >
            {link.label}
        </Text>
        );
    });

    return (
        <header className={classes2.header}>
            <Container size="md">
                <div className={classes2.inner}>
                    <MantineLogo size={28}/>
                    <Group gap={5} visibleFrom="sm">
                        {items}
                    </Group>
                    <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />
                    <UserField2 />
                </div>
            </Container>
        </header>
    );
}
