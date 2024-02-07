import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Login from './components/login';
import Profile from './components/profile';
import SignUp from "./components/signup";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/profile" element={<Layout><Profile /></Layout>} />
                <Route path="*" element={<div>You lost?</div>} />
            </Routes>
        </BrowserRouter>
    );

}

export default App;


