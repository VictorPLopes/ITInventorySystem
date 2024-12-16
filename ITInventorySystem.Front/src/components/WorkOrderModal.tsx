import React, {useEffect, useRef, useState} from "react";
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
    const [validated, setValidated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetchError, setFetchError] = useState<string>("");
    const formRef = useRef<HTMLFormElement>(null);

    const isEdit = Boolean(workOrder.id);

    // Buscar dados iniciais
    useEffect(() => {
        setFormData({
            ...workOrder,
            status: workOrder.status ?? 2, // 2 como status padrão (Pendente)
        });
        
        const fetchData = async () => {
            setLoading(true);
            setFetchError("");
            try {
                const [usersRes, clientsRes, productsRes] = await Promise.all([
                    axios.get(API_ENDPOINTS.users(port)),
                    axios.get(API_ENDPOINTS.clients(port)),
                    axios.get(API_ENDPOINTS.products(port)),
                ]);

                setUsers(usersRes.data);
                setClients(clientsRes.data);

                // Filtrar produtos com quantidade > 0
                const availableProducts = productsRes.data.filter((p: any) => p.quantity > 0);
                setProducts(availableProducts);
            } catch {
                setFetchError("Erro ao carregar dados iniciais.");
            } finally {
                setLoading(false);
            }
        };

        if (show) fetchData();
    }, [show, port, workOrder]);

    // Manipular mudanças nos campos do formulário
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const {name, value} = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "workHours" ? Math.max(1, parseInt(value) || 1) : value,
        }));
    };

    // Manipular mudanças de quantidade de produtos
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

    // Validação dos campos
    const validateFields = (): boolean => {
        if (!formRef.current?.checkValidity()) {
            setValidated(true);
            return false;
        }
        return true;
    };

    // Salvar formulário
    const handleSave = () => {
        if (validateFields()) {
            onSave(formData);
        }
    };

    return (
        <Modal show={show} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>
                    {isEdit ? "Editar Ordem de Serviço" : "Nova Ordem de Serviço"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading ? (
                    <div className="d-flex justify-content-center">
                        <Spinner animation="border"/>
                    </div>
                ) : (
                    <Form noValidate validated={validated} ref={formRef}>
                        {fetchError && (
                            <div className="alert alert-danger" role="alert">
                                {fetchError}
                            </div>
                        )}
                        <Form.Group className="mb-3">
                            <Form.Label>Data de Abertura</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                name="startDate"
                                value={formData.startDate || ""}
                                onChange={handleInputChange}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Por favor, insira uma data de abertura válida.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Responsável</Form.Label>
                            <Form.Select
                                name="userInChargeId"
                                value={formData.userInChargeId || ""}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Selecione um responsável</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.id} | {user.name}
                                    </option>
                                ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                Por favor, selecione um responsável.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Cliente</Form.Label>
                            <Form.Select
                                name="clientId"
                                value={formData.clientId || ""}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Selecione um cliente</option>
                                {clients.map((client) => (
                                    <option key={client.id} value={client.id}>
                                        {client.id} | {client.name}
                                    </option>
                                ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                Por favor, selecione um cliente.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Descrição</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="description"
                                value={formData.description || ""}
                                onChange={handleInputChange}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Por favor, insira uma descrição.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Carga Horária</Form.Label>
                            <Form.Control
                                type="number"
                                name="workHours"
                                value={formData.workHours || ""}
                                onChange={handleInputChange}
                                min="1"
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Por favor, insira uma carga horária válida.
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
                                    <div key={product.id} className="d-flex align-items-center mb-2">
                                        <Form.Check
                                            type="checkbox"
                                            id={`product-${product.id}`}
                                            label={`${product.id} | ${product.name}`}
                                            checked={!!selectedProduct}
                                            onChange={(e) =>
                                                handleProductChange(product.id, e.target.checked ? 1 : 0)
                                            }
                                        />
                                        <Form.Control
                                            type="number"
                                            min="1"
                                            max={product.quantity}
                                            value={selectedProduct ? quantity : ""}
                                            onChange={(e) =>
                                                handleProductChange(product.id, parseInt(e.target.value, 10) || 0)
                                            }
                                            className="ms-3"
                                            style={{width: "80px"}}
                                            disabled={!selectedProduct}
                                        />
                                    </div>
                                );
                            })}
                        </Form.Group>
                        {isEdit ? <Form.Group className="mb-3">
                            <Form.Label>Status</Form.Label>
                            <Form.Select
                                name="status"
                                value={formData.status ?? workOrder.status ?? 2} // Default to current workOrder.status or "Pendente"
                                required
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        status: parseInt(e.target.value, 10),
                                    })
                                }
                            >
                                <option value={2}>Pendente</option>
                                <option value={1}>Em andamento</option>
                                <option value={0}>Concluída</option>
                            </Form.Select>
                        </Form.Group> : null}
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
