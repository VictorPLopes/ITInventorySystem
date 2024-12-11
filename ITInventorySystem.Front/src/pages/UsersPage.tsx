import React, {useEffect, useState} from 'react';
import axios from "../AxiosConfig";
import Swal from 'sweetalert2';
import toast, {Toaster} from 'react-hot-toast';
import {UserModal} from '../components/UserModal';
import {ChangePasswordModal} from '../components/ChangePasswordModal';
import {Button, Col, Container, Row, Spinner} from 'react-bootstrap';
import {Value} from 'classnames';
import {GenericTable} from "../components/GenericTable.tsx";
import {MdLock} from "react-icons/md";

interface User {
    id: number;
    name: string;
    email: string;
    password?: string;
    type: number;
    status: boolean;
    createdAt: string;
    updatedAt: string | null;
}

const UsersPage = ({port}: { port: string }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<Partial<User>>({});
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

    const columns = [
        {
            title: 'ID',
            data: 'id'
        },
        {
            title: 'Nome',
            data: 'name'
        },
        {
            title: 'E-mail',
            data: 'email'
        },
        {
            title: 'Tipo',
            data: 'type',
            /*
            0: Master / root
            1: Administrador
            2: Técnico (usuário comum)
            */
            render: (data: number) => {
                switch (data) {
                    case 0:
                        return 'Master (root)';
                    case 1:
                        return 'Administrador';
                    case 2:
                        return 'Técnico';
                    default:
                        return 'Desconhecido';
                }
            }
        },
        {
            title: 'Status',
            data: 'status',
            render: (data: boolean) => data ? 'Ativo' : 'Inativo'
        },
        {
            title: 'Ações',
            name: 'actions'
        },
    ];

    useEffect(() => {
        const fetchUsersPage = async () => {
            try {
                const response = await axios.get(`https://localhost:${port}/UsersPage`);
                setMessage(response.data); // Define a mensagem recebida da API
            } catch (err) {
                setError('Erro ao acessar a página de usuários. Verifique sua autenticação.');
            }
        };

        fetchUsersPage();

        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`https://localhost:${port}/GetAllUsers`);
            setUsers(response.data);
        } catch (err) {
            toast.error('Erro ao buscar os usuários.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddUser = () => {
        setCurrentUser({id: 0, name: '', email: '', type: 0, status: true});
        setIsEdit(false);
        setShowModal(true);
    };

    const handleEditUser = (user: User) => {
        setCurrentUser(user);
        setIsEdit(true);
        setShowModal(true);
    };

    const handleDeleteUser = (user: User) => {
        Swal.fire({
            title: 'Tem certeza?',
            text: 'Você não poderá desfazer esta ação!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim, excluir!',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .delete(`https://localhost:${port}/DeleteUser/${user.id}`)
                    .then(() => {
                        toast.success('Usuário excluído com sucesso!');
                        fetchUsers();
                    })
                    .catch(() => {
                        toast.error('Erro ao excluir o usuário.');
                    });
            }
        });
    };

    const handleChangePassword = (user: User) => {
        setCurrentUser(user);
        setShowChangePasswordModal(true);
    };

    const handleSavePassword = async (userId: Value, newPassword: string) => {
        try {
            await axios.put(`https://localhost:${port}/UpdateUserPassword`, {id: userId, newPassword: newPassword});
            toast.success('Senha alterada com sucesso!');
            setShowChangePasswordModal(false);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Erro ao alterar senha.';
            toast.error(errorMessage);
        }
    }

    const handleSaveUser = async (user: Partial<User>) => {
        const apiEndpoint = isEdit ? `https://localhost:${port}/UpdateUser` : `https://localhost:${port}/CreateUser`;

        if (!user.name || !user.email) {
            toast.error("Nome e e-mail são obrigatórios.");
            return;
        }

        // Mapeia apenas os campos necessários
        const payload: any = {
            id: user.id,
            name: user.name,
            email: user.email,
            type: user.type,
            status: user.status
        };

        if (!isEdit && user.password) {
            payload.password = user.password;
        } else if (!isEdit && !user.password) {
            toast.error("A senha é obrigatória.");
            return;
        }

        try {
            if (isEdit) {
                await axios.put(apiEndpoint, payload);
            } else {
                await axios.post(apiEndpoint, payload);
            }
            toast.success('Usuário salvo com sucesso!');
            setShowModal(false);
            await fetchUsers();

        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Erro ao salvar o usuário.';
            toast.error(errorMessage);

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
            {message ? (<>
                    <Row className="mb-4">
                        <Col className="text-end">
                            <Button variant="success" onClick={handleAddUser}>
                                + Novo Usuário
                            </Button>
                        </Col>
                    </Row><Row>
                    <Col>
                        {loading ? (
                            <div className="d-flex justify-content-center align-items-center"
                                 style={{minHeight: '300px'}}>
                                <Spinner animation="border" role="status" variant="primary"/>
                            </div>
                        ) : (
                            <div className="p-4 rounded shadow-lg bg-body-tertiary">
                                <GenericTable
                                    data={users}
                                    columns={columns}
                                    actions={{
                                        onEdit: handleEditUser,
                                        onDelete: handleDeleteUser,
                                        onExtra: handleChangePassword
                                    }}
                                    extraAction=<MdLock/>
                                />
                            </div>
                        )}
                    </Col>
                </Row>
                </>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <p>Carregando...</p>
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
                    user={{id: currentUser.id}}
                />
            )}
        </Container>
    );
};

export default UsersPage;
