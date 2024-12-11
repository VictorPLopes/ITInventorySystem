import {useEffect, useState} from 'react';
import {Col, Container, Row} from "react-bootstrap";
import axios from "../AxiosConfig";
import {Toaster} from "react-hot-toast";

const Dashboard = ({port}: { port: string }) => {
    const [message, setMessage] = useState<string>('');
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await axios.get(`https://localhost:${port}/Dashboard`);
                setMessage(response.data); // Define a mensagem recebida da API
            } catch (err) {
                setError('Usuário não autenticado.');
            }
        };
        fetchDashboard();
    }, []);

    return (

        <Container className="mt-4">
            <Toaster position="top-right"/>
            <Row>
                <Col>
                    <h2 className="mb-4">Dashboard</h2>
                </Col>
            </Row>
            {message ? (<>
                    <Row className="mb-4">
                        <Col className="text-center">
                            <p>EM CONSTRUÇÃO</p>
                        </Col>
                    </Row>
                </>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <p>Carregando...</p>
            )}
        </Container>
    );
}

export default Dashboard;
