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

// Tworzenie motywu Mantine
const theme = createTheme({
    fontFamily: 'Open Sans, sans-serif',
    primaryColor: 'green',
    focusRing: 'always',
    defaultRadius: 'md',
    defaultGradient: {from: 'green', to: 'lime', deg: 45}
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
            </Routes>
        </BrowserRouter>
    </MantineProvider>
);
