import { Flex } from "@mantine/core";
import { Navbar } from "../../layouts/Navbar/Navbar";
import YourTeam from "../../components/PanelComponents/User/YourTeam/YourTeam";
import {AllTeams} from "../../components/PanelComponents/Admin/AllTeams/AllTeams";

export default function TeamsPage() {
    return (
        <Flex
            gap="lg"
            justify="center"
            align="flex-start"
            direction="row"
            wrap="nowrap"
        >
            <div style={{ zIndex: 1 }}>
                <Navbar />
            </div>
            <div style={{ zIndex: 0 }}>
                <AllTeams />
            </div>
        </Flex>
    );
}
