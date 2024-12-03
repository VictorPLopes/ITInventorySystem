import React, { useState } from 'react';
import axios from 'axios';

interface UserModalProps {
    port: string;
    closeModal: () => void;
    onUserRegistered: () => void;
}

export const UserModal: React.FC<UserModalProps> = ({ port, closeModal, onUserRegistered }) => {
    const [newUser, setNewUser] = useState({ name: '', email: '', password: '', type: 0 });
    const [registrationError, setRegistrationError] = useState<string>('');
    const [registerLoading, setRegisterLoading] = useState<boolean>(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setRegisterLoading(true);
        setRegistrationError('');

        try {
            const response = await axios.post(`https://localhost:${port}/CreateUser`, newUser);
            if (response.status === 201) {
                onUserRegistered(); // Refresh users list
                closeModal(); // Close modal
                setNewUser({ name: '', email: '', password: '', type: 0 }); // Reset form
            }
        } catch (err) {
            setRegistrationError('Erro ao registrar o usuário. Verifique os dados e tente novamente.');
        } finally {
            setRegisterLoading(false);
        }
    };

    return (
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
                            onChange={(e) =>
                                setNewUser({ ...newUser, type: parseInt(e.target.value, 10) })
                            }
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
                        <button type="button" onClick={closeModal}>
                            Cancelar
                        </button>
                    </div>
                </form>
                {registrationError && <p className="error-message">{registrationError}</p>}
            </div>
        </div>
    );
};
