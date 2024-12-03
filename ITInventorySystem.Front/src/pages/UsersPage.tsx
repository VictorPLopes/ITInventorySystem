import { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css';
import { UserTable } from '../components/UserTable';
import { UserModal } from '../components/UserModal';

interface User {
    id: number;
    name: string;
    email: string;
    type: number;
    status: boolean;
    createdAt: string;
    updatedAt: string | null;
}

function UsersPage({ port }: { port: string }) {
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [isModalOpen, setModalOpen] = useState<boolean>(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`https://localhost:${port}/GetAllUsers`);
            if (response.status === 200) {
                setUsers(response.data);
            }
        } catch (err) {
            setError('Erro ao buscar os usuários. Tente novamente mais tarde.');
        } finally {
            setLoading(false);
        }
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
                    <UserTable users={users} />
                )}
            </div>

            {isModalOpen && (
                <UserModal
                    port={port}
                    closeModal={() => setModalOpen(false)}
                    onUserRegistered={fetchUsers}
                />
            )}
        </div>
    );
}

export default UsersPage;
