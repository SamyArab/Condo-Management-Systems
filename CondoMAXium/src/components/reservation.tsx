import React, { useState, forwardRef } from 'react';
import DatePicker, { ReactDatePickerProps } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, isBefore, startOfDay, addMonths } from 'date-fns';
import "./reservationCss.css";
import { FaCalendarAlt } from 'react-icons/fa';

// Define the facility type
type Facility = {
    id: number;
    title: string;
    description: string;
    capacity: number;
    hours: string;
    available: boolean;
};

// Example facilities data
const facilities: Facility[] = [
    {
        id: 1,
        title: 'Rooftop Deck',
        description: 'Beautiful rooftop deck with decorated lights...',
        capacity: 30,
        hours: '18:00 - 23:00',
        available: true,
    },
    // Add other facilities as needed
];


// Define props for the custom input component
interface CustomInputProps {
    value?: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

// Create the custom input component
const CustomInput = forwardRef<HTMLButtonElement, CustomInputProps>(
    ({ value, onClick }, ref) => (
        <button className="date-picker-button" onClick={onClick} ref={ref}>
            {value} <FaCalendarAlt />
        </button>
    ),
);

const ReservationPage: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());

    const handleDateChange = (date: Date) => {
        setSelectedDate(date);
    };

    const handleReserveClick = (facilityId: number) => {
        console.log(`Reserve facility with ID: ${facilityId} on ${format(selectedDate, 'PPPP')}`);
        // Implement reservation logic here
    };

    const isDateInPast = isBefore(selectedDate, startOfDay(new Date()));
    const isDateMoreThanTwoMonthsAhead = isBefore(addMonths(startOfDay(new Date()), 2), selectedDate);


    // Format the date in "Thursday, February 29th, 2024" format
    const formattedDate = format(selectedDate, 'PPPP');

    return (
        <div className="reservation-page">
            <div className="sidebar">
                <button className="view-reservations-btn">View Reservations</button>
            </div>
            <div className="main-content">
                <div className="header"><h2 className="common-facilities-title">Common Facilities / Reservations</h2></div>
                <div className="calendar-header">
                    <h3 className="formattedDate">{formattedDate}</h3>
                    <DatePicker
                        selected={selectedDate}
                        onChange={handleDateChange}
                        customInput={<CustomInput value={formattedDate}/>}
                        withPortal
                    />
                </div>
                <div className="facilities-list">
                    {facilities.map((facility) => (
                        <div
                            key={facility.id}
                            className={`facility-card ${isDateInPast || isDateMoreThanTwoMonthsAhead ? 'dimmed' : ''}`}
                        >
                            <h3>{facility.title}</h3>
                            <p>{facility.description}</p>
                            <p>Capacity: {facility.capacity} people</p>
                            <p>Hours: {facility.hours}</p>
                            <p>Available: {facility.available ? 'Yes' : 'No'}</p>
                            {isDateInPast || isDateMoreThanTwoMonthsAhead ? (
                                <div
                                    className="reserved-overlay">{isDateInPast ? 'Reserved' : 'Cannot Book At This Time'}</div>
                            ) : null}
                            <button
                                disabled={!facility.available || isDateInPast || isDateMoreThanTwoMonthsAhead}
                                onClick={() => handleReserveClick(facility.id)}
                            >
                                {facility.available && !isDateInPast && !isDateMoreThanTwoMonthsAhead ? 'Reserve' : 'Unavailable'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ReservationPage;
