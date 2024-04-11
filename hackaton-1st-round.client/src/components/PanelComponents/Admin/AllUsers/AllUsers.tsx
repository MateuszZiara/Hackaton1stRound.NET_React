import {Button, Card, Checkbox, Flex, Group, rem, Space, Switch, Table} from "@mantine/core";
import {IconMinus, IconPlus, IconUserEdit, IconUserMinus, IconUserPlus} from "@tabler/icons-react";
import {useDisclosure} from "@mantine/hooks";
import {useState} from "react";
import ModalDeleteUser from "../../../ModalDeleteUser/ModalDeleteUser";

export function AllUsers(){
    const [selection, setSelection] = useState(['1']);
    const [loading, { toggle }] = useDisclosure();
    const toggleRow = (id: string) =>
        setSelection((current) =>
            current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
        );
    const toggleAll = () =>
        setSelection((current) => (current.length === xxxx.length ? [] : xxxx.map((item) => item.id)));


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

                    <Button variant={"outline"} rightSection={<IconUserPlus size={14}/>} loading={loading}>Dodaj nowego użytkownika</Button>
                    <Button variant={"outline"} rightSection={<IconUserEdit size={14} />} loading={loading}>Edytuj użytkownika</Button>
                    <Button rightSection={<IconUserMinus size={14} />} loading={loading}>Usuń użytkownika</Button>
                    <ModalDeleteUser />
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
                                    /*checked={selection.length === xxxx.length}
                                    indeterminate={selection.length > 0 && selection.length !== xxxx.length}*/
                                />
                            </Table.Th>
                            <Table.Th>Imię</Table.Th>
                            <Table.Th>Nazwisko</Table.Th>
                            <Table.Th>Adres email</Table.Th>
                            <Table.Th>Zespół</Table.Th>
                            <Table.Th>Rola</Table.Th>
                            {/* TODO Czekamy na pole Accepted w bazie */}
                            <Table.Th>Stan zespołu</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    {/*<Table.Tbody>{xxxx}</Table.Tbody>*/}
                </Table>
            </div>
            <Switch checked={loading} onChange={toggle} label="Loading state" mt="md" />
        </Flex>
    );
}