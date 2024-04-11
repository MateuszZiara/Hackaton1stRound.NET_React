import {Avatar, Button, Card, Divider, Flex, Group, Radio, rem, Space, Table} from "@mantine/core";
import React, { useState, useEffect } from "react";
import classes from "./AllTeams.module.css";
import cx from 'clsx';
import {IconArrowRight, IconDownload, IconMinus, IconPhoto, IconPlus} from "@tabler/icons-react";
import {useDisclosure} from "@mantine/hooks";

export function AllTeams() {
    const [teams, setTeams] = useState([]);
    const [selection, setSelection] = useState('1');
    const [loading, { toggle }] = useDisclosure();
    const [usersList, setUsersList] = useState([]);
    const [checkUsers, setCheckUsers] = useState(false);

    useEffect(() => {
        const fetchTeamDetails = async () => {
            try {
                const responseTeamDetails = await fetch("https://localhost:7071/api/TeamEntity/");
                const dataTeamDetails = await responseTeamDetails.json();

                const requests = dataTeamDetails.map(async (team) => {
                    const numberResponse = await fetch(`https://localhost:7071/api/TeamEntity/AmmountOfMembers/${team.id}`);
                    const dataNumberResponse = await numberResponse.json();

                    const responseAccepted = await fetch(`https://localhost:7071/api/Report/CheckAccepted/${team.id}`);
                    const dataAccepted = await responseAccepted.json();
                    console.log(dataAccepted);
                    let str;
                    if(dataAccepted == false)
                    {
                        str = "NIE";
                    }
                    else
                        str = "TAK";
                    return { ...team, amountOfMembers: dataNumberResponse, accepted: str};
                });

                const teamsWithDataNumberResponse = await Promise.all(requests);
                setTeams(teamsWithDataNumberResponse);
            } catch (error) {
                console.error('Error fetching team details:', error);
            }
        };

        fetchTeamDetails();
    }, []);

    const handleRadioChange = (id) => {
        setSelection(id);
    };

    const fetchUsers = async (id) => {
        const responseUserDetails = await fetch("https://localhost:7071/api/AspNetUsers/GetUsersFromTeamId/"+id);
        const userData = await responseUserDetails.json();
        const users = userData.map(user => ({
            id: user.Id,
            name: user.firstName,
            surname: user.lastName
        }));

        setUsersList(users);
        setCheckUsers(true);
    };

    const handleShowTeamDetails = async () => {
        const selectedTeam = teams.find(team => team.id === selection);
        if (selectedTeam) {
            await fetchUsers(selectedTeam.id);
        }
    };
    const renderUsersList = () => {
        return (
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
                gap: "8px"
            }}>
                {usersList.map((user) => (
                    <div key={user.id} style={{display: "flex", alignItems: "center"}}>
                        <Avatar style={{marginRight: '8px'}}>{user.name.charAt(0)}</Avatar>
                        <div>{user.name} {user.surname}</div>
                    </div>
                ))}
            </div>
        );
    };
    const rows = teams.map((team) => {
        const selected = selection === team.id;
        return (
            <Table.Tr key={team.id} className={cx({ [classes.rowSelected]: selected })}>
                <Table.Td>
                    <Radio checked={selected} onChange={() => handleRadioChange(team.id)} />
                </Table.Td>
                <Table.Td>{team.teamName}</Table.Td>
                <Table.Td>{team.teamDesc}</Table.Td>
                <Table.Td>{team.amountOfMembers}</Table.Td>
                <Table.Td>{team.accepted}</Table.Td>
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
            <Card withBorder radius="md" p="xs">
                <Group justify="center">
                    <Button variant={"outline"} rightSection={<IconPlus size={14}/>} onClick={handleShowTeamDetails} loading={loading}>Pokaż członków zespołu</Button>
                </Group>
            </Card>
            <div>
                <Space h="xl" />
                <Table w={'70vh'} stickyHeader stickyHeaderOffset={60} highlightOnHover >
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th style={{ width: rem(40) }}>
                                <span>Wybór</span>
                            </Table.Th>
                            <Table.Th>Nazwa zespołu</Table.Th>
                            <Table.Th>Opis zespołu</Table.Th>
                            <Table.Th>Ilość osób w zespole</Table.Th>
                            <Table.Th>Stan zespołu</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{rows}</Table.Tbody>
                </Table>
            </div>
            {!checkUsers ? (
                    <>

                    </>
                ) :
                (<>
                        {renderUsersList()}
                    </>
                )}
        </Flex>
    );
}
