import Login from "./components/login";
import Profile from "./components/profile.tsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} > </Route>
                <Route path="profile" element={<Profile />} > </Route>
                <Route path="*" element={<div>You lost?</div>} > </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;

