import React, {useRef, useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import User from "../types/User";
import JwtUser from "../types/JwtUser.tsx";

interface UserModalProps {
    show: boolean;
    onClose: () => void;
    onSave: (user: Partial<User>) => void;
    user: Partial<User>;
    loggedUser: JwtUser | null;
}

export const UserModal: React.FC<UserModalProps> = ({
                                                        show,
                                                        onClose,
                                                        onSave,
                                                        user,
                                                        loggedUser,
                                                    }) => {
    const [formData, setFormData] = useState<Partial<User>>(user);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [validated, setValidated] = useState(false);
    const [passwordError, setPasswordError] = useState(""); // Para mensagens de erro de senha
    const formRef = useRef<HTMLFormElement>(null);

    const isEdit = Boolean(user.id); // Determina se é uma edição

    // Manipula mudanças nos campos de entrada
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | any>
    ) => {
        const {name, value} = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "type" ? parseInt(value, 10) : value,
        }));
    };

    // Manipula mudanças no campo de confirmação de senha
    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
    };

    // Validação do formulário e envio
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation();

        const form = event.currentTarget;

        if (!form.checkValidity()) {
            setValidated(true);
            return;
        }

        if (!isEdit && formData.password !== confirmPassword) {
            setPasswordError("As senhas não correspondem. Tente novamente.");
            setValidated(true);
            return;
        }

        setPasswordError("");
        setValidated(true);
        onSave(formData);
    };

    // Dispara o evento de salvamento
    const handleSave = () => {
        if (formRef.current) {
            const event = new Event("submit", {bubbles: true, cancelable: true});
            formRef.current.dispatchEvent(event);
        }
    };

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>{isEdit ? "Editar Usuário" : "Novo Usuário"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form noValidate validated={validated} onSubmit={handleSubmit} ref={formRef}>
                    <Form.Group className="mb-3">
                        <Form.Label>Nome</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name || ""}
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
                            value={formData.email || ""}
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
                                    value={formData.password || ""}
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
                                    isInvalid={!!passwordError}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {passwordError || "Por favor, confirme sua senha."}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </>
                    )}

                    <Form.Group className="mb-3">
                        <Form.Label>Status</Form.Label>
                        <Form.Select
                            name="status"
                            value={formData.status ? "Ativo" : "Inativo"}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    status: e.target.value === "Ativo",
                                })
                            }
                            required
                        >
                            <option value="Ativo">Ativo</option>
                            <option value="Inativo">Inativo</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            Por favor, selecione um status válido.
                        </Form.Control.Feedback>
                    </Form.Group>
                    {/* Só permite selecionar o cargo se o usuário logado for Master e se não estiver tentando editar outro Master*/}
                    {loggedUser?.role === "Master" && formData.type != 0 ? <Form.Group> 
                        <Form.Label>Tipo</Form.Label>
                        <Form.Select
                            name="type"
                            value={formData.type || 2}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    type: parseInt(e.target.value, 10),
                                })
                            }
                            required
                        >
                            <option value={2}>Técnico</option>
                            <option value={1}>Administrador</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            Por favor, selecione um tipo válido.
                        </Form.Control.Feedback>
                    </Form.Group> : null}
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
