import { useState } from 'react';
import {Center, Tooltip, UnstyledButton, Stack, rem, Avatar, MenuLabel} from '@mantine/core';
import {
    IconHome2,
    IconCalendarEvent,
    IconDeviceDesktopAnalytics,
    IconFingerprint,
    IconCalendarStats,
    IconUsers,
    IconSettings,
    IconLogout,
    IconSwitchHorizontal,
} from '@tabler/icons-react';
import { MantineLogo } from '@mantinex/mantine-logo';
import classes from './Navbar.module.css';

interface NavbarLinkProps {
    icon: typeof IconHome2;
    label: string;
    active?: boolean;
    onClick?(): void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
    return (
        <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
            <UnstyledButton onClick={onClick} className={classes.link} data-active={active || undefined}>
                <Icon style={{ width: rem(30), height: rem(30) }} stroke={1} />
            </UnstyledButton>
        </Tooltip>
    );
}

const mockdata = [
    { icon: IconHome2, label: 'Strona główna' },
    { icon: IconCalendarEvent, label: 'Kalendarz?' },
    { icon: IconUsers, label: 'Twój zespół' },
    { icon: IconCalendarStats, label: 'Releases' },
    { icon: IconFingerprint, label: 'Security' },
    { icon: IconSettings, label: 'Settings' },
];

export function Navbar() {
    const [active, setActive] = useState(2);

    const links = mockdata.map((link, index) => (
        <NavbarLink
            {...link}
            key={link.label}
            active={index === active}
            onClick={() => setActive(index)}
        />
    ));

    return (
        <nav className={classes.navbar}>
            <Center pb={20}>
                <MantineLogo type="mark" inverted size={30} />
            </Center>

            <div className={classes.navbarMain}>
                <Stack justify="center" gap={20}>
                    {links}
                </Stack>
            </div>

            <Stack justify="center" gap={10}>
                <Avatar variant={"outline"} color={"white"} w={50} h={50} label={"aa"}>AW</Avatar>
                <NavbarLink icon={IconLogout} label="Logout" />
            </Stack>
        </nav>
    );
}