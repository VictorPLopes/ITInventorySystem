import {useEffect, useState} from "react";
import {Button, Card, Col, Container, Row, Spinner} from "react-bootstrap";
import axios from "../AxiosConfig";
import {Toaster} from "react-hot-toast";
import {Bar} from "react-chartjs-2";
import {BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip} from "chart.js";
import {FaBoxOpen, FaClipboardList, FaUsers} from "react-icons/fa";
import ReportDownloadModal from "../components/ReportDownloadModal.tsx";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const API_ENDPOINTS = {
    dashboard: (port: string) => `https://localhost:${port}/dashboard/summary`,
    topProducts: (port: string) => `https://localhost:${port}/dashboard/top-products`,
};

const DashboardPage = ({port}: { port: string }) => {
    const [topProducts, setTopProducts] = useState<any[]>([]);
    const [dashboardSummary, setDashboardSummary] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");
    const [showModal, setShowModal] = useState(false);
    const [selectedReportType, setSelectedReportType] = useState<string | null>(null);


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [topProductsResponse, dashboardResponse] = await Promise.all([
                    axios.get(API_ENDPOINTS.topProducts(port)),
                    axios.get(API_ENDPOINTS.dashboard(port)),
                ]);

                setTopProducts(topProductsResponse.data);
                setDashboardSummary(dashboardResponse.data);
            } catch (err) {
                console.error("Erro ao carregar os dados do dashboard:", err);
                setError("Erro ao carregar os dados do dashboard.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [port]);

    // Função para abrir o modal e definir o tipo de relatório
    const openModal = (reportType: string) => {
        setSelectedReportType(reportType);
        setShowModal(true);
    };

    // Função para chamar a API e baixar o relatório
    const handleDownloadReport = async (startDate: string, endDate: string) => {
        if (!selectedReportType) return;

        const endpoint = `https://localhost:${port}/reports/${selectedReportType}?startDate=${startDate}&endDate=${endDate}`;

        try {
            const response = await axios.get(endpoint, { responseType: "blob" });

            // Criar link para download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `${selectedReportType}_${startDate}_to_${endDate}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Erro ao baixar o relatório:", error);
            alert("Erro ao baixar o relatório. Por favor, tente novamente.");
        } finally {
            setShowModal(false); // Fecha o modal após o download
        }
    };
    const barChartData = {
        labels: topProducts.map((product) => product.productName),
        datasets: [
            {
                label: "Quantidade Utilizada",
                data: topProducts.map((product) => product.totalQuantity),
                backgroundColor: ["#0d6efd", "#6610f2", "#6f42c1", "#d63384", "#fd7e14"],
            },
        ],
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{height: "50vh"}}>
                <Spinner animation="border" role="status" variant="primary">
                    <span className="visually-hidden">Carregando...</span>
                </Spinner>
            </div>
        );
    }

    if (error) {
        return (
            <Container className="mt-4">
                <Toaster position="top-right"/>
                <Row>
                    <Col>
                        <p className="text-danger text-center">{error}</p>
                    </Col>
                </Row>
            </Container>
        );
    }

    return (
        <Container fluid className="mt-4">
            <Toaster position="top-right"/>
            <Row>
                <Col>
                    <h2 className="mb-4 text-primary">📊 Dashboard</h2>
                </Col>
            </Row>

            <Row className="mb-3">
                <Col className="text-end">
                    <Button className="me-2" variant="primary" onClick={() => openModal("stock-movement")}>
                        📥 Baixar Relatório de Estoque
                    </Button>
                    <Button variant="success" onClick={() => openModal("work-orders")}>
                        📥 Baixar Relatório de Ordens de Serviço
                    </Button>
                </Col>
            </Row>

            {/* Modal de Seleção de Datas */}
            <ReportDownloadModal
                show={showModal}
                reportType={selectedReportType}
                onClose={() => setShowModal(false)}
                onDownload={handleDownloadReport}
            />    

            {/* Resumo do Dashboard */}
            {dashboardSummary && (
                <Row className="mb-4">
                    <Col md={3}>
                        <Card className="text-center shadow border-0 bg-light">
                            <Card.Body>
                                <FaBoxOpen size={40} className="text-primary mb-2"/>
                                <Card.Title className="fw-bold">Total de Produtos</Card.Title>
                                <h3 className="text-primary">{dashboardSummary.productCount || 0}</h3>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="text-center shadow border-0 bg-light">
                            <Card.Body>
                                <FaUsers size={40} className="text-success mb-2"/>
                                <Card.Title className="fw-bold">Total de Clientes</Card.Title>
                                <h3 className="text-success">{dashboardSummary.clientCount || 0}</h3>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="text-center shadow border-0 bg-light">
                            <Card.Body>
                                <FaUsers size={40} className="text-info mb-2"/>
                                <Card.Title className="fw-bold">Total de Usuários</Card.Title>
                                <h3 className="text-info">{dashboardSummary.userCount || 0}</h3>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="text-center shadow border-0 bg-light">
                            <Card.Body>
                                <FaClipboardList size={40} className="text-warning mb-2"/>
                                <Card.Title className="fw-bold">Total de Ordens</Card.Title>
                                <h3 className="text-warning">{dashboardSummary.workOrderCount || 0}</h3>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}

            {/* Produtos Mais Utilizados */}
            {/* Produtos Mais Utilizados */}
            <Row>
                <Col md={6}>
                    <h4 className="mb-3 text-secondary">Produtos Mais Utilizados</h4>
                    {topProducts.length > 0 ? (
                        topProducts.map((product, index) => (
                            <Card key={product.productId} className="mb-3 shadow border-0 bg-white">
                                <Card.Body className="d-flex align-items-center">
                                    {/* Ícone ou Número Representativo */}
                                    <div
                                        className="me-3"
                                        style={{
                                            width: 50,
                                            height: 50,
                                            backgroundColor: "#f8f9fa",
                                            borderRadius: "50%",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        <span style={{fontSize: "1.5rem", color: "#6c757d"}}>{index + 1}</span>
                                    </div>
                                    {/* Detalhes do Produto */}
                                    <div>
                                        <Card.Title className="fw-bold text-primary">
                                            {product.productName}
                                        </Card.Title>
                                        <p className="mb-1 text-muted">
                                            Código do Produto: <strong>{product.productId}</strong>
                                        </p>
                                        <p className="mb-0 text-muted">
                                            Quantidade Utilizada: <strong>{product.totalQuantity}</strong>
                                        </p>
                                    </div>
                                </Card.Body>
                            </Card>
                        ))
                    ) : (
                        <p>Nenhum produto foi utilizado em ordens de serviço.</p>
                    )}
                </Col>
                <Col md={6}>
                    <h4 className="mb-3 text-secondary">Gráfico de Produtos Mais Utilizados</h4>
                    <div className="p-3 shadow bg-light rounded">
                        <Bar
                            data={barChartData}
                            options={{
                                plugins: {
                                    title: {
                                        display: true,
                                        text: "Produtos Mais Utilizados",
                                        font: {
                                            size: 16,
                                            weight: "bold",
                                        },
                                    },
                                    legend: {
                                        display: false,
                                    },
                                },
                                scales: {
                                    x: {
                                        grid: {
                                            display: false,
                                        },
                                    },
                                    y: {
                                        grid: {
                                            color: "#e0e0e0",
                                        },
                                    },
                                },
                            }}
                        />
                    </div>
                </Col>
            </Row>

        </Container>
    );
};

export default DashboardPage;
