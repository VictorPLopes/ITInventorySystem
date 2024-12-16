import {useCallback, useEffect, useState} from "react";
import axios from "../AxiosConfig";
import Swal from "sweetalert2";
import toast, {Toaster} from "react-hot-toast";
import {Button, Col, Container, Row, Spinner} from "react-bootstrap";
import {GenericTable} from "../components/GenericTable";
import {ClientModal} from "../components/ClientModal";
import Client from "../types/Client";

const API_ENDPOINTS = {
    clientsPage: (port: string) => `https://localhost:${port}/auth/clients-page`,
    clients: (port: string) => `https://localhost:${port}/clients`,
};

const ClientsPage = ({port}: { port: string }) => {
    // Estados principais da página
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [currentClient, setCurrentClient] = useState<Partial<Client>>({});
    const [isEdit, setIsEdit] = useState(false);
    const [hasAccess, setHasAccess] = useState<boolean | null>(null);

    const columns = [
        {title: "ID", data: "id"},
        {
            title: "Documento",
            data: "idDoc",
            render: (data: string) => {
                // Formata como CPF ou CNPJ
                return data.length <= 11 ? data.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4").substring(0, 14) : data.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5").substring(0, 18);
            }
        },
        {title: "Nome", data: "name"},
        {title: "E-mail", data: "email"},
        {title: "Endereço", data: "street"},
        {title: "Cidade", data: "city"},
        {title: "Estado", data: "state"},
        {
            title: "CEP",
            data: "postalCode",
            render: (data: string) => {
                // Formata como CEP
                return data.replace(/(\d{5})(\d{3})/, "$1-$2").substring(0, 9);
            }
        },
        {
            title: "Telefone",
            data: "phoneNumber",
            render: (data: string) => {
                // Formata como telefone fixo ou celular
                return data.length <= 12 ? data.replace(/(\d{2})(\d{2})(\d{4})(\d{0,4})/, "+$1 ($2) $3-$4").substr(0, 18) : data.replace(/(\d{2})(\d{2})(\d{5})(\d{0,4})/, "+$1 ($2) $3-$4").substr(0, 19);
            }
        },
        {title: "Ações", name: "actions"},
    ];

    // Verifica o acesso do usuário e busca os dados iniciais
    useEffect(() => {
        const checkAccess = async () => {
            try {
                await axios.get(API_ENDPOINTS.clientsPage(port));
                setHasAccess(true);
            } catch {
                setHasAccess(false);
            }
        };

        checkAccess();
    }, [port]);

    const fetchClients = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(API_ENDPOINTS.clients(port));
            setClients(response.data);
        } catch {
            toast.error("Erro ao buscar os clientes.");
        } finally {
            setLoading(false);
        }
    }, [port]);

    useEffect(() => {
        if (hasAccess) fetchClients();
    }, [hasAccess, fetchClients]);

    // Abre o modal para adicionar um novo cliente
    const handleAddClient = () => {
        setCurrentClient({
            id: 0,
            idDoc: "",
            name: "",
            email: "",
            street: "",
            city: "",
            state: "",
            postalCode: "",
            phoneNumber: "",
        });
        setIsEdit(false);
        setShowModal(true);
    };

    // Abre o modal para editar um cliente existente
    const handleEditClient = (client: Client) => {
        setCurrentClient(client);
        setIsEdit(true);
        setShowModal(true);
    };

    // Exclui um cliente com confirmação
    const handleDeleteClient = async (client: Client) => {
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
                await axios.delete(`${API_ENDPOINTS.clients(port)}/${client.id}`);
                toast.success("Cliente excluído com sucesso!");
                await fetchClients();
            } catch {
                toast.error("Erro ao excluir o cliente.");
            }
        }
    };

    // Salva as alterações de um cliente (novo ou existente)
    const handleSaveClient = async (client: Partial<Client>) => {
        const endpoint = isEdit
            ? `${API_ENDPOINTS.clients(port)}/${client.id}`
            : API_ENDPOINTS.clients(port);
        const method = isEdit ? "put" : "post";

        const payload = {
            idDoc: client.idDoc,
            name: client.name,
            email: client.email,
            street: client.street,
            city: client.city,
            state: client.state,
            postalCode: client.postalCode,
            phoneNumber: client.phoneNumber,
        };

        try {
            await axios[method](endpoint, payload);
            toast.success("Cliente salvo com sucesso!");
            setShowModal(false);
            await fetchClients();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Erro ao salvar o cliente.");
        }
    };

    return (
        <Container className="mt-4">
            <Toaster position="top-right"/>
            <Row>
                <Col>
                    <h2 className="mb-4">Clientes Registrados</h2>
                </Col>
            </Row>
            {hasAccess === null ? (
                <p>Carregando...</p>
            ) : hasAccess ? (
                <>
                    <Row className="mb-4">
                        <Col className="text-end">
                            <Button variant="success" onClick={handleAddClient}>
                                + Novo Cliente
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            {loading ? (
                                <div
                                    className="d-flex justify-content-center align-items-center"
                                    style={{minHeight: "300px"}}
                                >
                                    <Spinner animation="border" role="status" variant="primary"/>
                                </div>
                            ) : (
                                <div
                                    className="table-container p-4 rounded shadow-lg bg-body-tertiary"
                                    style={{overflowX: "auto", width: "100%"}}
                                >
                                    <GenericTable
                                        data={clients}
                                        columns={columns}
                                        actions={{
                                            onEdit: handleEditClient,
                                            onDelete: handleDeleteClient,
                                        }}
                                    />
                                </div>
                            )}
                        </Col>
                    </Row>

                </>
            ) : (
                <p>Erro ao acessar a página de clientes. Verifique sua autenticação.</p>
            )}
            {showModal && (
                <ClientModal
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    onSave={handleSaveClient}
                    client={currentClient}
                />
            )}
        </Container>
    );
};

export default ClientsPage;
