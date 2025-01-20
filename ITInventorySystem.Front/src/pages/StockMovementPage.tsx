import { useCallback, useEffect, useState } from "react";
import axios from "../AxiosConfig";
import toast, { Toaster } from "react-hot-toast";
import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import { GenericTable } from "../components/GenericTable";
import { StockMovementModal } from "../components/StockMovementModal";
import StockMovement from "../types/StockMovement";

// Mapeamento correto para ENUM numérico
const movementTypeLabels: Record<number, string> = {
    0: "Entrada",
    1: "Saída",
    2: "Ajuste de Estoque",
};

// Função para formatar data no padrão DD/MM/YYYY HH:mm
const formatDate = (dateString: string) => {
    if (!dateString) return "Data inválida";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const API_ENDPOINTS = {
    movementsPage: (port: string) => `https://localhost:${port}/auth/movements-page`,
    movements: (port: string) => `https://localhost:${port}/movements`,
};

const StockMovementsPage = ({ port }: { port: string }) => {
    const [movements, setMovements] = useState<StockMovement[]>([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [currentMovement, setCurrentMovement] = useState<StockMovement>({
        id: 0, // ID temporário (o backend atribuirá um real)
        productId: 0,
        quantity: 0,
        movementType: 0,
        description: "",
        createdAt: new Date().toISOString(),
    });
    const [hasAccess, setHasAccess] = useState<boolean | null>(null);

    useEffect(() => {
        const checkAccess = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                setHasAccess(false);
                return;
            }

            try {
                await axios.get(API_ENDPOINTS.movementsPage(port));
                setHasAccess(true);
            } catch {
                setHasAccess(false);
            }
        };

        checkAccess();
    }, [port]);

    const fetchMovements = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(API_ENDPOINTS.movements(port));
            setMovements(response.data);
        } catch {
            toast.error("Erro ao buscar as movimentações de estoque.");
        } finally {
            setLoading(false);
        }
    }, [port]);

    useEffect(() => {
        if (hasAccess) fetchMovements();
    }, [hasAccess, fetchMovements]);

    const handleAddMovement = () => {
        setCurrentMovement({
            id: 0, // ID temporário
            productId: 0,
            quantity: 0,
            movementType: 0,
            description: "",
            createdAt: new Date().toISOString(),
        });
        setShowModal(true);
    };

    return (
        <Container className="mt-4">
            <Toaster position="top-right" />
            <Row>
                <Col>
                    <h2 className="mb-4">Movimentações de Estoque</h2>
                </Col>
            </Row>
            {hasAccess === null ? (
                <p>Carregando...</p>
            ) : hasAccess ? (
                <>
                    <Row className="mb-4">
                        <Col className="text-end">
                            <Button variant="success" onClick={handleAddMovement}>
                                + Nova Movimentação
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            {loading ? (
                                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
                                    <Spinner animation="border" role="status" variant="primary" />
                                </div>
                            ) : (
                                <GenericTable
                                    data={movements}
                                    columns={[
                                        { title: "ID", data: "id" },
                                        { title: "Produto", data: "product", render: (product: any) => `${product.id} - ${product.name}`
                                                || "Desconhecido" },
                                        { title: "Quantidade", data: "quantity" },
                                        { title: "Tipo", data: "movementType", render: (type: number) => movementTypeLabels[type] || "Desconhecido" },
                                        { title: "Descrição", data: "description" },
                                        { title: "Data", data: "createdAt", render: (date: string) => formatDate(date) },
                                        
                                    ]}
                                    options={{
                                        order: [[5, "desc"]], // Ordena pela data (coluna 5) em ordem decrescente
                                    }}
                                />
                            )}
                        </Col>
                    </Row>
                </>
            ) : (
                <p>Erro ao acessar a página de movimentações. Verifique sua autenticação.</p>
            )}
            {showModal && (
                <StockMovementModal
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    onSave={fetchMovements}
                    movement={currentMovement}
                    port={port}
                />
            )}
        </Container>
    );
};

export default StockMovementsPage;
