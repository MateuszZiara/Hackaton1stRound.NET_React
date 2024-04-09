import { Image, Container, Title, Button, Group, Text, List, ThemeIcon, rem } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import heroImage from '../../../public/heroImage.webp';
import classes from './Hero.module.css';
import React, {useEffect, useState} from "react";
import {checkUserLoggedIn} from "../../features/getCookies/getCookies";

export function Hero() {
    
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
        function buttonHandler()
        {
       
            if(loggedIn)
            {
                //Przejscie do stronki    
            }
            else
                window.location.href = "/pag";
            
        }
    function buttonHandlerSend()
    {

        if(loggedIn)
        {
            //Przejscie do stronki    
        }
        else
            window.location.href = "/pag";

    }
    
    
    return (
        <Container size="md">
            <div className={classes.inner}>
                <div className={classes.content}>
                    <Title className={classes.title}>
                        Dołącz do <span className={classes.highlight}>hackatonu</span> <br /> na Politechnice Świętokrzyskiej.
                    </Title>
                    <Text c="dimmed" mt="md">
                        Sprawdź się w programowaniu ...
                    </Text>
                    <div style={{textAlign: "left"}}>
                    <List
                        mt={30}
                        spacing="sm"
                        size="sm"
                        icon={
                            <ThemeIcon size={20} radius="xl">
                                <IconCheck style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
                            </ThemeIcon>
                        }
                    >
                        <List.Item>
                            <b>16 i 17 kwietnia</b> – przyjdź i zmierz się z innymi zespołami.
                        </List.Item>
                        <List.Item>
                            <b>Zespoły do 4 osób</b> – stwórz własny zespół i zawalcz o zwycięstwo.
                        </List.Item>
                        <List.Item>
                            <b>12 godzin</b> – podejmij wyzwanie i poznaj swoje możliwości.
                        </List.Item>
                    </List>
                    </div>
                    <Group mt={30}>
                        <Button radius="xl" size="md" className={classes.control} onClick ={buttonHandler}>
                            Zarejestruj zespół
                        </Button>
                        <Button variant="default" radius="xl" size="md" className={classes.control} onClick ={buttonHandlerSend}>
                            Wyślij zgłoszenie
                        </Button>
                    </Group>
                </div>
                <Image src={heroImage} className={classes.image} />
            </div>
        </Container>
    );
}