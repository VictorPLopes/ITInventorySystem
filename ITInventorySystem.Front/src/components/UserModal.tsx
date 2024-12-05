import React, {useState} from 'react';
import {Button, Form, FormControl, FormGroup, FormLabel, Modal} from 'react-bootstrap';

interface User {
    id?: number;
    name: string;
    email: string;
    password: string;
    type: number;
    status: boolean;
}

interface UserModalProps {
    show: boolean;
    onClose: () => void;
    onSave: (user: Partial<User>) => void;
    user: Partial<User>;
}

export const UserModal: React.FC<UserModalProps> = ({show, onClose, onSave, user}) => {
    const [formData, setFormData] = useState<Partial<User>>(user);

    // Explicit type for the change handler
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | any>) => {
        const {name, value} = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'type' ? parseInt(value, 10) : value,
        }));
    };

    const handleSave = () => {
        onSave(formData);
    };

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>{user.id ? 'Editar Usuário' : 'Novo Usuário'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <FormGroup className="mb-3">
                        <FormLabel>Nome</FormLabel>
                        <FormControl
                            type="text"
                            name="name"
                            value={formData.name || ''}
                            onChange={(e) => handleInputChange(e)}
                            placeholder="Digite o nome"
                        />
                    </FormGroup>
                    <FormGroup className="mb-3">
                        <FormLabel>E-mail</FormLabel>
                        <FormControl
                            type="email"
                            name="email"
                            value={formData.email || ''}
                            onChange={(e) => handleInputChange(e)}
                            placeholder="Digite o e-mail"
                        />
                    </FormGroup>
                    <FormGroup>
                        <FormLabel>Senha</FormLabel>
                        <FormControl
                            type="password"
                            name="password"
                            value={formData.password || ''}
                            onChange={(e) => handleInputChange(e)}
                            placeholder="Digite a senha"
                        />
                    </FormGroup>
                    <FormGroup className="mb-3">
                        <FormLabel>Status</FormLabel>
                        <Form.Select
                            name="status"
                            value={formData.status ? 'Ativo' : 'Inativo'}
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
                    </FormGroup>
                    <FormGroup>
                        <FormLabel>Tipo</FormLabel>
                        <Form.Select name="type" value={formData.type || 0} onChange={handleInputChange}>
                            <option value={0}>Usuário</option>
                            <option value={1}>Administrador</option>
                        </Form.Select>
                    </FormGroup>
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
