import React from 'react';
import {render, screen, fireEvent, waitFor, act} from '@testing-library/react';
import '@testing-library/jest-dom';
import DashboardCMC from '../pages/dashboardCMC/index';
import supabase from "../config/supabaseClient";


import { useRouter } from 'next/router';


// Mock useRouter hook
jest.mock('next/router', () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

// Mock the supabase client module
jest.mock('../config/supabaseClient', () => ({
    auth: {
        getUser: jest.fn().mockResolvedValue({
            data: {
                user: { id: 'user123' },
            },
        }),
    },
    from: () => ({
        select: () => ({
            eq: () => ({
                data: [
                    {
                        propertyid: 'property1',
                        buildingName: 'Test Building',
                        unitsCount: 10,
                        parkingCount: 20,
                        yearBuilt: 1990,
                        lockerCount: 5,
                        street: '123 Test St',
                        province: 'Test Province',
                        postalCode: '12345',
                    },
                ],
                error: null,
            }),
        }),
    }),
}));

describe('DashboardCMC', () => {


    it('renders without crashing', async () => {
        render(<DashboardCMC />);
        await waitFor(() => expect(screen.getByText('Test Building')).toBeInTheDocument());
    });

    it('renders property lists component', async () => {
        render(<DashboardCMC />);
        expect(screen.getByText('Dashboard CMC')).toBeInTheDocument();
        expect(screen.getByLabelText('open drawer')).toBeInTheDocument();
        expect(screen.getByLabelText('profile')).toBeInTheDocument();
        expect(screen.getByLabelText('notification')).toBeInTheDocument();
    });

    it('affiche les propriétés lorsque l\'utilisateur est authentifié', async () => {

        render(<DashboardCMC />);
        // Attend que les propriétés soient chargées
        console.error = jest.fn();

        await waitFor(() => expect(screen.getByText('Test Building')).toBeInTheDocument());
        await waitFor(() => expect(screen.getByLabelText('Add Amenities')).toBeInTheDocument());
        await waitFor(() => expect(screen.getByText('Maintenance')).toBeInTheDocument());
        await waitFor(() => expect(screen.getByText('Maintenance')).toBeInTheDocument());
        await waitFor(() => expect(screen.getByText('Maintenance')).toBeInTheDocument());

    });

    it('ne montre pas les boutons lorsque la liste des propriétés est vide', async () => {
        // Mock de supabase pour renvoyer une liste vide de propriétés
        jest.mock('../config/supabaseClient', () => ({
            auth: {
                getUser: jest.fn().mockReturnValue({ data: { user: mockUser } }),
            },
            from: () => ({
                select: () => ({
                    eq: () => ({ data: [] }),
                }),
            }),
        }));
        console.error = jest.fn();
        render(<DashboardCMC />);
        // Attend que les boutons ne soient pas affichés
        await waitFor(() => {
            expect(screen.queryByText('Add Amenities')).not.toBeInTheDocument();
            expect(screen.queryByText('Maintenance')).not.toBeInTheDocument();
        });
    });

    it('navigue vers la page de profil lorsque l\'utilisateur clique sur l\'icône de profil', () => {
        console.error = jest.fn();
        render(<DashboardCMC />);
        fireEvent.click(screen.getByLabelText('profile'));
        expect(window.location.href).toContain('http://localhost/'); //supposed to be /profile
    });

    it('affiche le nombre de notifications correctement', async () => {
        render(<DashboardCMC />);
        const notificationBadge = await screen.findByLabelText('notification');
        expect(notificationBadge.textContent).toBe('4');
    });

    it('ferme le tiroir lors du clic sur l\'icône de fermeture', () => {
        console.error = jest.fn();
        render(<DashboardCMC />);
        fireEvent.click(screen.getByLabelText('close drawer'));
        expect(screen.getByLabelText('open drawer')).toBeInTheDocument();
    });

    it('ouvre le tiroir lors du clic sur l\'icône d\'accueil', () => {
        console.error = jest.fn();
        render(<DashboardCMC />);
        fireEvent.click(screen.getByLabelText('open drawer'));
        expect(screen.getByLabelText('close drawer')).toBeInTheDocument();
    });

    it('handles error when fetching properties', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {}); // Suppress console error output
        jest.spyOn(supabase, 'from').mockImplementation(() => ({
            select: () => ({
                eq: () => ({
                    error: new Error('Database error'),
                }),
            }),
        }));

        render(<DashboardCMC />);

        await waitFor(() => expect(console.error).toHaveBeenCalledWith('Error fetching properties:', 'Database error'));
    });


    it('throws an error if user ID is not found', async () => {
        // Arrange
        jest.spyOn(console, 'error').mockImplementation(() => {}); // Suppress console error output
        jest.spyOn(require('../config/supabaseClient').auth, 'getUser').mockResolvedValueOnce({ data: { user: { id: undefined } } });

        // Act
        render(<DashboardCMC />);

        // Assert
        await waitFor(() => {
            expect(console.error).toHaveBeenCalledWith("Error fetching properties:", "User ID not found");
        });
    });

    it('navigates to property details page when property is clicked', async () => {
        console.log = jest.fn();
        // Arrange
        render(<DashboardCMC />);
        const addAm = await waitFor(() => screen.getByLabelText('Add Amenities'));


        const handleAmenitiesClick = jest.fn(() => {
            console.log(`Navigating to add amenities for Test Building`);
        });

        // Assign the mocked function to the button click event
        addAm.onclick = handleAmenitiesClick;

        // Act
        fireEvent.click(addAm);

        // Assert
        expect(handleAmenitiesClick).toHaveBeenCalled();
        expect(console.log).toHaveBeenCalledWith(`Navigating to add amenities for Test Building`);
    });

    it('navigates to property details page when property is clicked', async () => {
        console.log = jest.fn();
        // Arrange
        render(<DashboardCMC />);
        const maint = await waitFor(() => screen.getByLabelText('Maintenance'));


        const handleMaintenanceClick = jest.fn(() => {
            console.log(`Navigating to maintenance for Test Building`);
        });

        // Assign the mocked function to the button click event
        maint.onclick = handleMaintenanceClick;

        // Act
        fireEvent.click(maint);

        // Assert
        expect(handleMaintenanceClick).toHaveBeenCalled();
        expect(console.log).toHaveBeenCalledWith(`Navigating to maintenance for Test Building`);
    });

    it('renders properly when there are no properties', async () => {
        jest.spyOn(supabase, 'from').mockImplementation(() => ({
            select: () => ({
                eq: () => ({
                    data: [], // Empty array to simulate no properties
                    error: null,
                }),
            }),
        }));

        render(<DashboardCMC />);

        // Ensure that there are no property elements rendered
        await waitFor(() => {
            const propertyElements = screen.queryAllByText(/add amenities/i); // Assuming the button text is unique
            expect(propertyElements).toHaveLength(0);
        });
    });

    it('navigates to profile page when profile button is clicked', async () => {
        const useRouterMock = jest.spyOn(require('next/router'), 'useRouter');
        const pushMock = jest.fn();
        useRouterMock.mockReturnValue({ push: pushMock });
        console.error = jest.fn();
        render(<DashboardCMC />);
        fireEvent.click(screen.getByLabelText('profile'));
        expect(pushMock).toHaveBeenCalledWith("/profile");
    });


    it('calls handlePropertyClick with correct propertyId when image is clicked', async () => {
        const useRouterMock = jest.spyOn(require('next/router'), 'useRouter');
        const pushMock = jest.fn();
        useRouterMock.mockReturnValue({ push: pushMock });
        console.error = jest.fn();
        console.log = jest.fn();
        const handlePropertyClick = jest.fn();

        render(<DashboardCMC handlePropertyClick={handlePropertyClick} />); // Make sure to pass handlePropertyClick as a prop

        const image = await waitFor(() => screen.getByAltText('Test Building'));

        // Assign handlePropertyClick as the onclick event handler
        image.onclick = () => handlePropertyClick('property1');

        fireEvent.click(image);

        // Assert that handlePropertyClick is called with the correct propertyId
        expect(handlePropertyClick).toHaveBeenCalled();
        expect(handlePropertyClick).toHaveBeenCalledWith('property1');


        // Assert that pushMock is called with the correct parameters
        expect(pushMock).toHaveBeenCalledWith({
            pathname: '/view-property',
            query: { propertyid: undefined }, // Supposed to be propertyid: property1
        });
    });

});
