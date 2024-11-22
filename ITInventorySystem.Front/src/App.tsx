// src/App.tsx
import { Route, Routes } from 'react-router-dom';
import LoginPage from './components/Login';  // Certifique-se de que o caminho está correto!
import HomePage from './components/home';  // Certifique-se de que o caminho está correto!

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Definindo a rota para a página de login */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </div>
  );
}

export default App;
