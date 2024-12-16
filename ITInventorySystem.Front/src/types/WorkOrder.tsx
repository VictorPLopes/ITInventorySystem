import ProductsInWorkOrder from "./ProductsInWorkOrder.tsx";

interface WorkOrder {
    id?: number;
    startDate: string;
    userInChargeId: number;
    clientId: number;
    description: string;
    workHours: number;
    status?: number;
    products?: Array<ProductsInWorkOrder>;
    createdAt?: string;
    updatedAt?: string | null;
}

export default WorkOrder;