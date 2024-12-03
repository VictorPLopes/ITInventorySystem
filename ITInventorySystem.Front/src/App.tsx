// src/App.tsx
import {Route, Routes} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import Dashboard from './pages/DashboardPage';
// import RegisterPage from './pages/register';
import UsersPage from './pages/UsersPage';

function App() {
    let port: string = "44307"
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
