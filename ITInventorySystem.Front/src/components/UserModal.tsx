import React, { useState, useRef } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import User from '../types/User';

interface UserModalProps {
    show: boolean;
    onClose: () => void;
    onSave: (user: Partial<User>) => void;
    user: Partial<User>;
}

export const UserModal: React.FC<UserModalProps> = ({ show, onClose, onSave, user }) => {
    const [formData, setFormData] = useState<Partial<User>>(user);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(''); // For password mismatch errors
    const [validated, setValidated] = useState(false);

    const formRef = useRef<HTMLFormElement>(null); // To directly access the form element

    const isEdit = Boolean(user.id); // Determine if it's an edit action

    // Handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | any>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'type' ? parseInt(value, 10) : value,
        }));
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        const form = event.currentTarget;
        event.preventDefault(); // Prevent default behavior
        event.stopPropagation(); // Stop propagation

        if (!form.checkValidity()) {
            setValidated(true); // Trigger Bootstrap validation feedback
            return;
        }

        if (!isEdit && formData.password && formData.password !== confirmPassword) {
            setError('As senhas não correspondem. Tente novamente.');
            setValidated(true);
            return;
        }

        setError('');
        setValidated(true);
        onSave(formData); // Call the save handler
    };

    const handleSave = () => {
        if (formRef.current) {
            // Trigger form submission programmatically
            const event = new Event('submit', { bubbles: true, cancelable: true });
            formRef.current.dispatchEvent(event);
        }
    };

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>{isEdit ? 'Editar Usuário' : 'Novo Usuário'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form
                    noValidate
                    validated={validated}
                    onSubmit={handleSubmit}
                    ref={formRef} // Attach the form reference
                >
                    <Form.Group className="mb-3">
                        <Form.Label>Nome</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name || ''}
                            onChange={handleInputChange}
                            placeholder="Digite o nome"
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Por favor, insira um nome válido.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>E-mail</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={formData.email || ''}
                            onChange={handleInputChange}
                            placeholder="Digite o e-mail"
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Por favor, insira um e-mail válido.
                        </Form.Control.Feedback>
                    </Form.Group>
                    {!isEdit && (
                        <>
                            <Form.Group className="mb-3">
                                <Form.Label>Senha</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    value={formData.password || ''}
                                    onChange={handleInputChange}
                                    placeholder="Digite a senha"
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    Por favor, insira uma senha válida.
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Confirme a Senha</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={confirmPassword}
                                    onChange={handleConfirmPasswordChange}
                                    placeholder="Confirme a senha"
                                    required
                                    isInvalid={!!error} // Highlight this field if there's an error
                                />
                                <Form.Control.Feedback type="invalid">
                                    {error || 'Por favor, confirme sua senha.'}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </>
                    )}
                    <Form.Group className="mb-3">
                        <Form.Label>Status</Form.Label>
                        <Form.Select
                            name="status"
                            value={formData.status ? 'Ativo' : 'Inativo'}
                            required
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    status: e.target.value === 'Ativo',
                                })
                            }
                        >
                            <option value="Ativo">Ativo</option>
                            <option value="Inativo">Inativo</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Tipo</Form.Label>
                        <Form.Select
                            name="type"
                            value={formData.type || 2}
                            required
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    type: parseInt(e.target.value, 10),
                                })
                            }
                        >
                            <option value={2}>Técnico</option>
                            <option value={1}>Administrador</option>
                        </Form.Select>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cancelar
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    Salvar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
