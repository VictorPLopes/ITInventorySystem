// src/App.tsx
import {Route, Routes} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import Dashboard from './pages/DashboardPage';
import UsersPage from './pages/UsersPage';
import {useEffect} from "react";
import './App.css';

function App() {
    let port: string = "44307"
    useEffect(() => {
        // Definindo o tema dark no carregamento da aplicação
        document.documentElement.setAttribute('data-bs-theme', 'dark');
    }, []);
    return (
        <div className="App">
            <Routes>
                {/* Definindo a rota para a página de login */}
                <Route path="/login" element={<LoginPage port={port}/>}/>
                <Route path="/home" element={<HomePage/>}/>
                <Route path="/dashboard" element={<Dashboard/>}/>
                <Route path="/users" element={<UsersPage port={port}/>}/>
            </Routes>
        </div>
    );
}

export default App;
