/**
 * App: Root component that sets up routing for the entire application
 *
 * Routes:
 * - "/" → Home page (startup grid + leaderboards)
 * - "/startup/:id" → Individual startup detail page
 *
 * Uses React Router v6 for client-side routing without page reloads.
 * The BrowserRouter provides the routing context for all child components.
 */

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import StartupPage from "./pages/startup";

/**
 * App component: Main entry point for application routing
 *
 * @returns JSX with BrowserRouter setup and two main routes
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main page: all startups grid and leaderboards */}
        <Route path="/" element={<Home />}/>
        
        {/* Startup detail page: specific startup metrics and stats */}
        <Route path="/startup/:id" element={<StartupPage />}/>
      </Routes>
    </BrowserRouter>
  );
}
