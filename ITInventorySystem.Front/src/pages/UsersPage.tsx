import {useEffect, useState} from 'react';
import axios from "../AxiosConfig";
import Swal from 'sweetalert2';
import toast, {Toaster} from 'react-hot-toast';
import {UserModal} from '../components/UserModal';
import {UserTable} from '../components/UserTable';
import { ChangePasswordModal } from '../components/ChangePasswordModal';
import {Button, Col, Container, Row, Spinner} from 'react-bootstrap';
import { Value } from 'classnames';

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

    const handleChangePassword = (user : User) => {
        setCurrentUser(user);
        setShowChangePasswordModal(true);
    };

    const handleSavePassword = async (userId: Value, newPassword : string) => {
        try{
            await axios.put(`https://localhost:${port}/UpdateUserPassword`, { id: userId, newPassword: newPassword });
            toast.success('Senha alterada com sucesso!');
            setShowChangePasswordModal(false);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Erro ao alterar senha.';
            toast.error(errorMessage);
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    const handleSaveUser = async (user: Partial<User>) => {
        const apiEndpoint = isEdit ? `https://localhost:${port}/UpdateUser` : `https://localhost:${port}/CreateUser`;

        if (!user.name || !user.email) {
            toast.error("Name and Email are required.");
            return;
        }

        // Mapeia apenas os campos necessários
        const payload:any = {
        id: user.id,
        name: user.name,
        email: user.email,
        type: user.type,
        status: user.status
        };

        if(!isEdit && user.password){
            payload.password = user.password;
        }else if (!isEdit && !user.password) {
            toast.error("Password is required for new users.");
            return;
        }

        try {
            if(isEdit){
                await axios.put(apiEndpoint, payload);
            }
            else{
                await axios.post(apiEndpoint, payload);
            }            
            toast.success('Usuário salvo com sucesso!');
            setShowModal(false);
            await fetchUsers();

        } catch(error: any) {
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
                                <UserTable users={users} onEdit={handleEditUser} onDelete={handleDeleteUser} onChangePassword={handleChangePassword}/>
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
