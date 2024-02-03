import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

//removed index.css, REMEMBER to import new style from boostrap or equivalent in here
//import './index.css'

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
