import { Container, Title, Text, Button, Group } from '@mantine/core';
import { Number } from './Number';
import classes from './Err404.module.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Err404() {
    const navigate = useNavigate();
    const [remainingSeconds, setRemainingSeconds] = useState(10); // Początkowa wartość 10 sekund

    useEffect(() => {
        // Funkcja typu IIFE, uruchamiana natychmiast po renderowaniu komponentu
        (function redirect() {
            // Ustawienie timeout na 10 sekund (10000 milisekund)
            const timeoutId = setTimeout(() => {
                // Przekierowanie użytkownika na podstronę /home
                navigate('/');
            }, remainingSeconds * 1000); // Użycie pozostałej liczby sekund

            // Zwrócenie funkcji czyszczącej timeout, aby uniknąć wycieków pamięci
            return () => clearTimeout(timeoutId);
        })();
    }, [navigate, remainingSeconds]); // Dodanie 'navigate' i 'remainingSeconds' do zależności useEffect

    // Funkcja odliczająca czas
    useEffect(() => {
        const intervalId = setInterval(() => {
            setRemainingSeconds(prevSeconds => prevSeconds - 1); // Zmniejszenie liczby sekund o 1 co sekundę
        }, 1000);

        // Czyszczenie intervalu po odmontowaniu komponentu
        return () => clearInterval(intervalId);
    }, []);

    return (
        <Container className={classes.root}>
            <div className={classes.inner}>
                <Number className={classes.image} />
                <div className={classes.content}>
                    <Title className={classes.title}>O nie!</Title>
                    <Text c="dimmed" size="lg" ta="center" className={classes.description}>
                        Strona zaginęła, może poszła na kawę z 418?<br />
                        Poczekaj {remainingSeconds} sekund aby automatycznie się przenieść na stronę główną.
                    </Text>
                    <Group justify="center">
                        <Button size="md" variant="outline">Przenieś mnie już teraz</Button>
                    </Group>
                </div>
            </div>
        </Container>
    );
}
