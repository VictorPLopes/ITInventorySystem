import {useEffect, useState} from 'react';
import axios from "../AxiosConfig";
import Swal from 'sweetalert2';
import toast, {Toaster} from 'react-hot-toast';
import {UserModal} from '../components/UserModal';
import {UserTable} from '../components/UserTable';
import {Button, Col, Container, Row, Spinner} from 'react-bootstrap';

interface User {
    id: number;
    name: string;
    email: string;
    password: string;
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

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    const handleSaveUser = async (user: Partial<User>) => {
        const apiEndpoint = isEdit ? `https://localhost:${port}/UpdateUser` : `https://localhost:${port}/CreateUser`;

        try {
            await axios.post(apiEndpoint, user);
            toast.success('Usuário salvo com sucesso!');
            setShowModal(false);
            await fetchUsers();
        } catch {
            toast.error('Erro ao salvar o usuário.');
        }
    };

    return (
        <Container className="mt-4">
            <Toaster position="top-right"/>
            <Row>
                <Col>
                    <h2 className="mb-4">Usuários Registrados</h2>
                </Col>
                <Col className="text-end">
                    <Button variant="danger" onClick={handleLogout}>
                        Sair
                    </Button>
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
                                <UserTable users={users} onEdit={handleEditUser} onDelete={handleDeleteUser}/>
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
        </Container>
    );
};

export default UsersPage;
