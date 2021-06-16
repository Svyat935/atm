import React, {useState, useEffect} from 'react';
import './App.css';
import {useRoutes} from "./routes"
import {BrowserRouter as Router} from "react-router-dom";
import {AuthContext} from "./pages/auth/AuthContext";
import {useAuth} from "./hooks/auth.hook";

function App() {
    const {login, logout, token, userRights} = useAuth();
    const routes = useRoutes(userRights);

    return (
        <AuthContext.Provider value={{token, userRights, login, logout}}>
            <Router>
                {routes}
            </Router>
        </AuthContext.Provider>
    );
}

export default App;