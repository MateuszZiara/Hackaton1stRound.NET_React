import React, { useEffect, useState } from "react";
import {
    Button,
    Card,
    Checkbox,
    Flex,
    Group,
    rem,
    Space,
    Switch,
    Table,
    Modal,
    TextInput,
    PasswordInput
} from "@mantine/core";
import { IconUserPlus, IconUserEdit, IconUserMinus, IconPlus, IconMinus } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import cx from 'clsx';
import classes from '../AllTeams/AllTeams.module.css';
import { useForm } from "@mantine/form";

export function AllUsers() {
    const [teams, setTeams] = useState([]);
    const [selection, setSelection] = useState([]);
    const [loading, { toggle }] = useDisclosure();
    const [addUserModalOpen, setAddUserModalOpen] = useState(false);
    const [editUserModalOpen, setEditUserModalOpen] = useState(false);
    const [deleteUserModalOpen, setDeleteUserModalOpen] = useState(false);
    const [rows, setRows] = useState([]);
    useEffect(() => {
        const fetchTeamDetails = async () => {
            try {
                const responseTeamDetails = await fetch("https://localhost:7071/api/AspNetUsers/");
                const dataTeamDetails = await responseTeamDetails.json();

                setTeams(dataTeamDetails);
            } catch (error) {
                console.error('Error fetching team details:', error);
            }
        };

        fetchTeamDetails();
    }, []);

    async function getName(id) {
        const responseTeamDetails = await fetch("https://localhost:7071/api/TeamEntity/id/" + id);
        const dataTeamDetails = await responseTeamDetails.json();
        return dataTeamDetails.teamName;
    }

    useEffect(() => {
        const fetchData = async () => {
            const rows = await Promise.all(teams.map(async (request) => {
                const selected = selection.includes(request.id);
                let name;
                if (request.teamEntity_FK == null) {
                    name = "Brak";
                } else {
                    name = await getName(request.teamEntity_FK);
                }
                return (
                    <Table.Tr key={request.id} className={cx({ [classes.rowSelected]: selected })}>
                        <Table.Td>
                            <Checkbox checked={selection.includes(request.id)} onChange={() => toggleRow(request.id)} />
                        </Table.Td>
                        <Table.Td>{request.firstName}</Table.Td>
                        <Table.Td>{request.lastName}</Table.Td>
                        <Table.Td>{request.email}</Table.Td>
                        <Table.Td>{name}</Table.Td>
                    </Table.Tr>
                );
            }));
            setRows(rows);
        };

        fetchData();
    }, [teams, selection]);

    const toggleRow = (id) => {
        setSelection((current) =>
            current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
        );
    };

    const toggleAll = () => {
        setSelection((current) => (current.length === teams.length ? [] : teams.map((item) => item.id)));
    };

    const form = useForm({
        initialValues: {
            email: '',
            firstName: '',
            lastName: '',
            password: '',
            terms: true,
        },
        validate: {
            email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
            password: (val) => (val.length <= 4 ? 'Password should include at least 4 characters' : null),
        },
    });

    async function handleRegister() {
        const checkEmailUrl = "https://localhost:7071/api/AspNetUsers/checkEmail/" + form.values.email;
        const registerUrl = "https://localhost:7071/api/AspNetUsers/registerCustom";

        try {
            const emailResponse = await fetch(checkEmailUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!emailResponse.ok) {
                const errorMessage = await emailResponse.text();
                throw new Error(`HTTP error! Status: ${emailResponse.status}, Message: ${errorMessage}`);
            }

            const emailExists = await emailResponse.json();

            if (emailExists) {
                return;
            }

            const registerData = {
                FirstName: form.values.firstName,
                LastName: form.values.lastName,
                Email: form.values.email,
                PasswordHash: form.values.password,
            };

            const registerResponse = await fetch(registerUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registerData),
            });

            if (!registerResponse.ok) {
                const errorMessage = await registerResponse.text();
                throw new Error(`HTTP error! Status: ${registerResponse.status}, Message: ${errorMessage}`);
            }

            window.location.href = "/panel";

        } catch (error) {
            console.error('Error during registration:', error);
        }
    }

    // Function to log selected item IDs
    const logSelectedItems = () => {
        console.log("Selected item IDs:", selection);
    };

    async function buttonLogic() {
        const selectedIds = selection.filter(id => id);
        console.log(selectedIds);
        for (let id of selectedIds) {
            const url = "https://localhost:7071/api/AspNetUsers/update/"+id+"?"+"email="+form.values.email+"&"+"firstName"+form.values.firstName+"&lastName="+form.values.lastName;
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        }
        window.location.href = "/panel";
    }
    async function buttonLogicDelete() {
        const selectedIds = selection.filter(id => id);
        console.log(selectedIds);
        for (let id of selectedIds) {
            const url = "https://localhost:7071/api/AspNetUsers/"+id;
            const response = await fetch(url, {
                method: 'DELETE',
            });
        }
        window.location.href = "/panel";
    }

    return (
        <Flex
            gap="sm"
            justify="flex-start"
            alignitems="center"
            direction="column"
            wrap="nowrap"
            style={{ height: '100%' }}
        >
            <Card withBorder radius="md" p="xs">
                <Group justify="center">
                    <Button variant={"outline"} rightSection={<IconUserPlus size={14} />} onClick={() => setAddUserModalOpen(true)} loading={loading}>Dodaj nowego użytkownika</Button>
                    <Button variant={"outline"} rightSection={<IconUserEdit size={14} />} onClick={() => setEditUserModalOpen(true)} loading={loading}>Edytuj użytkownika</Button>
                    <Button rightSection={<IconUserMinus size={14} />} onClick={() => setDeleteUserModalOpen(true)} loading={loading}>Usuń użytkownika</Button>
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
                                    checked={selection.length === rows.length}
                                    indeterminate={selection.length > 0 && selection.length !== rows.length}
                                />
                            </Table.Th>
                            <Table.Th>Imię</Table.Th>
                            <Table.Th>Nazwisko</Table.Th>
                            <Table.Th>Adres email</Table.Th>
                            <Table.Th>Zespół</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{rows}</Table.Tbody>
                </Table>
            </div>
            <Switch checked={loading} onChange={toggle} label="Loading state" mt="md" />

            <Modal
                title="Dodaj nowego użytkownika"
                opened={addUserModalOpen}
                onClose={() => setAddUserModalOpen(false)}
                style={{ position: 'fixed', top: '50%', left: '0%'}}
            >
                <div style={{ textAlign: 'center' }}>

                    <TextInput
                        label="Imie"
                        placeholder="Podaj imię"
                        value={form.values.firstName}
                        onChange={(event) => form.setFieldValue('firstName', event.currentTarget.value)}
                        radius="md"
                    />
                    <TextInput
                        label="Nazwisko"
                        placeholder="Podaj nazwisko"
                        value={form.values.lastName}
                        onChange={(event) => form.setFieldValue('lastName', event.currentTarget.value)}
                        radius="md"
                    />
                    <TextInput
                        label="Adres e-mail"
                        placeholder="Podaj adres e-mail"
                        value={form.values.email}
                        onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
                        radius="md"
                    />
                    <PasswordInput
                        label="Hasło"
                        placeholder="Podaj hasło"
                        value={form.values.password}
                        onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
                        radius="md"
                    />
                    <Checkbox
                        label="Akceptuję regulamin"
                        checked={form.values.terms}
                        onChange={(event) => form.setFieldValue('terms', event.currentTarget.checked)}
                        radius="md"
                    />
                    <Button
                        onClick={handleRegister}
                        loading={loading}
                        disabled={!form.values.terms || form.errors.email || form.errors.password || !form.values.firstName || !form.values.lastName}
                    >
                        Zarejestruj się
                    </Button>
                </div>
            </Modal>

            <Modal
                title="Edytuj istniejącego użytkownika"
                opened={editUserModalOpen}
                onClose={() => setEditUserModalOpen(false)}
                style={{ position: 'fixed', top: '50%', left: '0%'}}
            >
                <div style={{ textAlign: 'center' }}>

                    <TextInput
                        label="Imie"
                        placeholder="Podaj imię"
                        value={form.values.firstName}
                        onChange={(event) => form.setFieldValue('firstName', event.currentTarget.value)}
                        radius="md"
                    />
                    <TextInput
                        label="Nazwisko"
                        placeholder="Podaj nazwisko"
                        value={form.values.lastName}
                        onChange={(event) => form.setFieldValue('lastName', event.currentTarget.value)}
                        radius="md"
                    />
                    <TextInput
                        label="Adres e-mail"
                        placeholder="Podaj adres e-mail"
                        value={form.values.email}
                        onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
                        radius="md"
                    />
                    <PasswordInput
                        label="Hasło"
                        placeholder="Podaj hasło"
                        value={form.values.password}
                        onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
                        radius="md"
                    />
                    <Checkbox
                        label="Akceptuję regulamin"
                        checked={form.values.terms}
                        onChange={(event) => form.setFieldValue('terms', event.currentTarget.checked)}
                        radius="md"
                    />
                    <Button
                        onClick={buttonLogic} //TODO NOWA FUNKCJA
                        loading={loading}
                        disabled={!form.values.terms || form.errors.email || form.errors.password || !form.values.firstName || !form.values.lastName}
                    >
                        Wprowadź zmiany
                    </Button>
                </div>
            </Modal>

            <Modal
                title="Usuń wybranego użytkownika"
                opened={deleteUserModalOpen}
                onClose={() => setDeleteUserModalOpen(false)}
                style={{ position: 'fixed', top: '50%', left: '0%'}}
            >
                <div style={{ textAlign: 'center' }}>
                    Wybranej operacji nie da się cofnąć!
                    <Group>
                        <Button
                            onClick={buttonLogicDelete} //TODO NOWA FUNKCJA
                            loading={loading}

                        >
                            Wprowadź zmiany
                        </Button>
                        <Button
                            onClick={handleRegister} //TODO NOWA FUNKCJA
                            loading={loading}

                        >
                            Anuluj zmiany
                        </Button>
                    </Group>
                </div>
            </Modal>
           
        </Flex>
    );
}
