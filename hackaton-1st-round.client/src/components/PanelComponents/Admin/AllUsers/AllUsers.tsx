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
    Avatar,
    Radio,
    TextInput, PasswordInput
} from "@mantine/core";
import {IconUserPlus, IconUserEdit, IconUserMinus, IconPlus, IconMinus} from "@tabler/icons-react";
import React, {useEffect, useState} from "react";
import {useDisclosure} from "@mantine/hooks";
import cx from 'clsx';
import classes from '../AllTeams/AllTeams.module.css';
import {useForm} from "@mantine/form";

export function AllUsers() {
    const [teams, setTeams] = useState([]);
    const [selection, setSelection] = useState('1');
    const [loading, { toggle }] = useDisclosure();
    const [addUserModalOpen, setAddUserModalOpen] = useState(false);
    const toggleRow = (id) => {
        setSelection((current) =>
            current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
        );
    };

    const toggleAll = () => {
        setSelection((current) => (current.length === teams.length ? [] : teams.map((item) => item.id)));
    };
    useEffect(() => {
        const fetchTeamDetails = async () => {
            try {
                const responseTeamDetails = await fetch("https://localhost:7071/api/AspNetUsers/");
                const dataTeamDetails = await responseTeamDetails.json();

                setTeams(dataTeamDetails);
                console.log(dataTeamDetails);
            } catch (error) {
                console.error('Error fetching team details:', error);
            }
        };

        fetchTeamDetails();
    }, []);


    const rows = teams.map((request) => {
        const selected = selection.includes(request.id);
        return (
            <Table.Tr key={request.id} className={cx({ [classes.rowSelected]: selected })}>
                <Table.Td>
                    <Checkbox checked={selection.includes(request.id)} onChange={() => toggleRow(request.id)} />
                </Table.Td>
                <Table.Td>{request.firstName}</Table.Td>
                <Table.Td>{request.lastName}</Table.Td>
                <Table.Td>{request.email}</Table.Td>
                <Table.Td>{request.teamName}</Table.Td>
            </Table.Tr>
        )
    });


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
                    <Button variant={"outline"} rightSection={<IconUserPlus size={14} />} onClick={() => setAddUserModalOpen(true)} loading={loading}>Dodaj nowego użytkownika</Button>
                    <Button variant={"outline"} rightSection={<IconUserEdit size={14} />} loading={loading}>Edytuj użytkownika</Button>
                    <Button rightSection={<IconUserMinus size={14} />} loading={loading}>Usuń użytkownika</Button>
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
                    {<Table.Tbody>{rows}</Table.Tbody>}
                </Table>
            </div>
            <Switch checked={loading} onChange={toggle} label="Loading state" mt="md" />

            {/* Modal do dodawania nowego użytkownika */}
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
                        required
                        label="Adres email"
                        placeholder="hackaton@tu.kielce.pl"
                        value={form.values.email}
                        onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
                        error={form.errors.email && 'Podany adres jest nieprawidłowy'}
                        radius="md"
                    />
                    <PasswordInput
                        required
                        label="Hasło"
                        placeholder="Twoje hasło"
                        value={form.values.password}
                        onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
                        error={form.errors.password && 'Hasło powinno zawierać minimum 8 znaków'}
                        radius="md"
                    />
                        <Group pt={50}>
                            <Button variant={"outline"} rightSection={<IconPlus size={14}/>} loading={loading} /*onClick = {}*/>Dodaj użytkownika</Button>
                            <Button rightSection={<IconMinus size={14} />} loading={loading} /*onClick = {}*/>Anuluj</Button>
                        </Group>
                </div>
            </Modal>

        </Flex>
    );
}
