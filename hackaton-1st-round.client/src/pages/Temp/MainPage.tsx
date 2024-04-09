import { Container, Text, Button, Group, MantineProvider, Anchor, Checkbox, PasswordInput, Stack, TextInput } from '@mantine/core';

import classes from "../Index/Home.module.css";
import { HeaderMenu } from "../../layouts/Header/HeaderMenu";
import React, { useEffect, useState } from "react";
import { IconLogout } from "@tabler/icons-react";
import { upperFirst, useToggle } from "@mantine/hooks"; // Adjusted import
import { useForm } from "@mantine/form"; // Adjusted import

export default function MainPage() {
    const handleGetStartedClick = () => {
       // window.location.href = "/pag"; - 
    };
    const [type, toggle] = useToggle(['login', 'register']);
    const form = useForm({
        initialValues: {
            old_password: '',
            name: '',
            password: '',
            terms: true,
        },

        validate: {
            password: (val) => (val.length <= 4 ? 'Password should include at least 4 characters' : null),
        },
    });
    const [email, setEmail] = useState('');
    async function handleChangePassword()
    {
        const url = "https://localhost:7142/manage/info";
        const data = {
            newEmail: email,
            newPassword: form.values.password,
            oldPassword: form.values.old_password,
        }
        try {
            const response = await fetch(url, {
                credentials: 'include',
                method: 'POST',
                headers: {
                    'Content-Type':
                        'application/json',
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorMessage}`);
            }
            else {
                console.log("Haslo zmienione");
                await logout();
                window.location.href = "/pag";
            }
        }catch (error) {
            console.error('Error changing password', error);
        }
        
    }
    async function getCookies() {
        const response = await fetch("https://localhost:7142/api/AspNetUsers/info", {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials':'true'
            }
            
        });
        const data = await response.json();
        return data.email;
    }
    async function logout() {
        const response = await fetch("https://localhost:7142/api/AspNetUsers/logout", {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': 'true'
            }
        });
        window.location.href = "/pag";
    }
    useEffect(() => {
        getCookies().then(email => setEmail(email));
    }, []);
    
    return (
        <div>
            <div>
                <HeaderMenu />
                <div className={classes.wrapper}>
                    <Container size={700} className={classes.inner}>
                        <h1 className={classes.title}>
                            {' '}
                            <Text component="span" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }} inherit>
                                {email}
                            </Text>{' '}
                        </h1>
                        
                        <Group className={classes.controls}>
                            <Button
                                size="xl"
                                className={classes.control}
                                variant="gradient"
                                onClick={handleGetStartedClick} // Add onClick event handler
                            >
                                Get started
                            </Button>
                            <Button
                                component="a"
                                size="xl"
                                variant="default"
                                className={classes.control}
                                leftSection={<IconLogout size={20} />}
                                onClick = {logout}
                            >
                                Wyloguj
                            </Button>
                        </Group>
                    </Container>
                </div>
            </div>
            <form onSubmit={form.onSubmit(() => { })}>
                <Stack>
                    <PasswordInput
                        required
                        label="Old Password"
                        placeholder="Old Password"
                        value={form.values.old_password}
                        onChange={(event) => form.setFieldValue('old_password', event.currentTarget.value)}
                        radius="md"
                    />

                    <PasswordInput
                        required
                        label="Password"
                        placeholder="New Password"
                        value={form.values.password}
                        onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
                        radius="md"
                    />
                </Stack>
                <Group justify="space-between" mt="xl">
                    <Button type="submit" radius="xl" onClick={handleChangePassword}>
                        Zmien haslo
                    </Button>
                </Group>
            </form>
        </div>
    );
}
