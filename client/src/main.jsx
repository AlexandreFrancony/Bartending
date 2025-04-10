import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx"; // <== doit correspondre au fichier exporté
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
