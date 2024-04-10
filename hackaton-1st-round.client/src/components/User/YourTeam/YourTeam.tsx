import React, { useState, useEffect } from 'react';
import {TextInput, Button, Paper, Text, List, ListItem, Avatar, Modal} from '@mantine/core';
import { useForm } from '@mantine/form';
import {checkUserLoggedIn, gethasTeam} from "../../../features/getCookies/getCookies";
import {Await} from "react-router";
import {useDisclosure} from "@mantine/hooks";


export function YourTeam() {
    const [hasTeam, setHasTeam] = useState(false);
    const [teamName, setTeamName] = useState('');
    const [teamDescription, setTeamDescription] = useState('');
    const [users, setUsers] = useState([]);
    const [opened, { open, close }] = useDisclosure(false);
    const form = useForm({
        initialValues: {
            TeamName: '',
            TeamDescription: '',
        },}
    )
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
                }
                else
                {
                    setHasTeam(true);
                }
            } catch (error) {
                console.error('Error checking user login status:', error);
            }
        };
        const update = async () =>
        {
            try {
                const hasTeam = await gethasTeam();
                if(hasTeam) {
                    fetchTeamDetails();
                    fetchUsers();
                }
            }
            catch (error) {
                console.error('Error', error);
            }
        }
        update();
        checkIfHasTeam();
        fetchData();
        
        
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
        setTeamName(dataTeamDetails.teamName);
        setTeamDescription(dataTeamDetails.teamDesc);
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

    

    return (
        <Paper padding="md" style={{ maxWidth: 600, margin: 'auto' }}>
            {!hasTeam ? (
                <form onSubmit={form.onSubmit(() => { })}>
                    <TextInput
                        label="Team Name"
                        placeholder="Enter team name"
                        value={form.values.TeamName}
                        onChange={(event) => form.setFieldValue('TeamName', event.currentTarget.value)}
                        required
                        style={{ marginBottom: '16px' }}
                    />
                    <TextInput
                        label="Team Description"
                        placeholder="Enter team description"
                        value={form.values.TeamDescription}
                        onChange={(event) => form.setFieldValue('TeamDescription', event.currentTarget.value)}
                        required
                        multiline
                        style={{ marginBottom: '16px' }}
                    />
                    <Button type="submit" onClick = {handleRegister}>Send</Button>           
                </form>

            ) : (
                <>
                    <Text style={{ marginBottom: '16px' }}>Team Name: {teamName}</Text>
                    <Text style={{ marginBottom: '16px' }}>Team Description: {teamDescription}</Text>
                    <List style={{ marginBottom: '16px' }}>
                        {users.map((user) => (
                            <ListItem key={user.id}>
                                <Avatar style={{ marginRight: '8px' }}>{user.name.charAt(0)}</Avatar>
                                {user.name} {user.surname}
                            </ListItem>
                        ))}
                    </List>
                </>
                
                
            )}
            
        </Paper>
    );
}

export default YourTeam;
