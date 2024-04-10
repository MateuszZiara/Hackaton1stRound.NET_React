// Navbar.tsx
import { useEffect, useState } from 'react';
import { Center, Tooltip, UnstyledButton, Stack, rem, Avatar } from '@mantine/core';
import { MantineLogo } from '@mantinex/mantine-logo';
import { IconHome2, IconUsers, IconSettings, IconLogout } from '@tabler/icons-react';
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

    const links = [
        { icon: IconHome2, label: 'Strona główna', path: 'home' },
        { icon: IconUsers, label: 'Twój zespół', path: 'teams' },
        { icon: IconSettings, label: 'Ustawienia', path: 'settings' },
    ];

    return (
        <nav className={classes.navbar}>
            <Center pb={40}>
                <MantineLogo type="mark" inverted size={30} />
            </Center>

            <div className={classes.navbarMain}>
                <Stack justify="center" gap={20}>
                    {links.map((link) => (
                        <NavbarLink
                            key={link.label}
                            icon={link.icon}
                            label={link.label}
                            onClick={() => setActivePage(link.path)}
                        />
                    ))}
                </Stack>
            </div>

            <Stack justify="center" gap={10}>
                <Avatar variant={"outline"} color={"white"} w={50} h={50} label={"aa"}>AW</Avatar>
                <NavbarLink icon={IconLogout} label="Logout" onClick={logout} />
            </Stack>
        </nav>
    );
}
