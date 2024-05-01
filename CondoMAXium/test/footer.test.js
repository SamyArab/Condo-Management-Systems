import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../components/layout/Footer';
import '@testing-library/jest-dom';


describe('Footer', () => {
    test('renders without crashing', () => {
        render(<Footer />);
        const footerElement = screen.getByRole('contentinfo');
        expect(footerElement).toBeInTheDocument();
    });

    test('contains correct text', () => {
        render(<Footer />);
        expect(screen.getByText(/© 2024 CondoMAXium/i)).toBeInTheDocument();
    });

    test('has correct styling', () => {
        render(<Footer />);
        const footerElement = screen.getByRole('contentinfo');
        expect(footerElement).toHaveStyle({
            backgroundColor: 'white',
            padding: '40px',
            textAlign: 'center'
        });
    });
});
