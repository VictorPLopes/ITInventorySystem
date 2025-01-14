import { useCallback, useEffect, useState } from "react";
import axios from "../AxiosConfig";
import Swal from "sweetalert2";
import toast, { Toaster } from "react-hot-toast";
import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import { MdPictureAsPdf } from "react-icons/md";
import { GenericTable } from "../components/GenericTable";
import { WorkOrderModal } from "../components/WorkOrderModal";
import WorkOrder from "../types/WorkOrder";

const API_ENDPOINTS = {
    workOrdersPage: (port: string) => `https://localhost:${port}/auth/work-orders-page`,
    workOrders: (port: string) => `https://localhost:${port}/work-orders`,
    users: (port: string) => `https://localhost:${port}/users/all`,
    clients: (port: string) => `https://localhost:${port}/clients/all`,
};

const WorkOrdersPage = ({ port }: { port: string }) => {
    const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
    const [users, setUsers] = useState<{ id: number; name: string }[]>([]);
    const [clients, setClients] = useState<{ id: number; name: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [currentWorkOrder, setCurrentWorkOrder] = useState<Partial<WorkOrder>>({});
    const [isEdit, setIsEdit] = useState(false);
    const [hasAccess, setHasAccess] = useState<boolean | null>(null);

    const columns = [
        { title: "ID", data: "id" },
        {
            title: "Data de Abertura", 
            data: "startDate",
            render: (data: string) => {
                const date = new Date(data);
                return new Intl.DateTimeFormat("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                }).format(date);
            }
        },
        {
            title: "Responsável",
            data: "userInChargeId",
            render: (data: number) => {
                const user = users.find((u) => u.id === data);
                return user ? user.name : "Desconhecido";
            },
        },
        {
            title: "Cliente",
            data: "clientId",
            render: (data: number) => {
                const client = clients.find((c) => c.id === data);
                return client ? client.name : "Desconhecido";
            },
        },
        { title: "Descrição", data: "description" },
        { title: "Carga Horária", data: "workHours" },
        {
            title: "Status",
            data: "status",
            render: (data: number) => {
                const status = ["Concluída", "Em Andamento", "Pendente"];
                return status[data] || "Desconhecido";
            },
        },
        { title: "Ações", name: "actions" },
    ];

    useEffect(() => {
        const checkAccess = async () => {
            try {
                await axios.get(API_ENDPOINTS.workOrdersPage(port));
                setHasAccess(true);
            } catch {
                setHasAccess(false);
            }
        };

        checkAccess();
    }, [port]);

    const fetchWorkOrders = useCallback(async () => {
        setLoading(true);
        try {
            const [workOrdersRes, usersRes, clientsRes] = await Promise.all([
                axios.get(API_ENDPOINTS.workOrders(port)),
                axios.get(API_ENDPOINTS.users(port)),
                axios.get(API_ENDPOINTS.clients(port)),
            ]);

            setWorkOrders(workOrdersRes.data);
            setUsers(usersRes.data);
            setClients(clientsRes.data);
        } catch {
            toast.error("Erro ao buscar as ordens de serviço.");
        } finally {
            setLoading(false);
        }
    }, [port]);

    useEffect(() => {
        if (hasAccess) fetchWorkOrders();
    }, [hasAccess, fetchWorkOrders]);

    const handleAddWorkOrder = () => {
        setCurrentWorkOrder({
            id: 0,
            startDate: new Date().toISOString(),
            userInChargeId: 0,
            clientId: 0,
            description: "",
            workHours: 0,
            products: [],
        });
        setIsEdit(false);
        setShowModal(true);
    };

    const handleEditWorkOrder = (workOrder: WorkOrder) => {
        setCurrentWorkOrder(workOrder);
        setIsEdit(true);
        setShowModal(true);
    };

    const handleExportWorkOrder = (workOrder: WorkOrder) => {
        setCurrentWorkOrder(workOrder);
        // TODO: Implement PDF export
    };

    const handleDeleteWorkOrder = async (workOrder: WorkOrder) => {
        const confirmed = await Swal.fire({
            title: "Tem certeza?",
            text: "Você não poderá desfazer esta ação!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sim, excluir!",
            cancelButtonText: "Cancelar",
        });

        if (confirmed.isConfirmed) {
            try {
                await axios.delete(`${API_ENDPOINTS.workOrders(port)}/${workOrder.id}`);
                toast.success("Ordem de Serviço excluída com sucesso!");
                await fetchWorkOrders();
            } catch {
                toast.error("Erro ao excluir a ordem de serviço.");
            }
        }
    };

    const handleSaveWorkOrder = async (workOrder: Partial<WorkOrder>) => {
        const endpoint = isEdit
            ? `${API_ENDPOINTS.workOrders(port)}/${workOrder.id}`
            : API_ENDPOINTS.workOrders(port);
        const method = isEdit ? "put" : "post";

        try {
            await axios[method](endpoint, workOrder);
            toast.success("Ordem de Serviço salva com sucesso!");
            setShowModal(false);
            await fetchWorkOrders();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Erro ao salvar a ordem de serviço.");
        }
    };

    return (
        <Container className="mt-4">
            <Toaster position="top-right" />
            <Row>
                <Col>
                    <h2 className="mb-4">Ordens de Serviço Registradas</h2>
                </Col>
            </Row>
            {hasAccess === null ? (
                <p>Carregando...</p>
            ) : hasAccess ? (
                <>
                    <Row className="mb-4">
                        <Col className="text-end">
                            <Button variant="success" onClick={handleAddWorkOrder}>
                                + Nova Ordem de Serviço
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            {loading ? (
                                <div
                                    className="d-flex justify-content-center align-items-center"
                                    style={{ minHeight: "300px" }}
                                >
                                    <Spinner animation="border" role="status" variant="primary" />
                                </div>
                            ) : (
                                <div
                                    className="table-container p-4 rounded shadow-lg bg-body-tertiary"
                                    style={{ overflowX: "auto", width: "100%" }}
                                >
                                    <GenericTable
                                        data={workOrders}
                                        columns={columns}
                                        actions={{
                                            onEdit: handleEditWorkOrder,
                                            onDelete: handleDeleteWorkOrder,
                                            onExtra: handleExportWorkOrder,
                                        }}
                                        extraAction={<MdPictureAsPdf />}
                                    />
                                </div>
                            )}
                        </Col>
                    </Row>
                </>
            ) : (
                <p>Erro ao acessar a página de ordens de serviço. Verifique sua autenticação.</p>
            )}
            {showModal && (
                <WorkOrderModal
                    port={port}
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    onSave={handleSaveWorkOrder}
                    workOrder={currentWorkOrder}
                />
            )}
        </Container>
    );
};

export default WorkOrdersPage;
