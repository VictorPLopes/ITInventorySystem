import React, {useState} from 'react';
import {Button, Form, FormControl, FormGroup, FormLabel, Modal} from 'react-bootstrap';

interface UserPasswordUpdate {
    id: number;
    password: string;
}


interface ChangePasswordModalProps {
    show: boolean;
    onClose: () => void;
    onSave: (userId: number, newPassword: string) => void;
    user: Pick<UserPasswordUpdate, 'id'> | null;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({show, onClose, onSave, user}) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSave = () => {
        if (newPassword !== confirmPassword) {
            setError('As senhas não correspondem.');
            return;
        }
        setError('');
        if (user) {
            onSave(user.id, newPassword); // Envia o ID e a nova senha
        }
    };

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {user ? `Alterar Senha do Usuário #${user.id}` : 'Usuário não selecionado'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {user ? (
                    <Form>
                        <FormGroup className="mb-3">
                            <FormLabel>Nova Senha</FormLabel>
                            <FormControl
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Digite a nova senha"
                            />
                        </FormGroup>
                        <FormGroup className="mb-3">
                            <FormLabel>Confirmar Nova Senha</FormLabel>
                            <FormControl
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirme a nova senha"
                            />
                        </FormGroup>
                        {error && <p className="text-danger">{error}</p>}
                    </Form>
                ) : (
                    <p className="text-muted">Selecione um usuário para alterar a senha.</p>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cancelar
                </Button>
                <Button
                    variant="primary"
                    onClick={handleSave}
                    disabled={!newPassword || !confirmPassword || !user}
                >
                    Alterar Senha
                </Button>
            </Modal.Footer>
        </Modal>
    );
};