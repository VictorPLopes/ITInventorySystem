import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import '../App.css'; // Importa o arquivo CSS

interface User {
  id: number;
  name: string;
  email: string;
  type: number;
}

function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://localhost:7174/GetAllUsers');
        if (response.status === 200) {
          setUsers(response.data); // Assumindo que a resposta é um array de usuários
        }
      } catch (err) {
        if (err instanceof AxiosError) {
          setError('Erro ao buscar os usuários. Tente novamente mais tarde.');
        } else {
          setError('Ocorreu um erro inesperado. Tente novamente mais tarde.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="users-container">
      <div className="users-box">
        <h2 className="users-title">Usuários Registrados</h2>
        {loading ? (
          <p>Carregando...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Tipo</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.type === 1 ? 'Usuário' : 'Administrador'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default UsersPage;
