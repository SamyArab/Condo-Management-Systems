import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Login from './components/login';
import Profile from './components/profile';
import SignUp from "./components/signup";
import ReservationPage from './components/reservation';
import FormReservation from "./components/form-reservation";
import MyReservations from "./components/my-reservations";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/reservation" element={<ReservationPage />} />
                <Route path="/profile" element={<Layout><Profile /></Layout>} />
                <Route path="/form-reservation" element={<FormReservation />} />
                <Route path="/my-reservations" element={<MyReservations/>}/>
                <Route path="*" element={<div>You lost?</div>} />
            </Routes>
        </BrowserRouter>
    );

}

export default App;


