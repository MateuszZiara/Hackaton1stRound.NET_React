import React from "react";
import {Button, Container, Group, Image, List, rem, Text, ThemeIcon, Title} from "@mantine/core";
import {IconCheck} from "@tabler/icons-react";
import mainPage from "../../../../../public/mainPage.webp"
import classes from "./MainPage.module.css"
export function MainPage(){

    return(
        <Container size="md">
            <div className={classes.inner}>
                <div className={classes.content}>
                    <Title className={classes.title}>
                        Dodaj swój zespół na <span className={classes.highlight}>hackatonu</span> <br/> na Politechnice
                        Świętokrzyskiej.
                    </Title>
                    <Text c="dimmed" mt="md">
                        Sprawdź się w programowaniu ...
                    </Text>
                    <Group mt={30}>
                        <Button radius="xl" size="md" className={classes.control} >
                            Zarejestruj zespół
                        </Button>
                        <Button variant="default" radius="xl" size="md" className={classes.control}
                                >
                            Wyślij zgłoszenie
                        </Button>
                    </Group>
                </div>
                <Image src={mainPage} className={classes.image}/>
            </div>
        </Container>

    );
}