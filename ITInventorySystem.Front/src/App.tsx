// src/App.tsx
import {Route, Routes} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
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
                <Route path="*" element={<LoginPage port={port}/>}/>
                {/*<Route path="/login" element={<LoginPage port={port}/>}/>*/}
                <Route path="/dashboard" element={<Dashboard port={port}/>}/>
                <Route path="/users" element={<UsersPage port={port}/>}/>
                {/*<Route path="/clients" element={<ClientsPage port={port}/>}/>
                <Route path="/inventory" element={<InventoryPage port={port}/>}/>
                <Route path="/work-orders" element={<WorkOrdersPage port={port}/>}/>*/}

            </Routes>
        </div>
    );
}

export default App;
