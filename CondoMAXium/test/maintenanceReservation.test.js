import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import MaintenanceReservation from "../pages/maintenance-reservation/index";
import "@testing-library/jest-dom";


// Mock useRouter and useNavigate
jest.mock('next/router', () => ({
    useRouter: jest.fn()
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn() // Mock useNavigate
}));

// Mock console.log
console.log = jest.fn(); // Mock console.log

// Cleanup mocks after each test
afterEach(() => {
    jest.clearAllMocks();
});

test("renders correctly", () => {
    render(<MaintenanceReservation />);

    // Check if the title is rendered
    const title = screen.getByText(/Maintenance Reservations/i);
    expect(title).toBeInTheDocument();

    // Check if the "Change Day" button is rendered
    const changeDayButton = screen.getByRole("button", { name: /Change Day/i });
    expect(changeDayButton).toBeInTheDocument();
});


test("renders correctly 2", () => {
    render(<MaintenanceReservation />);
    // Check if the reservation cards are rendered
    const reservationCards = screen.getAllByTestId("reservation-card");
    expect(reservationCards.length).toBe(2); // Assuming two reservations are rendered

    // Check if each reservation card contains necessary information
    reservationCards.forEach((card, index) => {
        const reservationName = screen.getByText(`Maintenance ${index + 1}`); // Assuming "Maintenance 1", "Maintenance 2", etc.
        expect(reservationName).toBeInTheDocument();
        expect(screen.getByText(`Description of reservation ${index + 1}`)).toBeInTheDocument(); // Check reservation description

        // Check if the reserve button is rendered correctly within each card
        const reserveButtons = screen.getAllByRole("button", { name: /Reserve/i });
        expect(reserveButtons.length).toBe(2); // Assuming only one reserve button is rendered within each card

    });
});



test("handles date change", () => {
    render(<MaintenanceReservation />);

    // Click the "Change Day" button
    const changeDayButton = screen.getByRole("button", { name: /Change Day/i });
    fireEvent.click(changeDayButton);

    // Check if console.log is called with the correct message
    expect(console.log).toHaveBeenCalledWith("Change Date button clicked");
});


test('toggles drawer visibility', () => {
    render(<MaintenanceReservation />);

    // Find the button to close the drawer
    const chevronLeftIcon = screen.getByRole('button', { name: /close drawer/i });
    expect(chevronLeftIcon).toBeInTheDocument(); // Ensure the close drawer button is found

    // Click to close the drawer
    fireEvent.click(chevronLeftIcon);

    // Find the button to open the drawer
    const menuButton = screen.getByRole('button', { name: /open drawer/i });
    expect(menuButton).toBeInTheDocument(); // Ensure the open drawer button is found

    // Click to open the drawer
    fireEvent.click(menuButton);
    expect(screen.getByRole('button', { name: /close drawer/i })).toBeInTheDocument(); // Ensure the drawer is opened

});

test("handles reservation", () => {
    render(<MaintenanceReservation />);
    const reserveButtons = screen.getAllByRole("button", { name: /Reserve/i });
    reserveButtons.forEach(button => {
        fireEvent.click(button);
    });
});

