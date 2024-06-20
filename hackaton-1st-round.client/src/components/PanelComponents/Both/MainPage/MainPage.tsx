import React, { useEffect, useState } from "react";
import { Button, Container, Image, Text, Title } from "@mantine/core";
import mainPage from "../../../../../public/mainPage.webp";
import classes from "./MainPage.module.css";



export function MainPage() {
    const [userRank, setUserRank] = useState<number | null>(null);

    function ButtonMyTeam() {
        window.location.href = "/myteam";
    }

    function ButtonAllTeams() {
        window.location.href = "/teams";
    }

    function ButtonPayment() {
        window.location.href = "/payment";
    }

    function ButtonAllUsers() {
        window.location.href = "/users";
    }


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
                setUserRank(data.userRank);
            } catch (error) {
                console.error('Error fetching team details:', error);
            }
        };

        fetchData();
    }, []);

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
                        {userRank === 2 ? (
                            <>
                                <Button radius="xl" size="md" className={classes.control} onClick={ButtonAllTeams}>
                                    Zobacz zespoły
                                </Button>
                                <Button variant="default" radius="xl" size="md" className={classes.control} onClick={ButtonAllUsers}>
                                    Sprawdź zarejestrowanych zawodników
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button radius="xl" size="md" className={classes.control} onClick={ButtonMyTeam}>
                                    Stwórz zespół!
                                </Button>
                                <Button variant="default" radius="xl" size="md" className={classes.control} onClick={ButtonPayment}>
                                    Przejdź do płatności!
                                </Button>
                            </>
                        )}
                    </div>
                </div>
                <Image src={mainPage} className={classes.image} />
            </div>
        </Container>
    );
}