import React, { useRef, useState } from "react";
import axios from "../AxiosConfig";
import { useNavigate } from "react-router-dom";
import User from "../types/User";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import toast from "react-hot-toast";

// Endpoints da API para configurar o usuário
const API_ENDPOINTS = {
    users: (port: string) => `https://localhost:${port}/users/setup`,
};

const SetupPage = ({ port }: { port: string }) => {
    // Estados para os dados do formulário
    const [formData, setFormData] = useState<Partial<User>>({});
    const [confirmPassword, setConfirmPassword] = useState(""); // Estado para confirmar a senha
    const [validated, setValidated] = useState(false); // Estado para validação do formulário
    const [passwordError, setPasswordError] = useState(""); // Estado para mensagens de erro de senha
    const formRef = useRef<HTMLFormElement>(null); // Referência ao formulário
    const navigate = useNavigate(); // Navegação para redirecionamento

    // Manipula mudanças nos campos de entrada
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | any>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Manipula mudanças no campo de confirmação de senha
    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
    };

    // Validação do formulário e envio
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation();

        const form = event.currentTarget;

        // Valida se o formulário foi preenchido corretamente
        if (!form.checkValidity()) {
            setValidated(true);
            return;
        }

        // Verifica se as senhas coincidem
        if (formData.password !== confirmPassword) {
            setPasswordError("As senhas não correspondem. Tente novamente.");
            setValidated(true);
            return;
        }

        setPasswordError(""); // Reseta o erro de senha caso esteja válido
        setValidated(true);

        const payload = {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            type: 0, // Definição do tipo de usuário como root
        };

        try {
            // Envia os dados para a API
            await axios.post(API_ENDPOINTS.users(port), payload);
            toast.success("Usuário salvo com sucesso!");
            navigate("/"); // Redireciona para a página de login
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Erro ao salvar o usuário.");
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center vh-100">
            <Row className="w-75">
                <Col md={6} className="mx-auto">
                    <div className="border p-4 shadow-lg bg-body-tertiary rounded login-box">
                        <h3 className="text-center mb-4">Registre o Usuário Mestre (Root)</h3>
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

                            <Button variant="primary" type="submit">
                                Salvar
                            </Button>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default SetupPage;
