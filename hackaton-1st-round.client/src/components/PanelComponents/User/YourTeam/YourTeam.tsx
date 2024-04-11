import React, { useState, useEffect } from 'react';
import {TextInput, Textarea, Button, Paper, Text, List, ListItem, Avatar, Modal, Title, FileInput, Flex, Card} from '@mantine/core';
import { useForm } from '@mantine/form';
import {checkUserLoggedIn, gethasTeam} from "../../../../features/getCookies/getCookies";
import {Await} from "react-router";
import {useDisclosure} from "@mantine/hooks";
import classes from "./YourTeam.module.css"

export function YourTeam() {
    const [fileName, setFileName] = useState("test");
    const [path, setPath] = useState("");
    const [hasTeam, setHasTeam] = useState(false);
    const [teamName, setTeamName] = useState('');
    const [teamDescription, setTeamDescription] = useState('');
    const [users, setUsers] = useState([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [opened, { open, close }] = useDisclosure(false);
  let number = 0;
    const form = useForm({
        initialValues: {
            TeamName: '',
            TeamDescription: '',
            invitation: '',
        },
            validate: {
                TeamName: (val) => (val && val.length > 2 ? null : 'Pole musi zawierać więcej niż 2 znaki'),
                TeamDescription: (val) => (val && val.length > 30 ? null : 'Opis musi zawierać więcej niż 30 znaków'),
            },

        }
    )

    async function SendInvite() {
        const url = "https://localhost:7071/api/AspNetUsers/addToTeam/" + form.values.invitation;
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to add user to team');
        }

        // Handle successful response here if needed
        console.log('User added to team successfully');

        window.location.href = "/panel";
    }

    async function handleRegister() {
        const url = "https://localhost:7071/api/TeamEntity/createTeamByUser";
        const data = {

            TeamName: form.values.TeamName,
            TeamDesc: form.values.TeamDescription,
        }
        try {
            const response = await fetch(url, {
                credentials: 'include',
                method: 'POST',
                headers: {
                    'Content-Type':
                        'application/json',
                },
                body: JSON.stringify(data),
            });
        }catch (error) {
            console.error('Error creating entity:', error);
        }
        window.location.href = "/panel";



    }

   /* useEffect(async () => {
        // Assuming gethasTeam function returns a boolean indicating if the user has a team
        const hasTeam = gethasTeam();
        setHasTeam(await hasTeam);

        if (hasTeam) {
            fetchUsers();
        }
    }, []);*/


    const [file, setFile] = useState(null);

    const handleFileChange = (file: File) => {
        setSelectedFile(file);
    };

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission
        const responseUserDetails = await fetch("https://localhost:7071/api/AspNetUsers/info", {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': 'true'
            }

        });
        const data = await responseUserDetails.json();
        var id = data.teamEntity_FK;
        if (!selectedFile) {
            console.error('No file selected');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);

            const response = await fetch('https://localhost:7071/api/Report/upload/'+teamName+"/"+id, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                console.error('Failed to upload file');
                return;
            }

            console.log('File uploaded successfully');
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const isLoggedIn = await checkUserLoggedIn();
                if (!isLoggedIn) {
                    window.location.href = "/404";
                }
            } catch (error) {
                console.error('Error checking user login status:', error);
            }
        };

        const checkIfHasTeam = async () => {
            try {
                const hasTeam = await gethasTeam();
                if (!hasTeam) {
                    setHasTeam(false);
                } else {
                    setHasTeam(true);
                }
            } catch (error) {
                console.error('Error checking if user has a team:', error);
            }
        };

        const update = async () => {
            try {
                const hasTeam = await gethasTeam();
                if (hasTeam) {
                    await Promise.all([fetchTeamDetails(), fetchUsers()]);
                }
            } catch (error) {
                console.error('Error updating team details:', error);
            }
        };

        const initialize = async () => {
            await fetchData();
            await checkIfHasTeam();
            await update();
        };

        initialize();
    }, []);

    const fetchTeamDetails = async () => {
        const responseUserDetails = await fetch("https://localhost:7071/api/AspNetUsers/info", {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': 'true'
            }

        });
        const data = await responseUserDetails.json();
        var id = data.teamEntity_FK;
        const responseTeamDetails = await fetch("https://localhost:7071/api/TeamEntity/id/"+id);
        const dataTeamDetails = await responseTeamDetails.json();
        const numberResponse = await fetch("https://localhost:7071/api/TeamEntity/AmmountOfMembers/"+id);
        const dataNumberResponse = await numberResponse.json();
        number = dataNumberResponse;
        setTeamName(dataTeamDetails.teamName);
        setTeamDescription(dataTeamDetails.teamDesc);
        console.log(number);
    };
    const fetchUsers = async () => {
        const responseUserDetails = await fetch("https://localhost:7071/api/AspNetUsers/GetUsersFromTeamCookies",{
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': 'true'
            }

        });
        const userData = await responseUserDetails.json();
        const users = userData.map(user => ({
            id: user.Id,
            name: user.firstName,
            surname: user.lastName
        }));

        setUsers(users);
    }

    /*const fetchUsers = () => {
        setUsers([
            { id: 1, name: 'John', surname: 'Doe' },
            { id: 2, name: 'Jane', surname: 'Doe' },
        ]);
    };*/

    
    
    



    var numberOfTeammates = 2;
    const addUser = (numberOfTeammates < 4 ?
            (
                <div>
                <Title order={2} pb={30}>Dodaj członków do zespołu.</Title>
            <form onSubmit={form.onSubmit(() => {
            })}>
                <div style={{marginBottom: '16px'}}>
                    <Text pb={20}>Aby dodać członka, musi mieć on konto na portalu.</Text>
                    <TextInput
                        required
                        label="Dodaj adres email członka zespołu"
                        placeholder="hackaton@tu.kielce.pl"
                        value={form.values.invitation}
                        onChange={(event) => form.setFieldValue('invitation', event.currentTarget.value)}
                        error={form.errors.invitation && 'Podany adres jest nieprawid�owy'}
                        radius="md"
                    />
                </div>
                <Button type="submit" onClick={SendInvite}>Zaproś znajomego</Button>
            </form>
                </div>
    ) : (
        <Text>Zebrałeś cały zespół. Aby usunąć członka, musisz poprosić o jego opuszczenie. Może on opuścić zespół po zalogowaniu się na portal.</Text>
            )
)

    return (
        <Card withBorder radius="md" p="xl" m="md" className={classes.card}>
            {!hasTeam ? (
                <form onSubmit={form.onSubmit(() => {
                })}>
                    <Title order={2} pb={"30"}>Utwórz swój zespół!</Title>
                    <TextInput
                        label="Nazwa zespołu"
                        placeholder="Podaj nazwę zespołu"
                        value={form.values.TeamName}
                        onChange={(event) => form.setFieldValue('TeamName', event.currentTarget.value)}
                        required
                        style={{marginBottom: '16px'}}
                    />
                    <Textarea
                        label="Opis zespołu"
                        placeholder="Dodaj opis zespołu"
                        value={form.values.TeamDescription}
                        onChange={(event) => form.setFieldValue('TeamDescription', event.currentTarget.value)}
                        required
                        multiline
                        style={{ marginBottom: '16px' }}
                    />
                    <Button type="submit" onClick = {handleRegister}>Załóż zespół</Button>
                </form>

            ) : (
                <>
                    <Title order={2} pb={"30"}>Oto twój zespół!</Title>
                    <div style={{textAlign: "left"}}>
                    <Text style={{ marginBottom: '16px' }}>Nazwa zespołu: {teamName}</Text>
                    <Text style={{ marginBottom: '16px' }}>Opis zespołu: {teamDescription}</Text>
                        <Title order={3} pb={"30"}>Członkowie zespołu</Title>
                        <List style={{ marginBottom: '16px' }}>
                        {users.map((user) => (
                            <ListItem key={user.id}>
                                <Avatar style={{ marginRight: '8px' }}>{user.name.charAt(0)}</Avatar>
                                {user.name} {user.surname}
                            </ListItem>
                        ))}
                        </List>
                    </div>
                    <Flex
                        gap="xl"
                        justify="flex-start"
                        align="stretch"
                        direction="row"
                        wrap="wrap"
                    >
                        <div>
                    {addUser}
                        </div>
<div>
    <Title order={2} pb={30}>Dodaj plik PDF</Title>
            <Text pb={20} truncate={true}>Można dodać tylko jeden plik. Jeżeli został dodany, to zostanie nadpisany.</Text>
                <form onSubmit={form.onSubmit(() => {
                    })}>
                        <FileInput
                            accept=".pdf"
                            label="Dodaj wniosek"
                            onChange={handleFileChange}
                            placeholder="Dozwolone rodzaje plików: .pdf"
                        />
                        <Button type="submit" onClick = {handleSubmit}>Wyślij</Button>
                    </form>
</div>
                    </Flex>

                </>


            )}

        </Card>
    );
}

export default YourTeam;
