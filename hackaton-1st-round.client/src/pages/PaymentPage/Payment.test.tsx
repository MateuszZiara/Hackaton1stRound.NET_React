import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { Payment } from "../../components/PanelComponents/User/Payment/Payment";
import { checkUserLoggedIn } from '../../features/getCookies/getCookies'; // Assuming this is properly mocked
import { MantineProvider } from '@mantine/core'; // Import MantineProvider from @mantine/core
import { render as testingLibraryRender } from '@testing-library/react';
jest.mock('../../features/getCookies/getCookies', () => ({
    checkUserLoggedIn: jest.fn(),
}));

// Mock MantineProvider for testing purposes
jest.mock('@mantine/core', () => ({
    MantineProvider: ({ children }) => <>{children}</>, // Simple mock component
}));
describe('Payment Component Tests', () => {
    beforeEach(() => {
        // Mock API responses or setup initial conditions as needed
        checkUserLoggedIn.mockResolvedValue(true); // Mocking logged in user
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({ cash: 100 }), // Mocking fetch response
            })
        );
    });

    test('renders Payment component', async () => {
        await act(async () => {
            render(
                <MantineProvider>
                    <Payment />
                </MantineProvider>
            );
        });

        // Wait for the component to load and assert if certain elements are present
        expect(screen.getByText(/Płatność/i)).toBeInTheDocument();
        expect(screen.getByText(/Podsumowanie zamówienia/i)).toBeInTheDocument();

        // You can add more specific assertions based on your UI structure
    });

    test('fetches user cash on component mount', async () => {
        await act(async () => {
            render(
                <MantineProvider>
                    <Payment />
                </MantineProvider>
            );
        });

        // Wait for the fetch call to complete and assert if the price is updated
        await waitFor(() => expect(screen.getByText(/Do zapłaty:/i)).toHaveTextContent('100 zł'));
    });

    test('handles user not logged in', async () => {
        checkUserLoggedIn.mockResolvedValueOnce(false); // Mocking not logged in user

        await act(async () => {
            render(
                <MantineProvider>
                    <Payment />
                </MantineProvider>
            );
        });

        // Verify if the user is redirected to /404 when not logged in
        await waitFor(() => expect(window.location.href).toBe('/404'));
    });

    test('simulates PayPal payment button click', async () => {
        await act(async () => {
            render(
                <MantineProvider>
                    <Payment />
                </MantineProvider>
            );
        });

        // Mock PayPalScriptProvider and simulate button click
        const paypalButton = screen.getByRole('button', { name: /PayPal/i });
        fireEvent.click(paypalButton);

        // Verify if PayPal checkout button is rendered
        expect(screen.getByRole('button', { name: /PayPal Checkout/i })).toBeInTheDocument();
    });

    test('simulates traditional payment button click', async () => {
        await act(async () => {
            render(
                <MantineProvider>
                    <Payment />
                </MantineProvider>
            );
        });

        // Simulate click on traditional payment button
        const traditionalButton = screen.getByRole('button', { name: /Płatność przelewem tradycyjnym/i });
        fireEvent.click(traditionalButton);

        // Add assertions related to traditional payment method
        // For example, check if it triggers a modal or additional UI elements
        expect(screen.getByText(/Wybierz metodę płatności/i)).toBeInTheDocument();
    });
    test('simulates PayPal payment button click', async () => {
        await act(async () => {
            render(
                <MantineProvider>
                    <Payment />
                </MantineProvider>
            );
        });

        // Wait for state updates to complete
        await waitFor(() => {
            expect(screen.getByText(/Płatność/i)).toBeInTheDocument(); // Example assertion
        });

        // Simulate PayPal button click
        const paypalButton = screen.getByRole('button', { name: /PayPal/i });
        fireEvent.click(paypalButton);

        // Ensure that PayPal Checkout button is rendered after click
        await waitFor(() => {
            expect(screen.getByRole('button', { name: /PayPal Checkout/i })).toBeInTheDocument();
        });
    });
});
