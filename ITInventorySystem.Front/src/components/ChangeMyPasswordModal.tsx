import JwtUser from "../types/JwtUser.tsx";
import React, {useState} from "react";
import axios from "axios";
import {Button, Form, Modal} from "react-bootstrap";

interface ChangePasswordModalProps {
    show: boolean;
    onChangePassword: () => void;
    onCancel: () => void;
    loggedUser: JwtUser | null;
    port: string;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
                                                                     show,
                                                                     onChangePassword,
                                                                     onCancel,
                                                                     loggedUser,
                                                                     port,
                                                                 }) => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [error, setError] = useState("");

    const handleChangePassword = async () => {
        if (!loggedUser) return;

        try {
            const endpoint = `https://localhost:${port}/users/${loggedUser.nameid}/update-my-password`;
            await axios.post(endpoint, { oldPassword, newPassword });
            onChangePassword();
        } catch (err) {
            setError("Erro ao alterar a senha. Verifique as credenciais e tente novamente.");
        }
    };

    return (
        <Modal show={show} onHide={onCancel}>
            <Modal.Header closeButton>
                <Modal.Title>Alterar Senha</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="oldPassword">
                        <Form.Label>Senha Atual</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Digite sua senha atual"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="newPassword" className="mt-3">
                        <Form.Label>Nova Senha</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Digite a nova senha"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </Form.Group>
                    {error && <p className="text-danger mt-2">{error}</p>}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onCancel}>
                    Cancelar
                </Button>
                <Button variant="primary" onClick={handleChangePassword}>
                    Alterar Senha e Sair
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ChangePasswordModal;
