import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import '../App.css'; // Importa o arquivo CSS

function RegisterPage() {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [type, setType] = useState<number>(0); // Tipo numérico (ex: 2 para administrador, 1 para usuário comum)
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Fazendo a requisição para o endpoint de registro
      const response = await axios.post(
        'https://localhost:7174/CreateUser',
        {
          name,
          email,
          password,
          type, 
        },
        {
          headers: {
            'Content-Type': 'application/json', 
          },
        }
      );

      if (response.status === 201) {
        navigate('/login');
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        setError('Erro ao registrar. Verifique os dados e tente novamente.');
      } else {
        setError('Ocorreu um erro inesperado. Tente novamente mais tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2 className="register-title">Crie sua Conta</h2>
        <form onSubmit={handleRegister}>
          <div className="input-field">
            <label htmlFor="name">Nome</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite seu nome"
              required
            />
          </div>

          <div className="input-field">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu e-mail"
              required
            />
          </div>

          <div className="input-field">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              required
            />
          </div>

          <div className="input-field">
            <label htmlFor="type">Tipo</label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(Number(e.target.value))}
              required
            >
              <option value="">Selecione o tipo</option>
              <option value={0}>0</option>
              <option value={1}>1</option>
              <option value={2}>2</option>
            </select>
          </div>

          <div className="btn-container">
            <button type="submit" disabled={loading}>
              {loading ? 'Carregando...' : 'Registrar'}
            </button>
          </div>

          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
