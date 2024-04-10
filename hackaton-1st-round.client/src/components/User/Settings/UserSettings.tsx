import { useState } from 'react';
import { ActionIcon, Card, Group, Switch, Text, useComputedColorScheme, useMantineColorScheme } from '@mantine/core';
import classes from './UserSettings.module.css';

export function UserSettings() {
    const { setColorScheme } = useMantineColorScheme();
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

    const [data, setData] = useState([
        {
            title: 'Motyw aplikacji',
            description: 'Motyw ciemny. Każdy jest mile widziany.',
            switchState: computedColorScheme === 'dark',
            handleSwitchChange: (index: number) => {
                const newData = [...data];
                newData[index].switchState = !newData[index].switchState;
                setData(newData);
                setColorScheme(newData[index].switchState ? 'dark' : 'light');
            }
        },
        { title: 'Powiadomienia na adres email', description: 'Na podany adres wyślemy potwierdzenie zgłoszenia na hackaton. PS. To nie działa', switchState: false },
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

    return (
        <Card withBorder radius="md" p="xl" className={classes.card}>
            <Text fz="lg" className={classes.title} fw={500}>
                Ustawienia
            </Text>
            <Text fz="xs" c="dimmed" mt={3} mb="xl">
                Zadbaj o wzrok i ustaw ciemny motyw.
            </Text>
            <div style={{ textAlign: "left" }}>
                {items}
            </div>
        </Card>
    );
}
