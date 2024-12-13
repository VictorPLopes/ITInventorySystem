import {useEffect, useState} from "react";
import {Col, Container, Row} from "react-bootstrap";
import axios from "../AxiosConfig";
import {Toaster} from "react-hot-toast";

const API_ENDPOINTS = {
    dashboard: (port: string) => `https://localhost:${port}/auth/dashboard`,
};

const DashboardPage = ({port}: { port: string }) => {
    const [message, setMessage] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await axios.get(API_ENDPOINTS.dashboard(port));
                setMessage(response.data);
            } catch {
                setError("Usuário não autenticado.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, [port]);

    return (
        <Container className="mt-4">
            <Toaster position="top-right"/>
            <Row>
                <Col>
                    <h2 className="mb-4">Dashboard</h2>
                </Col>
            </Row>
            {loading ? (
                <p>Carregando...</p>
            ) : message ? (
                <Row className="mb-4">
                    <Col className="text-center">
                        <p>EM CONSTRUÇÃO</p>
                    </Col>
                </Row>
            ) : (
                <p>{error}</p>
            )}
        </Container>
    );
};

export default DashboardPage;