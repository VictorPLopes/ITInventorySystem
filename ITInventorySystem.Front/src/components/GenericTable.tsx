import DataTable from 'datatables.net-react';
// @ts-ignore
import language from 'datatables.net-plugins/i18n/pt-BR.mjs';
import DT from 'datatables.net-bs5';
import {Button, ButtonGroup} from 'react-bootstrap';
import {MdDelete, MdEditSquare} from "react-icons/md";

DataTable.use(DT);

interface GenericTableProps<T> {
    data: T[];
    columns: any[]; // Estrutura flexível para colunas
    actions?: {
        onEdit?: (row: T) => void;
        onDelete?: (row: T) => void;
        onExtra?: (row: T) => void;
    };
    extraAction?: any;
}

export const GenericTable = <T, >({data, columns, actions, extraAction}: GenericTableProps<T>) => {
    return (
        <DataTable
            options={{
                language,
                paging: true, // Habilitar paginação
                searching: true, // Habilitar campo de busca
                ordering: true, // Permitir ordenação                
            }}
            className="table table-hover" // Classes do Bootstrap
            columns={columns}
            data={data}
            slots={{
                'actions': (_data: any, row: T) => (
                    <ButtonGroup>
                        {actions?.onEdit && (
                            <Button variant="warning" size="sm" onClick={() => actions.onEdit?.(row)}>
                                <MdEditSquare/>
                            </Button>
                        )}
                        {actions?.onExtra && (
                            <Button variant="info" size="sm" onClick={() => actions.onExtra?.(row)}>
                                {extraAction}
                            </Button>
                        )}
                        {actions?.onDelete && (
                            <Button variant="danger" size="sm" onClick={() => actions.onDelete?.(row)}>
                                <MdDelete/>
                            </Button>
                        )}
                    </ButtonGroup>
                ),
            }}
        />
    );
};

