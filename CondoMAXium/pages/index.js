import { Login } from "@mui/icons-material";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./_app";
import SignUpSide from "./login";

//removed index.css, REMEMBER to import new style from boostrap or equivalent in here
//import './index.css'

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

export default function Home() {
  return <SignUpSide></SignUpSide>;
}
