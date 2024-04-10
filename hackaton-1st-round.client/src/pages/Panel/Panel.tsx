// panel.tsx
import { useState } from 'react';
import { Flex } from "@mantine/core";
import { Navbar } from "../../layouts/Navbar/Navbar";
import { MainPage } from "../../components/User/MainPage/MainPage";
import {UserSettings} from "../../components/User/Settings/UserSettings";
import YourTeam from "../../components/User/YourTeam/YourTeam";


export default function Panel() {
    const [activePage, setActivePage] = useState("home"); // Domyślnie wyświetlany będzie komponent Home

    // Funkcja renderująca odpowiedni komponent w zależności od aktywnej strony
    const renderPageUser = () => {
        switch (activePage) {
            case "home":
                return <MainPage />;
            case "teams":
                return <YourTeam />;
            case "settings":
                return <UserSettings />;
            default:
                return <MainPage />;
        }
    };

    const renderPageAdmin = () => {
        switch (activePage) {
            case "home":
                return <MainPage />;
            case "teams":
                return <YourTeam />;
            case "users":
                return <UserSettings />;
            case "files":
                return <UserSettings />;
            case "settings":
                return <UserSettings />;
            default:
                return <MainPage />;
        }
    };

    return (
        <Flex
            gap="sm"
            justify="flex-end"
            align="start"
            direction="row"
            wrap="nowrap"
        >
            <div style={{ zIndex: 1}}>
                <Navbar setActivePage={setActivePage} />
            </div>
            <div style={{ zIndex: 0}}>
                {/*
                {
                x === 'Admin' ?
                    (
                        renderPageAdmin()
                    ) : (
                        renderPageUser()
                    )
            }
            */}
                {renderPageUser()}
            </div>
        </Flex>
    );
}
