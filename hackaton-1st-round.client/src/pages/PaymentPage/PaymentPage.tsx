import { Flex } from "@mantine/core";
import { Navbar } from "../../layouts/Navbar/Navbar";
import YourTeam from "../../components/PanelComponents/User/YourTeam/YourTeam";
import {Payment} from "../../components/PanelComponents/User/Payment/Payment";
import React, { useState, useEffect } from 'react';
import {
    Button,
    Text,
    Card,
    Title,
    Radio,
    Group,
    Alert, rem
} from '@mantine/core';

export default function PaymentPage() {
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
                <Payment/>
            </div>
        </Flex>
    );
}
