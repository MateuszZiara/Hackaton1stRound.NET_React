// panel.tsx
import {useEffect, useState} from 'react';
import { Flex } from "@mantine/core";
import { Navbar } from "../../layouts/Navbar/Navbar";
import { MainPage } from "../../components/PanelComponents/Both/MainPage/MainPage";
import {UserSettings} from "../../components/PanelComponents/Both/Settings/UserSettings";
import YourTeam from "../../components/PanelComponents/User/YourTeam/YourTeam";
import {AllTeams} from "../../components/PanelComponents/Admin/AllTeams/AllTeams";
import {AllUsers} from "../../components/PanelComponents/Admin/AllUsers/AllUsers";
import {AllFiles} from "../../components/PanelComponents/Admin/AllFiles/AllFiles";


export default function Panel() {
    const [activePage, setActivePage] = useState("home"); // Domyślnie wyświetlany będzie komponent Home
    const [userRank, setUserRank] = useState(null);

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
                return <AllTeams />;
            case "users":
                return <AllUsers />;
            case "files":
                return <AllFiles />;
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
                {
                userRank === 1 ?
                    (
                        renderPageAdmin()
                    ) : (
                        renderPageUser()
                    )
            }
            </div>
        </Flex>
    );
}
