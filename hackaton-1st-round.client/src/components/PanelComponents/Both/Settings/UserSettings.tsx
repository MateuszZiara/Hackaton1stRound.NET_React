import { useEffect, useState } from 'react';
import {
    Button,
    Card,
    Group,
    Modal,
    PasswordInput,
    Switch,
    Text,
    TextInput,
    useComputedColorScheme,
    useMantineColorScheme
} from '@mantine/core';
import classes from './UserSettings.module.css';

export function UserSettings() {
    const { setColorScheme } = useMantineColorScheme();
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
    const [modalPassword, setModalPassword] = useState(false);
    const [modalEmail, setModalEmail] = useState(false);
    const [userId, setUserId] = useState();
    const [userLoginMethod, setUserLoginMethod] = useState();
    const [data, setData] = useState([
        {
            title: 'Motyw aplikacji',
            description: 'Ustaw motyw ciemny lub jasny',
            switchState: computedColorScheme === 'dark',
            handleSwitchChange: (index) => {
                const newData = [...data];
                newData[index].switchState = !newData[index].switchState;
                setData(newData);
                setColorScheme(newData[index].switchState ? 'dark' : 'light');
            }
        },
    ]);

    const items = data.map((item, index) => (
        <Group justify="space-between" className={classes.item} wrap="nowrap" gap="xl" key={item.title}>
            <div>
                <Text>{item.title}</Text>
                <Text size="xs" c="dimmed">
                    {item.description}
                </Text>
            </div>
            <Switch
                onLabel="1"
                offLabel="0"
                className={classes.switch}
                size="lg"
                onChange={() => item.handleSwitchChange(index)}
                checked={item.switchState}
            />
        </Group>
    ));

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
                setUserId(data.id);
                setUserLoginMethod(data.provider);
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        fetchData();
    }, []);

    const handleChangePassword = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const oldPassword = formData.get('oldPassword');
        const newPassword = formData.get('newPassword');

        const url = "https://localhost:7071/api/AspNetUsers/changePassword";
        const data = {
            id: userId,
            oldPassword: oldPassword,
            newPassword: newPassword
        };

        try {
            const response = await fetch(url, {
                credentials: 'include',
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorMessage}`);
            } else {
                window.location.reload();
            }
        } catch (error) {
            console.error('Error changing password:', error);
        }
    };

    const handleChangeEmail = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const oldEmail = formData.get('oldEmail');
        const oldPassword = formData.get('oldPassword');
        const newEmail = formData.get('newEmail');

        const url = "https://localhost:7071/api/AspNetUsers/changeEmail";
        const data = {
            id: userId,
            oldEmail: oldEmail,
            oldPassword: oldPassword,
            newEmail: newEmail
        };

        try {
            const response = await fetch(url, {
                credentials: 'include',
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorMessage}`);
            } else {
                window.location.reload();
            }
        } catch (error) {
            console.error('Error changing password:', error);
        }
    };

    return (
        <Card withBorder radius="md" p="xl" className={classes.card}>
            <Text fz="lg" className={classes.title} fw={500}>
                Ustawienia
            </Text>
            <Text fz="xs" c="dimmed" mt={3} mb="xl">
                Tutaj zmienisz hasło do konta.
            </Text>
            <div style={{ textAlign: "left" }}>
                {items}
            </div>
            <Group p={50}>
                <Button variant={"outline"} onClick={() => setModalEmail(true)} disabled={userLoginMethod !== 'Website'}>Zmiana adresu email</Button>
                <Button variant={"outline"} onClick={() => setModalPassword(true)} disabled={userLoginMethod !== 'Website'}>Zmiana hasła</Button>
                <Modal
                    title={"Zmiana hasła"}
                    size={'60vw'}
                    opened={modalPassword}
                    onClose={() => setModalPassword(false)}
                    centered
                    shadow={"md"}
                    style={{ position: 'absolute', top: '0%', left: '0%' }}
                    overlayProps={{
                        backgroundOpacity: 0.05,
                        color: '#ffffff',
                        blur: 6
                    }}
                >
                    <form onSubmit={handleChangePassword}>
                        <PasswordInput
                            name="oldPassword"
                            label={"Aktualne hasło"}
                        />
                        <PasswordInput
                            name="newPassword"
                            label={"Nowe hasło"}
                        />
                        <Button type="submit">Zatwierdź</Button>
                    </form>
                </Modal>
                <Modal
                    title={"Zmiana adresu email"}
                    size={'60vw'}
                    opened={modalEmail}
                    onClose={() => setModalEmail(false)}
                    centered
                    shadow={"md"}
                    style={{ position: 'absolute', top: '0%', left: '0%' }}
                    overlayProps={{
                        backgroundOpacity: 0.05,
                        color: '#ffffff',
                        blur: 6
                    }}
                >
                    <form onSubmit={handleChangeEmail}>
                        <TextInput
                            name="oldEmail"
                            label={"Aktualny adres email"}
                        />
                        <PasswordInput
                            name="oldPassword"
                            label={"Aktualne hasło"}
                        />
                        <TextInput
                            name="newEmail"
                            label={"Nowy adres email"}
                        />
                        <Button type="submit">Zatwierdź</Button>
                    </form>
                </Modal>
            </Group>
        </Card>
    );
}
