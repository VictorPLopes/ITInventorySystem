import React from 'react';
import {Button, ButtonGroup} from 'react-bootstrap';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-bs5';
import {MdDelete, MdEditSquare, MdLock} from "react-icons/md";

DataTable.use(DT);

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
            columns={columns}
            data={users}
            slots={{
                'actions': (_data: any, row: User) => (
                    <ButtonGroup>
                        <Button variant="warning" size="sm" onClick={() => onEdit(row)}>
                            <MdEditSquare/>
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => onDelete(row)}>
                            <MdDelete/>
                        </Button>
                        <Button variant="info" size="sm" onClick={() => onChangePassword(row)}>
                            <MdLock />
                        </Button>                        
                    </ButtonGroup>
                )
            }}
        />
    );
};
