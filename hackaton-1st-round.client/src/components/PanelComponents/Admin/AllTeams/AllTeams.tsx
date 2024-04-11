import { Table } from "@mantine/core";
import { useState, useEffect } from "react";

export function AllTeams() {
    const [teams, setTeams] = useState([]);

    useEffect(() => {
        const fetchTeamDetails = async () => {
            try {
                const responseTeamDetails = await fetch("https://localhost:7071/api/TeamEntity/");
                const dataTeamDetails = await responseTeamDetails.json();
                setTeams(dataTeamDetails);
                console.log(dataTeamDetails);
            } catch (error) {
                console.error('Error fetching team details:', error);
            }
        };

        fetchTeamDetails();
    }, []);

    const rows = teams.map((team) => (
        <Table.Tr key={team.id}>
            <Table.Td>{team.teamName}</Table.Td>
            <Table.Td>{team.teamDesc}</Table.Td>
        </Table.Tr>
    ));

    return (
        <Table w={'70vh'} stickyHeader stickyHeaderOffset={60}>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>Nazwa zespołu</Table.Th>
                    <Table.Th>Opis zespołu</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
        </Table>
    );
}
