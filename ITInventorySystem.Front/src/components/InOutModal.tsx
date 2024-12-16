import React, {useState} from "react";
import {Button, Form, FormControl, FormGroup, FormLabel, Modal} from "react-bootstrap";
import Product from "../types/Product";

interface InOutModalProps {
    show: boolean;
    onClose: () => void;
    onSave: (product: Partial<Product>, quantity: number) => void;
    product: Partial<Product>;
}

export const InOutModal: React.FC<InOutModalProps> = ({show, onClose, onSave, product}) => {
    const [formData] = useState<Partial<Product>>(product);
    const [quantity, setQuantity] = useState<number | null>(1);
    const [operation, setOperation] = useState<string>("entrada");
    const [error, setError] = useState("");

    const handleSave = () => {
        if (!quantity || quantity <= 0) {
            setError("A quantidade deve ser um número positivo.");
            return;
        }

        setError("");

        // Handle entry or exit
        if (operation === "entrada") {
            onSave(formData, quantity); // Positive quantity for "entrada"
        } else if (operation === "saída") {
            onSave(formData, -quantity); // Negative quantity for "saída"
        }
    };

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Movimentar Produto #{product.id}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <FormGroup className="mb-3">
                        <FormLabel>Quantidade</FormLabel>
                        <FormControl
                            type="number"
                            value={quantity || 1}
                            max = {operation == "saída" ? formData.quantity : ""}
                            onChange={(e) => setQuantity(Math.max(parseInt(e.target.value, 10), 1) || 1)}
                            placeholder="Digite a quantidade"
                        />
                    </FormGroup>
                    <FormGroup className="mb-3">
                        <FormLabel>Tipo de Movimentação</FormLabel>
                        <Form.Select
                            value={operation}
                            onChange={(e) => setOperation(e.target.value)}
                        >
                            <option value="entrada">Entrada</option>
                            <option value="saída">Saída</option>
                        </Form.Select>
                    </FormGroup>
                    {error && <p className="text-danger">{error}</p>}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cancelar
                </Button>
                <Button
                    variant="primary"
                    onClick={handleSave}
                >
                    Salvar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
