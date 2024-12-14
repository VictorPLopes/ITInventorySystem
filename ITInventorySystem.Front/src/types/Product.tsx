interface Product {
    id?: number;
    name: string;
    quantity: number;
    description: string;
    category: string;
    costPrice: number;
    salePrice: number;
    brandManufacturerName: string;
    createdAt?: string;
    updatedAt?: string | null;
}

export default Product;