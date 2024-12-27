import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import JwtUser from "../types/JwtUser";
import ChangePasswordModal from "./ChangeMyPasswordModal.tsx";

interface LoggedUserModalProps {
    show: boolean;
    onClose: () => void;
    loggedUser: JwtUser | null;
    onLogout: () => void;
    port: string;
}

const LoggedUserModal: React.FC<LoggedUserModalProps> = ({
                                                             show,
                                                             onClose,
                                                             loggedUser,
                                                             onLogout,
                                                             port,
                                                         }) => {
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

    const handleOpenChangePassword = () => {
        setShowChangePasswordModal(true);
    };

    const handleCloseChangePassword = () => {
        setShowChangePasswordModal(false);
        onLogout();
    };

    return (
        <>
            <Modal show={show} onHide={onClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Usuário Logado</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p><strong>Nome:</strong> {loggedUser?.unique_name}</p>
                    <p><strong>E-mail:</strong> {loggedUser?.email}</p>
                    <p><strong>Função:</strong> {loggedUser?.role}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={onLogout}>
                        Sair
                    </Button>
                    <Button variant="primary" onClick={handleOpenChangePassword}>
                        Alterar Senha
                    </Button>
                </Modal.Footer>
            </Modal>
            {showChangePasswordModal && (
                <ChangePasswordModal
                    show={showChangePasswordModal}
                    onClose={handleCloseChangePassword}
                    loggedUser={loggedUser}
                    port={port}
                />
            )}
        </>
    );
};

export default LoggedUserModal;
