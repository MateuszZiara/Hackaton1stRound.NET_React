import React from "react";
import { Button, Container, Image, Text, Title } from "@mantine/core";
import mainPage from "../../../../../public/mainPage.webp";
import classes from "./MainPage.module.css";


function ButtonMyTeam() {
        window.location.href = "/myteam";
}
function ButtonPayment() {
    window.location.href = "/payment";
}
export function MainPage() {
    return (
        <Container size="md" className={classes.container}>
            <div className={classes.inner}>
                <div className={classes.content}>
                    <Title className={classes.title}>
                        Dodaj swój zespół na <span className={classes.highlight}>hackatonu</span> <br /> na Politechnice
                        Świętokrzyskiej.
                    </Title>
                    <Text color="dimmed" mt="md">
                        Sprawdź się w programowaniu ...
                    </Text>
                    <div className={classes.buttons}>
                        <Button radius="xl" size="md" className={classes.control} onClick={ButtonMyTeam}>
                            Stwórz zespół!
                        </Button>
                        <Button variant="default" radius="xl" size="md" className={classes.control} onClick={ButtonPayment}>
                            Przejdź do płatności!
                        </Button>
                    </div>
                </div>
                <Image src={mainPage} className={classes.image} />
            </div>
        </Container>
    );
}
