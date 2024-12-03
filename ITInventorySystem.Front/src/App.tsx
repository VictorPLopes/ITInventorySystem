// src/App.tsx
import { Route, Routes } from 'react-router-dom';
import LoginPage from './components/Login'; 
import HomePage from './components/home';  
import Dashboard from './components/dashboard';  
import RegisterPage from './components/register';
import UsersPage from './components/users';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Definindo a rota para a página de login */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<UsersPage />} />
      </Routes>
    </div>
  );
}

export default App;
