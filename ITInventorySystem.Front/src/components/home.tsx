import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <h1>Bem-vindo à Home Page!</h1>
      <p>Essa é a página inicial do sistema.</p>
      <div className="nav-links">
        <Link to="/login">Ir para o Login</Link>
        <br />
        <Link to="/dashboard">Ir para o Dashboard</Link>
      </div>
    </div>
  );
}

export default Home;
