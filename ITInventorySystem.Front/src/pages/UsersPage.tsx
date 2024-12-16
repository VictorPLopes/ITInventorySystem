import {useCallback, useEffect, useState} from "react";
import axios from "../AxiosConfig";
import Swal from "sweetalert2";
import toast, {Toaster} from "react-hot-toast";
import {Button, Col, Container, Row, Spinner} from "react-bootstrap";
import {MdLock} from "react-icons/md";
import {GenericTable} from "../components/GenericTable";
import {UserModal} from "../components/UserModal";
import {ChangePasswordModal} from "../components/ChangePasswordModal";
import User from "../types/User";

const API_ENDPOINTS = {
    usersPage: (port: string) => `https://localhost:${port}/auth/users-page`,
    users: (port: string) => `https://localhost:${port}/users`,
    updatePassword: (port: string, userId: number) =>
        `https://localhost:${port}/users/${userId}/update-password`,
};

const UsersPage = ({port}: { port: string }) => {
    // Estados principais da página
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [currentUser, setCurrentUser] = useState<Partial<User>>({});
    const [isEdit, setIsEdit] = useState(false);
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    const [hasAccess, setHasAccess] = useState<boolean | null>(null);

    const columns = [
        {title: "ID", data: "id"},
        {title: "Nome", data: "name"},
        {title: "E-mail", data: "email"},
        {
            title: "Tipo",
            data: "type",
            render: (data: number) => {
                const types = ["Master (root)", "Administrador", "Técnico"];
                return types[data] || "Desconhecido";
            },
        },
        {
            title: "Status",
            data: "status",
            render: (data: boolean) => (data ? "Ativo" : "Inativo"),
        },
        {title: "Ações", name: "actions"},
    ];

    // Verifica o acesso do usuário e busca os dados iniciais
    useEffect(() => {
        const checkAccess = async () => {
            try {
                await axios.get(API_ENDPOINTS.usersPage(port));
                setHasAccess(true);
            } catch {
                setHasAccess(false);
            }
        };

        checkAccess();
    }, [port]);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(API_ENDPOINTS.users(port));
            setUsers(response.data);
        } catch {
            toast.error("Erro ao buscar os usuários.");
        } finally {
            setLoading(false);
        }
    }, [port]);

    useEffect(() => {
        if (hasAccess) fetchUsers();
    }, [hasAccess, fetchUsers]);

    // Abre o modal para adicionar um novo usuário
    const handleAddUser = () => {
        setCurrentUser({id: 0, name: "", email: "", type: 2, status: true});
        setIsEdit(false);
        setShowModal(true);
    };

    // Abre o modal para editar um usuário existente
    const handleEditUser = (user: User) => {
        setCurrentUser(user);
        setIsEdit(true);
        setShowModal(true);
    };

    // Exclui um usuário com confirmação
    const handleDeleteUser = async (user: User) => {
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
                await axios.delete(`${API_ENDPOINTS.users(port)}/${user.id}`);
                toast.success("Usuário excluído com sucesso!");
                await fetchUsers();
            } catch {
                toast.error("Erro ao excluir o usuário.");
            }
        }
    };

    // Abre o modal para alterar a senha do usuário
    const handleChangePassword = (user: User) => {
        setCurrentUser(user);
        setShowChangePasswordModal(true);
    };

    // Salva a nova senha do usuário
    const handleSavePassword = async (userId: number, newPassword: string) => {
        try {
            await axios.put(API_ENDPOINTS.updatePassword(port, userId), {newPassword});
            toast.success("Senha alterada com sucesso!");
            setShowChangePasswordModal(false);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Erro ao alterar senha.");
        }
    };

    // Salva as alterações de um usuário (novo ou existente)
    const handleSaveUser = async (user: Partial<User>) => {
        const endpoint = isEdit
            ? `${API_ENDPOINTS.users(port)}/${user.id}`
            : API_ENDPOINTS.users(port);
        const method = isEdit ? "put" : "post";

        const payload = {
            name: user.name,
            email: user.email,
            type: user.type,
            status: user.status,
            ...(user.password && {password: user.password}),
        };

        try {
            await axios[method](endpoint, payload);
            toast.success("Usuário salvo com sucesso!");
            setShowModal(false);
            await fetchUsers();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Erro ao salvar o usuário.");
        }
    };

    return (
        <Container className="mt-4">
            <Toaster position="top-right"/>
            <Row>
                <Col>
                    <h2 className="mb-4">Usuários Registrados</h2>
                </Col>
            </Row>
            {hasAccess === null ? (
                <p>Carregando...</p>
            ) : hasAccess ? (
                <>
                    <Row className="mb-4">
                        <Col className="text-end">
                            <Button variant="success" onClick={handleAddUser}>
                                + Novo Usuário
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
                                        data={users}
                                        columns={columns}
                                        actions={{
                                            onEdit: handleEditUser,
                                            onDelete: handleDeleteUser,
                                            onExtra: handleChangePassword,
                                        }}
                                        extraAction={<MdLock/>}
                                    />
                                </div>
                            )}
                        </Col>
                    </Row>
                </>
            ) : (
                <p>Erro ao acessar a página de usuários. Verifique sua autenticação.</p>
            )}
            {showModal && (
                <UserModal
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    onSave={handleSaveUser}
                    user={currentUser}
                />
            )}
            {showChangePasswordModal && (
                <ChangePasswordModal
                    show={showChangePasswordModal}
                    onClose={() => setShowChangePasswordModal(false)}
                    onSave={handleSavePassword}
                    user={{id: currentUser.id as number}}
                />
            )}
        </Container>
    );
};

export default UsersPage;
