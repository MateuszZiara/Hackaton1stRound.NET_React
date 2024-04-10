import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {
    BrowserRouter,
    Routes,
    Route,
} from 'react-router-dom';
import { MantineProvider, createTheme } from '@mantine/core';
import Auth from './pages/Auth/Auth.tsx';
import Home from './pages/Index/Home.tsx';
import MainPage from './pages/Temp/MainPage.tsx';
import BuyFlower from './pages/BuyFlower/BuyFlower.tsx';
import {Err404} from "@/pages/404/Err404.tsx";
import Panel from "@/pages/UserPanel/Panel.tsx";

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
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/pag" element={<Auth />} />
                <Route path="/main" element={<MainPage />} />
                <Route path="/buyflower" element={<BuyFlower />} />
                <Route path="/404" element={<Err404 />} />
                <Route path="/panel" element={<Panel />} />
            </Routes>
        </BrowserRouter>
    </MantineProvider>
);
