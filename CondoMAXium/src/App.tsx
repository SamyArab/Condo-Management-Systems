import { Navigate, useLocation } from 'react-router-dom';
import supabase from "./config/supabaseClient"; // Import your Supabase client
import React from 'react';
import { Route } from 'react-router-dom';
import { Routes } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import Layout from './Layout';
import Login from './components/login';
import Profile from './components/profile';
import SignUp from "./components/signup";
import CMCUnits from './components/CMCUnits';
import Dashboard from "./components/dashboard"
import Addproperty from "./components/addproperty"

import { useState, useEffect } from "react";

interface AuthWrapperProps {
    children: React.ReactNode;
}

function AuthWrapper(props: AuthWrapperProps) {
    const { children } = props;
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const location = useLocation();

    useEffect(() => {
        checkAuth().then(isAuth => setIsAuthenticated(isAuth));
    }, []);

    async function checkAuth() {
        const { data: { user } } = await supabase.auth.getUser();
        return user ? true : false;
    }

    return isAuthenticated ? children : <Navigate to="/profile" state={{ from: location }} />;
}


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/profile" element={<AuthWrapper><Layout><Profile /></Layout></AuthWrapper>} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/addproperty" element={<Layout><Addproperty /></Layout>} />
                <Route path="/CMCUnits" element={<Layout><CMCUnits /></Layout>} />
                <Route path="*" element={<div>You lost?</div>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;





// import React from 'react';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Layout from './Layout';
// import Login from './components/login';
// import Profile from './components/profile';
// import SignUp from "./components/signup";

// function App() {
//     return (
//         <BrowserRouter>
//             <Routes>
//                 <Route path="/" element={<Login />} />
//                 <Route path="/signup" element={<SignUp />} />
//                 <Route path="/profile" element={<Layout><Profile /></Layout>} />
//                 <Route path="*" element={<div>You lost?</div>} />
//             </Routes>
//         </BrowserRouter>
//     );

// }

// export default App;


