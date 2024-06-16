import { useEffect, useState } from 'react';
import { Center, Tooltip, UnstyledButton, Stack, rem, Avatar, Image } from '@mantine/core';
import { Link } from 'react-router-dom';
import {
    IconHome2,
    IconUsers,
    IconSettings,
    IconLogout,
    IconFiles,
    IconUsersGroup,
    IconCreditCardPay
} from '@tabler/icons-react';
import classes from './Navbar.module.css';
import { logout } from "../../features/getCookies/getCookies";
import { checkUserLoggedIn } from "../../features/getCookies/getCookies";
import logoSmall from "../../../public/logoSmall.png";

interface NavbarLinkProps {
    icon: typeof IconHome2;
    label: string;
    path: string;
}

function NavbarLink({ icon: Icon, label, path }: NavbarLinkProps) {
    return (
        <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
            <Link to={path}>
                <UnstyledButton className={classes.link}>
                    <Icon style={{ width: rem(30), height: rem(30) }} stroke={1} />
                </UnstyledButton>
            </Link>
        </Tooltip>
    );
}

export function Navbar() {
    const [initials, setInitials] = useState("");
    const [userRank, setUserRank] = useState<number | null>(null);

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
                const firstInitial = data.firstName.charAt(0);
                const lastInitial = data.lastName.charAt(0);
                setInitials(firstInitial + lastInitial);
                setUserRank(data.userRank);
            } catch (error) {
                console.error('Error fetching team details:', error);
            }
        };

        fetchData();
    }, []);

    const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const isLoggedIn = await checkUserLoggedIn();
                setLoggedIn(isLoggedIn);
                if (!isLoggedIn) {
                    window.location.href = "/404";
                }
            } catch (error) {
                console.error('Error checking user login status:', error);
                setLoggedIn(false);
            }
        };

        fetchData();
    }, []);

    const linksUser = [
        { icon: IconHome2, label: 'Strona główna', path: '/home' },
        { icon: IconUsers, label: 'Twój zespół', path: '/myteam' },
        { icon: IconCreditCardPay, label: 'Płatności', path: '/payment' },
        { icon: IconSettings, label: 'Ustawienia', path: '/settings' },
    ];

    const linksAdmin = [
        { icon: IconHome2, label: 'Strona główna', path: '/home' },
        { icon: IconUsersGroup, label: 'Zespoły', path: '/teams' },
        { icon: IconUsers, label: 'Uczestnicy', path: '/users' },
        { icon: IconFiles, label: 'Zgłoszenia', path: '/requests' },
        { icon: IconSettings, label: 'Ustawienia', path: '/settings' },
    ];

    return (
        <nav className={classes.navbar}>
            <Center pb={40}>
                <Image src={logoSmall} />
            </Center>

            <div className={classes.navbarMain}>
                {userRank === 2 ? (
                    <Stack justify="center" gap={20}>
                        {linksAdmin.map((link) => (
                            <NavbarLink
                                key={link.label}
                                icon={link.icon}
                                label={link.label}
                                path={link.path}
                            />
                        ))}
                    </Stack>
                ) : (
                    <Stack justify="center" gap={20}>
                        {linksUser.map((link) => (
                            <NavbarLink
                                key={link.label}
                                icon={link.icon}
                                label={link.label}
                                path={link.path}
                            />
                        ))}
                    </Stack>
                )}
            </div>

            <Stack justify="center" gap={10}>
                <Avatar variant={"outline"} color={"white"} w={50} h={50}>{initials}</Avatar>
                <UnstyledButton className={classes.link} onClick={logout}>
                    <Tooltip label="Wyloguj" position="right" transitionProps={{ duration: 0 }}>
                        <IconLogout style={{ width: rem(30), height: rem(30) }} stroke={1} />
                    </Tooltip>
                </UnstyledButton>
            </Stack>
        </nav>
    );
}
