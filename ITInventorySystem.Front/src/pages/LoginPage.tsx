import React, {useEffect, useState} from "react";
import {AxiosError} from "axios";
import axios from "../AxiosConfig";
import {useNavigate} from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import JwtUser from "../types/JwtUser";
import {Alert, Button, Col, Container, Form, FormControl, FormGroup, FormLabel, Row,} from "react-bootstrap";

const API_ENDPOINTS = {
    login: (port: string) => `https://localhost:${port}/auth/login`,
    dashboard: (port: string) => `https://localhost:${port}/auth/dashboard`,
};

const LoginPage = ({port, onLogin}: { port: string, onLogin: any}) => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const getCurrentUser = () => {
        const token = localStorage.getItem("token");
        if (!token) return null;

        try {
            return jwtDecode(token) as JwtUser; // Returns an object with user ID and role
        } catch {
            return null;
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await axios.get(API_ENDPOINTS.dashboard(port));
                const currentUser = getCurrentUser();
                if (currentUser)
                    onLogin(currentUser);
                navigate("/dashboard");
            } catch {
                // User is not authenticated
            }
        };

        checkAuth();
    }, [port, navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await axios.post(API_ENDPOINTS.login(port), {
                email,
                password,
            });

            localStorage.setItem("token", response.data.token);
            onLogin(getCurrentUser());
            navigate("/dashboard");
        } catch (err) {
            const errorMessage =
                err instanceof AxiosError
                    ? "E-mail ou senha incorretos. Tente novamente."
                    : "Ocorreu um erro inesperado. Tente novamente mais tarde.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return <Container className="d-flex justify-content-center align-items-center vh-100">
        <Row className="w-75">
            <Col md={6} className="mx-auto">
                <div className="border p-4 shadow-lg bg-body-tertiary rounded login-box">
                    <h3 className="text-center mb-4">Acesso ao Sistema</h3>
                    <Form onSubmit={handleLogin}>
                        <FormGroup controlId="email" className="form-floating mb-3">
                            <FormControl
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="Digite seu e-mail"
                                required
                            />
                            <FormLabel>E-mail</FormLabel>
                        </FormGroup>

                        <FormGroup controlId="password" className="form-floating mb-3">
                            <FormControl
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Digite sua senha"
                                required
                            />
                            <FormLabel>Senha</FormLabel>
                        </FormGroup>

                        <div className="text-center mt-4">
                            <Button
                                variant="success"
                                type="submit"
                                disabled={loading}
                                className="w-100"
                            >
                                {loading ? "Carregando..." : "Entrar"}
                            </Button>
                        </div>

                        {error && <Alert variant="danger" className="mt-3 text-center">
                                {error}
                            </Alert>}
                    </Form>
                </div>
            </Col>
        </Row>
    </Container>;
};

export default LoginPage;