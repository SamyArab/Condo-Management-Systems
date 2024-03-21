import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import MaintenanceReservation from "../pages/maintenance-reservation/index";
import { BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom";

// Mock console.log for testing purposes
console.log = jest.fn();
const React = require("react");
const { render, screen, fireEvent } = require("@testing-library/react");
const MaintenanceReservation = require("../pages/maintenance-reservation/index");

test("renders correctly", () => {
    render(<MaintenanceReservation />);

    // Check if the title is rendered
    const title = screen.getByText(/Maintenance Reservations/i);
    expect(title).toBeInTheDocument();

    // Check if the "Change Day" button is rendered
    const changeDayButton = screen.getByRole("button", { name: /Change Day/i });
    expect(changeDayButton).toBeInTheDocument();

    // Check if the reservation cards are rendered
    const reservationCards = screen.getAllByRole("article");
    expect(reservationCards.length).toBe(2); // Assuming two reservations are rendered

    // Check if each reservation card contains necessary information
    reservationCards.forEach((card, index) => {
        const reservationName = screen.getByText(/Rooftop Deck/i);
        expect(reservationName).toBeInTheDocument();

        const reserveButton = screen.getByRole("button", { name: /Reserve/i });
        expect(reserveButton).toBeInTheDocument();
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


