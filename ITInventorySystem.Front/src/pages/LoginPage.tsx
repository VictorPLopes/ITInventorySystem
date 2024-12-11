import React, {useEffect, useState} from 'react';
import {AxiosError} from 'axios';
import axios from "../AxiosConfig";
import {useNavigate} from 'react-router-dom';
import {Alert, Button, Col, Container, Form, FormControl, FormGroup, FormLabel, Row} from "react-bootstrap";

function LoginPage({port}: { port: string }) {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
//    const [token, setToken] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Função para chamar o endpoint protegido `painelControle`
        const fetchDashboard = async () => {
            try {
                await axios.get(`https://localhost:${port}/auth/dashboard`);
                navigate('/dashboard');
            } catch (err) {
                // Não faz nada, pois o usuário ainda não está autenticado
            }
        };
        fetchDashboard();
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post(`https://localhost:${port}/auth/login`, {
                email,
                password,
            });

            if (response.status === 200) {
                // setToken(response.data.token);
                localStorage.setItem('token', response.data.token);
                navigate('/dashboard');
            }
        } catch (err) {
            if (err instanceof AxiosError) {
                setError('E-mail ou senha incorretos. Tente novamente.');
            } else {
                setError('Ocorreu um erro inesperado. Tente novamente mais tarde.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center vh-100">
            <Row className="w-75">
                <Col md={6} className="mx-auto">
                    <div className="border p-4 shadow-lg bg-body-tertiary rounded login-box">
                        <h3 className="text-center mb-4">Acesso ao Sistema</h3>
                        <Form onSubmit={handleLogin}>
                            <FormGroup controlId="email" className="form-floating mb-3">
                                <FormControl
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Digite seu e-mail"
                                    required
                                />
                                <FormLabel>E-mail</FormLabel>
                            </FormGroup>

                            <FormGroup controlId="password" className="form-floating mb-3">
                                <FormControl
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
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
                                    style={{transition: "transform 0.2s, box-shadow 0.2s"}}
                                    onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                                    onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                                >
                                    {loading ? 'Carregando...' : 'Entrar'}
                                </Button>

                            </div>

                            {error && (
                                <Alert variant="danger" className="mt-3 text-center" style={{fontWeight: "bold"}}>
                                    {error}
                                </Alert>
                            )}

                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default LoginPage;
