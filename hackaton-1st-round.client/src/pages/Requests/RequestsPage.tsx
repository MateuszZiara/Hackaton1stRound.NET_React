import { Flex } from "@mantine/core";
import { Navbar } from "../../layouts/Navbar/Navbar";
import YourTeam from "../../components/PanelComponents/User/YourTeam/YourTeam";
import {AllTeams} from "../../components/PanelComponents/Admin/AllTeams/AllTeams";
import {AllRequests} from "../../components/PanelComponents/Admin/AllRequests/AllRequests";

export default function RequestsPage() {
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
                <AllRequests />
            </div>
        </Flex>
    );
}
