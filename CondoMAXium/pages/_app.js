import { Navigate, useLocation } from "react-router-dom";
import supabase from "../config/supabaseClient"; // Import your Supabase client
import React from "react";
import { Route } from "react-router-dom";
import { Routes } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import Layout from "../components/layout/layout";
import SignInSide from "./login";
import Profile from "./profile";
import SignUp from "./signup";
import { useState, useEffect } from "react";

// function AuthWrapper(props) {
//   const { children } = props;
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const location = useLocation();

//   useEffect(() => {
//     checkAuth().then((isAuth) => setIsAuthenticated(isAuth));
//   }, []);

//   async function checkAuth() {
//     const {
//       data: { user },
//     } = await supabase.auth.getUser();
//     return user ? true : false;
//   }

//   return isAuthenticated ? (
//     children
//   ) : (
//     <Navigate to="/profile" state={{ from: location }} />
//   );
// }

// function App({ Component, pageProps }) {
//   return (
//     <>
//       <BrowserRouter>
//         <Routes>
//           <Route path="/" element={<SignInSide />} />
//           <Route path="/signup" element={<SignUp />} />
//           <Route
//             path="/profile"
//             element={
//               // <AuthWrapper>
//               <Layout>
//                 <Profile>
//                   <Component {...pageProps} />;
//                 </Profile>
//               </Layout>
//               // </AuthWrapper>
//             }
//           />
//           <Route path="*" element={<div>You lost?</div>} />
//         </Routes>
//       </BrowserRouter>
//     </>
//   );
// }

// export default App;

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
    </>
  );
}

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
