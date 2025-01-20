import React, { useEffect, useRef, useState } from "react";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import { Badge } from "react-bootstrap";
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
    users: (port: string) => `https://localhost:${port}/users/all`,
    clients: (port: string) => `https://localhost:${port}/clients/all`,
    products: (port: string) => `https://localhost:${port}/products/all`,
};

export const WorkOrderModal: React.FC<WorkOrderModalProps> = ({
    port,
    show,
    onClose,
    onSave,
    workOrder,
}) => {
    const [formData, setFormData] = useState<Partial<WorkOrder>>({
        ...workOrder,
        products: workOrder.products || [],
    });
    const [users, setUsers] = useState<{ id: number; name: string; isDeleted?: boolean }[]>([]);
    const [clients, setClients] = useState<{ id: number; name: string; isDeleted?: boolean }[]>([]);
    const [products, setProducts] = useState<{ id: number; name: string; quantity: number; isDeleted?: boolean }[]>([]);
    const [validated, setValidated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetchError, setFetchError] = useState<string>("");

    const formRef = useRef<HTMLFormElement>(null);

    const isEdit = Boolean(workOrder.id);

    useEffect(() => {
        setFormData({
            ...workOrder,
            status: workOrder.status ?? 2,
            products: workOrder.products || [],
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

                const availableProducts = productsRes.data.map((p: any) => ({
                    ...p,
                    isDeleted: p.isDeleted,
                }));

                setProducts(availableProducts);
            } catch {
                setFetchError("Erro ao carregar dados iniciais.");
            } finally {
                setLoading(false);
            }
        };

        if (show) fetchData();
    }, [show, port, workOrder]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "workHours" ? Math.max(1, parseInt(value) || 1) : value,
        }));
    };

    const handleProductChange = (productId: number, quantity: number) => {
        const existingProducts = formData.products || [];
        const product = products.find((p) => p.id === productId);

        if (!product) return;

        // Obtém a quantidade atual na ordem de serviço carregada
        const currentQuantityInOrder =
            workOrder.products?.find((p) => p.productId === productId)?.quantity || 0;
        //Estoque atual do produto    
        const currentStock = product.quantity;
        
        //Quantidade máxima dísponivel considerando estoque e ordem de serviço, caso o estoque n seja 0
        const maxAvailable = currentStock === 0 ? 0 :  currentStock + currentQuantityInOrder; // Estoque atual + quantidade já na ordem

        
        if (quantity > maxAvailable  && quantity > currentQuantityInOrder) {
            alert(`A quantidade máxima disponível é ${maxAvailable}.`);
            return;
        }

        const updatedProducts =
            quantity === 0
                ? existingProducts.filter((p) => p.productId !== productId)
                : existingProducts.map((p) =>
                      p.productId === productId ? { ...p, quantity } : p
                  );

        if (!existingProducts.some((p) => p.productId === productId) && quantity > 0) {
            updatedProducts.push({ productId, quantity });
        }

        setFormData((prev) => ({
            ...prev,
            products: updatedProducts,
        }));
    };

    const validateFields = (): boolean => {
        if (!formRef.current?.checkValidity()) {
            setValidated(true);
            return false;
        }
        return true;
    };

    const handleSave = () => {
        if (validateFields()) {
            onSave(formData);
        }
    };

    return (
        <Modal show={show} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{isEdit ? "Editar Ordem de Serviço" : "Nova Ordem de Serviço"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading ? (
                    <div className="d-flex justify-content-center">
                        <Spinner animation="border" />
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
                                {users.filter((user) => !user.isDeleted || user.id == formData.userInChargeId)
                                    .map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.id} - {user.name} {user.isDeleted && "(Usuário deletado)"}
                                    </option>
                                ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                Por favor, selecione um responsável.
                            </Form.Control.Feedback>
                            {/* Exibe uma mensagem de alerta se o responsável atual estiver deletado */}
                            {formData.userInChargeId &&
                                users.find((user) => user.id === formData.userInChargeId)?.isDeleted && (
                                    <Badge bg="warning" className="mt-2">
                                        O responsável selecionado foi desativado, mas permanece vinculado à esta ordem.
                                    </Badge>
                                
                                )}
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
                                {clients
                                    .filter(
                                        (client) =>
                                            !client.isDeleted || // Se não for deletado, sempre mostrar
                                            (isEdit && workOrder.clientId === client.id) // Se estiver editando e o cliente pertence à OS
                                    )
                                    .map((client) => (
                                        <option key={client.id} value={client.id}>
                                            {client.id} - {client.name} {client.isDeleted && "(Cliente deletado)"}
                                        </option>
                                    ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                Por favor, selecione um cliente.
                            </Form.Control.Feedback>
                            {/* Exibe uma mensagem de alerta se o responsável atual estiver deletado */}
                            {formData.clientId &&
                                clients.find((client) => client.id === formData.clientId)?.isDeleted && (
                                    <Badge bg="warning" className="mt-2">
                                        O cliente selecionado foi desativado, mas permanece vinculado à esta ordem.
                                    </Badge>

                                )}
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
                            <Form.Label>Adicionar Produtos</Form.Label>
                            <div className="d-flex align-items-center mb-2">
                                <Form.Select
                                    onChange={(e) => {
                                        const productId = parseInt(e.target.value, 10);
                                        if (
                                            productId &&
                                            !formData.products?.some((p) => p.productId === productId)
                                        ) {
                                            handleProductChange(productId, 1);
                                        }
                                        e.target.value = "";
                                    }}
                                >
                                    <option value="">Selecione um produto</option>
                                    {products
                                        .filter(
                                            (p) =>
                                                !formData.products?.some((fp) => fp.productId === p.id) &&
                                                !p.isDeleted &&
                                                p.quantity > 0
                                        )
                                        .map((product) => (
                                            <option key={product.id} value={product.id}>
                                                {product.id} - {product.name} (Disponível: {product.quantity})
                                            </option>
                                        ))}
                                </Form.Select>
                            </div>
                            {formData.products && formData.products?.length > 0 && (
                                <>
                                    <Form.Label>Produtos Selecionados</Form.Label>
                                    {formData.products?.map((selectedProduct) => {
                                        const product = products.find(
                                            (p) => p.id === selectedProduct.productId
                                        ) || {
                                            id: selectedProduct.productId,
                                            name: `Produto [ID: ${selectedProduct.productId}] não disponível`,
                                            quantity: 0,
                                            isDeleted: true,
                                        };

                                        const currentQuantityInOrder =
                                            workOrder.products?.find((p) => p.productId === product.id)?.quantity || 0;
                                        const maxAvailable = product.quantity === 0 ? 0 : product.quantity + currentQuantityInOrder;
                                        const dinamicMaxAvailable = maxAvailable-selectedProduct.quantity < 0 ? 0 : maxAvailable-selectedProduct.quantity;

                                        return (
                                            <div
                                                key={selectedProduct.productId}
                                                className={`d-flex align-items-center mb-2 p-2 border ${
                                                    product.isDeleted ? "border-danger bg-light" : "border-secondary"
                                                }`}
                                            >
                                                <span className="me-3">
                                                    <strong>ID:</strong> {product.id} | <strong>Nome:</strong>{" "}
                                                    {product.name}
                                                    {product.isDeleted && (
                                                        <Badge bg="danger" className="ms-2">
                                                            Deletado
                                                        </Badge>
                                                    )}
                                                </span>
                                                {!product.isDeleted && (
                                                    <>
                                                        <Form.Control
                                                            type="number"
                                                            min="1"
                                                            max={maxAvailable === 0 ? currentQuantityInOrder : maxAvailable}
                                                            value={selectedProduct.quantity}
                                                            onChange={(e) =>
                                                                handleProductChange(
                                                                    selectedProduct.productId,
                                                                    parseInt(e.target.value, 10) || 1
                                                                )
                                                            }
                                                            className="me-3"
                                                            style={{ width: "100px" }}
                                                        />
                                                        <span className="me-3 text-muted">
                                                            Máx: {dinamicMaxAvailable} disponíveis
                                                        </span>
                                                    </>
                                                )}
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => handleProductChange(selectedProduct.productId, 0)}
                                                >
                                                    {product.isDeleted
                                                        ? "Remover Produto Indisponível"
                                                        : "Remover"}
                                                </Button>
                                            </div>
                                        );
                                    })}
                                </>
                            )}
                        </Form.Group>
                        {isEdit ? (
                            <Form.Group className="mb-3">
                                <Form.Label>Status</Form.Label>
                                <Form.Select
                                    name="status"
                                    value={formData.status ?? workOrder.status ?? 2}
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
                            </Form.Group>
                        ) : null}
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
