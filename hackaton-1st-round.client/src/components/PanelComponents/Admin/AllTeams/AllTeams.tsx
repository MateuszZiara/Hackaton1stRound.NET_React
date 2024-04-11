import {Button, Card, Checkbox, Divider, Flex, Group, rem, Space, Switch, Table} from "@mantine/core";
import { useState, useEffect } from "react";
import classes from "./AllTeams.module.css";
import cx from 'clsx';
import {IconArrowRight, IconDownload, IconMinus, IconPhoto, IconPlus} from "@tabler/icons-react";
import {useDisclosure} from "@mantine/hooks";
export function AllTeams() {
    const [teams, setTeams] = useState([]);
    const [selection, setSelection] = useState(['1']);
    const [loading, { toggle }] = useDisclosure();
    const toggleRow = (id: string) =>
        setSelection((current) =>
            current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
        );
    const toggleAll = () =>
        setSelection((current) => (current.length === teams.length ? [] : teams.map((item) => item.id)));



    useEffect(() => {
        const fetchTeamDetails = async () => {
            try {
                const responseTeamDetails = await fetch("https://localhost:7071/api/TeamEntity/");
                const dataTeamDetails = await responseTeamDetails.json();

                const requests = dataTeamDetails.map(async (team) => {
                    const numberResponse = await fetch(`https://localhost:7071/api/TeamEntity/AmmountOfMembers/${team.id}`);
                    const dataNumberResponse = await numberResponse.json();
                    return { ...team, amountOfMembers: dataNumberResponse }; // Dodajemy nowe pole amountOfMembers
                });

                const teamsWithDataNumberResponse = await Promise.all(requests);
                setTeams(teamsWithDataNumberResponse);
            } catch (error) {
                console.error('Error fetching team details:', error);
            }
        };

        fetchTeamDetails();
    }, []);

    const rows = teams.map((team) => {
        const selected = selection.includes(team.id);
        return (
            <Table.Tr key={team.id} className={cx({ [classes.rowSelected]: selected })}>
                <Table.Td>
                    <Checkbox checked={selection.includes(team.id)} onChange={() => toggleRow(team.id)} />
                </Table.Td>
                <Table.Td>{team.teamName}</Table.Td>
                <Table.Td>{team.teamDesc}</Table.Td>
                <Table.Td>{team.amountOfMembers}</Table.Td>
            </Table.Tr>
        )
    });

    return (
        <Flex
            gap="sm"
            justify="flex-start"
            align="center"
            alignItems="stretch"
            direction="column"
            wrap="nowrap"
            style={{ height: '100%' }}
        >
            //TODO Funkcja do akceptowania/odrzucania zespołów
            <Card withBorder radius="md" p="xs">
                <Group justify="center">
                    <Button variant={"outline"} rightSection={<IconPlus size={14}/>} loading={loading}>Akceptuj zespół</Button>
                    <Button rightSection={<IconMinus size={14} />} loading={loading}>Odrzuć zespół</Button>
                </Group>
            </Card>
            <div>
                <Space h="xl" />
        <Table w={'70vh'} stickyHeader stickyHeaderOffset={60} highlightOnHover >
            <Table.Thead>
                <Table.Tr>
                    <Table.Th style={{ width: rem(40) }}>
                        <Checkbox
                            onChange={toggleAll}
                            checked={selection.length === teams.length}
                            indeterminate={selection.length > 0 && selection.length !== teams.length}
                        />
                    </Table.Th>
                    <Table.Th>Nazwa zespołu</Table.Th>
                    <Table.Th>Opis zespołu</Table.Th>
                    <Table.Th>Ilość osób w zespole</Table.Th>
                    {/* TODO Czekamy na pole Accepted w bazie */}
                    <Table.Th>Stan zespołu</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
        </Table>
            </div>
            <Switch checked={loading} onChange={toggle} label="Loading state" mt="md" />
        </Flex>
    );
}
