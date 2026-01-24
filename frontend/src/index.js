import React from "react";
import ReactDOM from "react-dom/client";
import "@/index.css";
import App from "@/App";
import { initMicrosoftClarity } from "@/lib/analytics";

const root = ReactDOM.createRoot(document.getElementById("root"));
initMicrosoftClarity();
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
