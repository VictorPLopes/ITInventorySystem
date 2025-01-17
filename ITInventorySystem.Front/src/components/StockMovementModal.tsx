import { useState, useEffect } from "react";
import { Button, Form, Modal, Row, Col, Alert, OverlayTrigger, Tooltip } from "react-bootstrap";
import axios from "../AxiosConfig";
import StockMovement from "../types/StockMovement";

interface StockMovementModalProps {
    port: string;
    show: boolean;
    onClose: () => void;
    onSave: (movement: StockMovement) => void;
    movement: StockMovement;
}

const API_ENDPOINTS = {
    movements: (port: string) => `https://localhost:${port}/movements`,
    products: (port: string) => `https://localhost:${port}/products`,
};

export const StockMovementModal = ({
                                       show,
                                       onClose,
                                       onSave,
                                       movement,
                                       port,
                                   }: StockMovementModalProps) => {
    const [products, setProducts] = useState<{ id: number; name: string; quantity: number }[]>([]);
    const [formData, setFormData] = useState<StockMovement>(movement);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [showDescriptionError, setShowDescriptionError] = useState(false);

    useEffect(() => {
        setFormData(movement);
    }, [movement]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(API_ENDPOINTS.products(port));
                setProducts(response.data);
            } catch (error) {
                console.error("Erro ao buscar produtos", error);
            }
        };
        fetchProducts();
    }, [port]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        let newValue: any = value;

        if (name === "quantity") {
            newValue = parseInt(value, 10);
            if (formData.movementType !== 2 && newValue < 0) {
                return;
            }
        }
        if (name === "movementType") {
            newValue = Number(value);
        }

        setFormData((prev) => ({
            ...prev,
            [name]: newValue,
        }));

        if (name === "description") {
            setShowDescriptionError(false);
        }
    };

    const validateForm = () => {
        if (!formData.productId || formData.productId === 0) return "Selecione um produto.";
        if (!formData.quantity || formData.quantity === 0) return "Informe a quantidade.";
        if (!formData.description || formData.description.trim() === "") {
            setShowDescriptionError(true);
            return "O campo descrição é obrigatório.";
        }

        const selectedProduct = products.find(p => p.id === formData.productId);
        if (formData.movementType === 1 && selectedProduct && formData.quantity > selectedProduct.quantity) {
            return `Estoque insuficiente! O produto selecionado possui apenas ${selectedProduct.quantity} unidades disponíveis.`;
        }

        return null;
    };

    const handleSave = async () => {
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setIsSaving(true);
        setError(null);

        try {
            const movementDTO = {
                productId: formData.productId,
                quantity: formData.quantity,
                movementType: formData.movementType,
                description: formData.description.trim(),
            };

            await axios.post(API_ENDPOINTS.movements(port), movementDTO);
            onSave(formData);
            onClose();
        } catch (error: any) {
            console.error("Erro ao registrar movimentação", error);

            if (error.response && error.response.data) {
                const { message, code } = error.response.data;
                setError(message || "Erro desconhecido ao registrar movimentação.");
            } else {
                setError("Erro ao registrar movimentação. Tente novamente.");
            }
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Registrar Movimentação</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form>
                    <Row className="mb-3">
                        <Col>
                            <Form.Group>
                                <Form.Label>Produto</Form.Label>
                                <Form.Select
                                    name="productId"
                                    value={formData.productId || 0}
                                    onChange={handleInputChange}
                                >
                                    <option value={0}>Selecione um produto</option>
                                    {products.map((product) => (
                                        <option key={product.id} value={product.id}>
                                            {product.name} (Em estoque: {product.quantity})
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Quantidade</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="quantity"
                                    value={formData.quantity || ""}
                                    onChange={handleInputChange}
                                    placeholder={
                                        formData.movementType === 2
                                            ? "Digite um valor positivo ou negativo"
                                            : "Digite um valor positivo"
                                    }
                                    min={formData.movementType === 2 ? undefined : "1"}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Tipo de Movimentação</Form.Label>
                                <Form.Select
                                    name="movementType"
                                    value={formData.movementType}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Selecione</option>
                                    <option value={0}>Entrada</option>
                                    <option value={1}>Saída</option>
                                    <option value={2}>Ajuste de Estoque</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label>
                                    Descrição 
                                    <OverlayTrigger
                                        placement="right"
                                        overlay={
                                            <Tooltip>
                                                <strong>Regras de Movimentação:</strong>
                                                <ul className="m-0 p-0" style={{ listStyleType: "none" }}>
                                                    <li>✅ <strong>Entrada:</strong> Sempre valor positivo.</li>
                                                    <li>✅ <strong>Saída:</strong> Sempre valor positivo.</li>
                                                    <li>✅ <strong>Ajuste de Estoque:</strong> Positivo (adiciona), Negativo (remove).</li>
                                                </ul>
                                            </Tooltip>
                                        }
                                    >
                                        <span style={{ cursor: "pointer", marginLeft: "5px" }}>ℹ️</span>
                                    </OverlayTrigger>
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    name="description"
                                    value={formData.description || ""}
                                    onChange={handleInputChange}
                                    placeholder="Descreva o motivo da movimentação"
                                    required
                                    isInvalid={showDescriptionError}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose} disabled={isSaving}>Cancelar</Button>
                <Button variant="primary" onClick={handleSave} disabled={isSaving}>{isSaving ? "Salvando..." : "Salvar"}</Button>
            </Modal.Footer>
        </Modal>
    );
};
