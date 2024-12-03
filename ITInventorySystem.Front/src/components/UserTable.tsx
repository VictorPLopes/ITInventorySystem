import React from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    type: number;
    status: boolean;
    createdAt: string;
    updatedAt: string | null;
}

interface UserTableProps {
    users: User[];
}

export const UserTable: React.FC<UserTableProps> = ({ users }) => {
    const formatDateTime = (dateTime: string | null): string => {
        if (!dateTime) return '-';
        const date = new Date(dateTime);
        return date.toLocaleString();
    };

    return (
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
    );
};
