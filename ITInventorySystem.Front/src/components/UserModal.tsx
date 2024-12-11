import React, {useState} from 'react';
import {Button, Form, FormControl, FormGroup, FormLabel, Modal} from 'react-bootstrap';

interface User {
    id?: number;
    name: string;
    email: string;
    password?: string; // Tornar opcional para usuários existentes
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
    const [confirmPassword, setConfirmPassword] = useState(''); // Estado para a confirmação da senha
    const [error, setError] = useState(''); // Estado para mensagens de erro

    const isEdit = Boolean(user.id); // Determina se é edição

    // Manipula alterações nos campos do formulário
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | any>) => {
        const {name, value} = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'type' ? parseInt(value, 10) : value,
        }));
    };

    // Manipula a alteração do campo de confirmação de senha
    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
    };

    // Verifica se as senhas correspondem antes de salvar
    const handleSave = () => {
        if (!isEdit && formData.password && formData.password !== confirmPassword) {
            setError('As senhas não correspondem.');
            return;
        }
        setError('');
        onSave(formData); // Chama a função de salvar
    };

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>{isEdit ? 'Editar Usuário' : 'Novo Usuário'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <FormGroup className="mb-3">
                        <FormLabel>Nome</FormLabel>
                        <FormControl
                            type="text"
                            name="name"
                            value={formData.name || ''}
                            onChange={handleInputChange}
                            placeholder="Digite o nome"
                            required={true}
                        />
                    </FormGroup>
                    <FormGroup className="mb-3">
                        <FormLabel>E-mail</FormLabel>
                        <FormControl
                            type="email"
                            name="email"
                            value={formData.email || ''}
                            onChange={handleInputChange}
                            placeholder="Digite o e-mail"
                            required={true}
                        />
                    </FormGroup>
                    {/* Renderiza os campos de senha apenas para criação */}
                    {!isEdit && (
                        <>
                            <FormGroup className="mb-3">
                                <FormLabel>Senha</FormLabel>
                                <FormControl
                                    type="password"
                                    name="password"
                                    value={formData.password || ''}
                                    onChange={handleInputChange}
                                    placeholder="Digite a senha"
                                    required={true}
                                />
                            </FormGroup>
                            <FormGroup className="mb-3">
                                <FormLabel>Confirme a Senha</FormLabel>
                                <FormControl
                                    type="password"
                                    value={confirmPassword}
                                    onChange={handleConfirmPasswordChange}
                                    placeholder="Confirme a senha"
                                    required={true}
                                />
                            </FormGroup>
                        </>
                    )}
                    {error && <p className="text-danger">{error}</p>}
                    <FormGroup className="mb-3">
                        <FormLabel>Status</FormLabel>
                        <Form.Select
                            name="status"
                            value={formData.status ? 'Ativo' : 'Inativo'}
                            required={true}
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
                        <Form.Select
                            name="type"
                            value={formData.type || 0}
                            required={true}
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
