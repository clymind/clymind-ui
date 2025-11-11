/**
 * Main: React application entry point
 *
 * This file:
 * 1. Imports the root App component
 * 2. Loads Bootstrap CSS and JavaScript for styling and interactive components
 * 3. Loads custom global styles (index.css)
 * 4. Renders the App component into the DOM (#root element)
 *
 * React.StrictMode enables additional development checks and warnings.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";  // Bootstrap styling
import "bootstrap/dist/js/bootstrap.bundle.min.js";  // Bootstrap JavaScript (dropdowns, modals, etc)
import "./index.css";  // Custom global styles and CSS variables

/**
 * Find the root DOM element (#root) and mount the React application there
 * React.StrictMode helps identify potential problems during development
 */
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
