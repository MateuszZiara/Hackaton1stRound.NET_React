import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {
    BrowserRouter,
    Routes,
    Route, Navigate,
} from 'react-router-dom';
import { MantineProvider, createTheme } from '@mantine/core';
import Auth from './pages/Auth/Auth.tsx';
import {Err404} from "@/pages/404/Err404.tsx";
import {MainPage} from "@/components/PanelComponents/Both/MainPage/MainPage.tsx";
import RequestsPage from "@/pages/Requests/RequestsPage.tsx";
import UsersPage from "@/pages/Users/UsersPage.tsx";
import TeamsPage from "@/pages/TeamsPage/TeamsPage.tsx";
import SettingsPage from "@/pages/SettingsPage/SettingsPage.tsx";
import PaymentPage from "@/pages/PaymentPage/PaymentPage.tsx";
import YourTeamPage from "@/pages/YourTeamPage/YourTeamPage.tsx";
import HomePage from "@/pages/HomePage/HomePage.tsx";
import Home from "@/pages/Index/Home.tsx";
import {ModalsProvider} from "@mantine/modals";
import Checkout from "@/pages/Checkout/Checkout.jsx";


// Tworzenie motywu Mantine
const theme = createTheme({

    primaryColor: 'red',
    focusRing: 'always',
    defaultRadius: 'md',
    defaultGradient: {from: 'red', to: 'pink', deg: 45}
});
// Routing
ReactDOM.createRoot(document.getElementById('root')).render(
    <MantineProvider theme={theme} defaultColorScheme="auto">
        <ModalsProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="*" element={<Navigate to="/404" />} />
                    <Route path="/404" element={<Err404 />} />

                    <Route path="/home" element={<HomePage />} />
                    <Route path="/" element={<Home />} />

                    <Route path="/pag" element={<Auth />} />

                    <Route path="/myteam" element={<YourTeamPage />} />
                    <Route path="/payment" element={<PaymentPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/checkout" element={<Checkout />} />

                    <Route path="/teams" element={<TeamsPage />} />
                    <Route path="/users" element={<UsersPage />} />
                    <Route path="/requests" element={<RequestsPage />} />
                </Routes>
            </BrowserRouter>
        </ModalsProvider>
    </MantineProvider>
);
