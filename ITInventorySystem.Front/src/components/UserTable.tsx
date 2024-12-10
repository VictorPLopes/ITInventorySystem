import React from 'react';
import {Button, ButtonGroup} from 'react-bootstrap';
import DataTable from 'datatables.net-react';
// @ts-ignore
import language from 'datatables.net-plugins/i18n/pt-BR.mjs';
import DT from 'datatables.net-bs5';
import {MdDelete, MdEditSquare, MdLock} from "react-icons/md";

DataTable.use(DT);

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

interface UserTableProps {
    users: User[];
    onEdit: (user: User) => void;
    onDelete: (user: User) => void;
    onChangePassword: (user: User) => void;
}

export const UserTable: React.FC<UserTableProps> = ({users, onEdit, onDelete, onChangePassword}) => {
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

    return (
        <DataTable
            options={{language,}}
            columns={columns}
            data={users}
            slots={{
                'actions': (_data: any, row: User) => (
                    <ButtonGroup>
                        <Button variant="warning" size="sm" onClick={() => onEdit(row)}>
                            <MdEditSquare/>
                        </Button>
                        <Button variant="info" size="sm" onClick={() => onChangePassword(row)}>
                            <MdLock/>
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => onDelete(row)}>
                            <MdDelete/>
                        </Button>
                    </ButtonGroup>
                )
            }}
        />
    );
};
