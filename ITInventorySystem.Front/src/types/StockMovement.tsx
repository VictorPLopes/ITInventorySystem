interface StockMovement {
    id?: number;
    productId: number;    
    movementType: number;
    quantity: number;
    description: string;
    createdAt: string; // Assume formato ISO "YYYY-MM-DDTHH:mm:ssZ"
}
export default StockMovement;
