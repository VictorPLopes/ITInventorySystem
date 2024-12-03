import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import '../App.css'; // Importa o arquivo CSS

interface User {
  id: number;
  name: string;
  email: string;
  type: number;
  status: boolean;
  createdAt: string;
  updatedAt: string | null;
}

function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', type: 0 });
  const [registrationError, setRegistrationError] = useState<string>('');
  const [registerLoading, setRegisterLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://localhost:7174/GetAllUsers');
      if (response.status === 200) {
        setUsers(response.data);
      }
    } catch (err) {
      setError('Erro ao buscar os usuários. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterLoading(true);
    setRegistrationError('');

    try {
      const response = await axios.post('https://localhost:7174/CreateUser', newUser);
      if (response.status === 201) {
        fetchUsers(); // Atualiza a lista de usuários após o registro
        setModalOpen(false); // Fecha o modal
        setNewUser({ name: '', email: '', password: '', type: 0 }); // Limpa o formulário
      }
    } catch (err) {
      setRegistrationError('Erro ao registrar o usuário. Verifique os dados e tente novamente.');
    } finally {
      setRegisterLoading(false);
    }
  };

  const formatDateTime = (dateTime: string | null): string => {
    if (!dateTime) return '-';
    const date = new Date(dateTime);
    return date.toLocaleString();
  };

  return (
    <div className="users-container">
      <div className="users-box">
        <h2 className="users-title">Usuários Registrados</h2>
        <button className="add-user-button" onClick={() => setModalOpen(true)}>
          + Novo Usuário
        </button>
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
                <th>Status</th>
                <th>Criado em</th>
                <th>Atualizado em</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.type === 0 ? 'Usuário' : 'Administrador'}</td>
                  <td>{user.status ? 'Ativo' : 'Inativo'}</td>
                  <td>{formatDateTime(user.createdAt)}</td>
                  <td>{formatDateTime(user.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Registrar Novo Usuário</h2>
            <form onSubmit={handleRegister}>
              <div className="input-field">
                <label htmlFor="name">Nome</label>
                <input
                  type="text"
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  required
                />
              </div>
              <div className="input-field">
                <label htmlFor="email">E-mail</label>
                <input
                  type="email"
                  id="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  required
                />
              </div>
              <div className="input-field">
                <label htmlFor="password">Senha</label>
                <input
                  type="password"
                  id="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  required
                />
              </div>
              <div className="input-field">
                <label htmlFor="type">Tipo</label>
                <select
                  id="type"
                  value={newUser.type}
                  onChange={(e) => setNewUser({ ...newUser, type: parseInt(e.target.value, 10) })}
                >
                  <option value={0}>0</option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                </select>
              </div>
              <div className="btn-container">
                <button type="submit" disabled={registerLoading}>
                  {registerLoading ? 'Registrando...' : 'Registrar'}
                </button>
                <button type="button" onClick={() => setModalOpen(false)}>
                  Cancelar
                </button>
              </div>
            </form>
            {registrationError && <p className="error-message">{registrationError}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export default UsersPage;
