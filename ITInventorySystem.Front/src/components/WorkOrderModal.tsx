import React, {useEffect, useState} from "react";
import {Button, Form, Modal, Spinner} from "react-bootstrap";
import axios from "../AxiosConfig";
import WorkOrder from "../types/WorkOrder";

interface WorkOrderModalProps {
    port: string;
    show: boolean;
    onClose: () => void;
    onSave: (workOrder: Partial<WorkOrder>) => void;
    workOrder: Partial<WorkOrder>;
}

const API_ENDPOINTS = {
    users: (port: string) => `https://localhost:${port}/users`,
    clients: (port: string) => `https://localhost:${port}/clients`,
    products: (port: string) => `https://localhost:${port}/products`,
};

export const WorkOrderModal: React.FC<WorkOrderModalProps> = ({
                                                                  port,
                                                                  show,
                                                                  onClose,
                                                                  onSave,
                                                                  workOrder,
                                                              }) => {
    const [formData, setFormData] = useState<Partial<WorkOrder>>(workOrder);
    const [users, setUsers] = useState<{ id: number; name: string }[]>([]);
    const [clients, setClients] = useState<{ id: number; name: string }[]>([]);
    const [products, setProducts] = useState<{ id: number; name: string; quantity: number }[]>([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Fetch initial data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [usersRes, clientsRes, productsRes] = await Promise.all([
                    axios.get(API_ENDPOINTS.users(port)),
                    axios.get(API_ENDPOINTS.clients(port)),
                    axios.get(API_ENDPOINTS.products(port)),
                ]);

                setUsers(usersRes.data);
                setClients(clientsRes.data);

                // Filter products with quantity > 0
                const availableProducts = productsRes.data.filter((p: any) => p.quantity > 0);
                setProducts(availableProducts);
            } catch {
                setErrors((prev) => ({...prev, fetch: "Erro ao carregar dados iniciais."}));
            } finally {
                setLoading(false);
            }
        };

        if (show) fetchData();
    }, [show, port]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const {name, value} = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: name === "workHours" ? Math.max(1, parseInt(value) || 1) : value,
        }));
    };

    const handleProductChange = (productId: number, quantity: number) => {
        const existingProducts = formData.products || [];
        const updatedProducts =
            quantity === 0
                ? existingProducts.filter((p) => p.productId !== productId)
                : existingProducts.map((p) =>
                    p.productId === productId ? {...p, quantity} : p
                );

        if (!existingProducts.some((p) => p.productId === productId) && quantity > 0) {
            updatedProducts.push({productId, quantity});
        }

        setFormData((prev) => ({
            ...prev,
            products: updatedProducts,
        }));
    };

    const validateFields = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.startDate) newErrors.startDate = "A data de abertura é obrigatória.";
        if (!formData.userInChargeId) newErrors.userInChargeId = "O responsável é obrigatório.";
        if (!formData.clientId) newErrors.clientId = "O cliente é obrigatório.";
        if (!formData.workHours || formData.workHours <= 0)
            newErrors.workHours = "A carga horária é obrigatória.";
        if (!formData.description || formData.description.trim() === "")
            newErrors.description = "A descrição é obrigatória.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (validateFields()) {
            onSave(formData);
        }
    };

    return (
        <Modal show={show} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>
                    {formData.id ? "Editar Ordem de Serviço" : "Nova Ordem de Serviço"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading ? (
                    <div className="d-flex justify-content-center">
                        <Spinner animation="border"/>
                    </div>
                ) : (
                    <Form>
                        {errors.fetch && <p className="text-danger">{errors.fetch}</p>}
                        <Form.Group className="mb-3">
                            <Form.Label>Data de Abertura</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                name="startDate"
                                value={formData.startDate || ""}
                                onChange={handleInputChange}
                                isInvalid={!!errors.startDate}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.startDate}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Responsável</Form.Label>
                            <Form.Select
                                name="userInChargeId"
                                value={formData.userInChargeId || ""}
                                onChange={handleInputChange}
                                isInvalid={!!errors.userInChargeId}
                            >
                                <option value="">Selecione um responsável</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name}
                                    </option>
                                ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                {errors.userInChargeId}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Cliente</Form.Label>
                            <Form.Select
                                name="clientId"
                                value={formData.clientId || ""}
                                onChange={handleInputChange}
                                isInvalid={!!errors.clientId}
                            >
                                <option value="">Selecione um cliente</option>
                                {clients.map((client) => (
                                    <option key={client.id} value={client.id}>
                                        {client.name}
                                    </option>
                                ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                {errors.clientId}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Descrição</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="description"
                                value={formData.description || ""}
                                onChange={handleInputChange}
                                isInvalid={!!errors.description}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.description}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Carga Horária</Form.Label>
                            <Form.Control
                                type="number"
                                name="workHours"
                                value={formData.workHours || ""}
                                onChange={handleInputChange}
                                isInvalid={!!errors.workHours}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.workHours}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Produtos</Form.Label>
                            {products.map((product) => {
                                const selectedProduct = formData.products?.find(
                                    (p) => p.productId === product.id
                                );
                                const quantity = selectedProduct?.quantity || 0;
                                return (
                                    <div
                                        key={product.id}
                                        className="d-flex align-items-center mb-2"
                                    >
                                        <Form.Check
                                            type="checkbox"
                                            id={`product-${product.id}`}
                                            label={product.name}
                                            checked={!!selectedProduct}
                                            onChange={(e) =>
                                                handleProductChange(
                                                    product.id,
                                                    e.target.checked ? 1 : 0
                                                )
                                            }
                                        />
                                        <Form.Control
                                            type="number"
                                            min="1"
                                            max={product.quantity}
                                            value={selectedProduct ? quantity : ""}
                                            onChange={(e) =>
                                                handleProductChange(
                                                    product.id,
                                                    parseInt(e.target.value, 10) || 0
                                                )
                                            }
                                            className="ms-3"
                                            style={{width: "80px"}}
                                            disabled={!selectedProduct}
                                        />
                                    </div>
                                );
                            })}
                        </Form.Group>
                    </Form>
                )}
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
