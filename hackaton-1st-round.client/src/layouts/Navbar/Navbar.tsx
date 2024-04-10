// Navbar.tsx
import { useEffect, useState } from 'react';
import { Center, Tooltip, UnstyledButton, Stack, rem, Avatar } from '@mantine/core';
import { MantineLogo } from '@mantinex/mantine-logo';
import {IconHome2, IconUsers, IconSettings, IconLogout, IconFiles} from '@tabler/icons-react';
import classes from './Navbar.module.css';
import { logout } from "../../features/getCookies/getCookies";
import { checkUserLoggedIn } from "../../features/getCookies/getCookies";

interface NavbarLinkProps {
    icon: typeof IconHome2;
    label: string;
    onClick?(): void;
}


function NavbarLink({ icon: Icon, label, onClick }: NavbarLinkProps) {
    return (
        <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
            <UnstyledButton onClick={onClick} className={classes.link}>
                <Icon style={{ width: rem(30), height: rem(30) }} stroke={1} />
            </UnstyledButton>
        </Tooltip>
    );
}

export function Navbar({ setActivePage }: { setActivePage: (index: string) => void }) {
    const [initials, setInitials] = useState("");
    const [userRank, setUserRank] = useState(null);

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
                console.log(initials); // Zauważ, że wartość initials może być niezaktualizowana na tym etapie
            } catch (error) {
                console.error('Error fetching team details:', error);
            }
        };

        fetchData();
    }, []);


    const userType = 'User';
    
    const [loggedIn, setLoggedIn] = useState(null);
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
                setLoggedIn(false); // Ustawienie na false w przypadku błędu
            }
        };

        fetchData();
    }, []);

    const linksUser = [
        { icon: IconHome2, label: 'Strona główna', path: 'home' },
        { icon: IconUsers, label: 'Twój zespół', path: 'teams' },
        { icon: IconSettings, label: 'Ustawienia', path: 'settings' },
    ];

    const linksAdmin = [
        { icon: IconHome2, label: 'Strona główna', path: 'home' },
        { icon: IconUsers, label: 'Zespoły', path: 'teams' },
        { icon: IconUsers, label: 'Uczestnicy', path: 'users' },
        { icon: IconFiles, label: 'Pliki PDF', path: 'files' },
        { icon: IconSettings, label: 'Ustawienia', path: 'settings' },
    ];

    return (
        <nav className={classes.navbar}>
            <Center pb={40}>
                <MantineLogo type="mark" inverted size={30} />
            </Center>


            <div className={classes.navbarMain}>
                {
                    userRank === 1 ? (
                            <Stack justify="center" gap={20}>
                                {linksAdmin.map((link) => (
                                    <NavbarLink
                                        key={link.label}
                                        icon={link.icon}
                                        label={link.label}
                                        onClick={() => setActivePage(link.path)}
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
                                    onClick={() => setActivePage(link.path)}
                                />
                            ))}
                        </Stack>
                    )
                }

            </div>

            <Stack justify="center" gap={10}>
                <Avatar variant={"outline"} color={"white"} w={50} h={50}>{initials}</Avatar>
                <NavbarLink icon={IconLogout} label="Logout" onClick={logout} />
            </Stack>
        </nav>
    );
}
