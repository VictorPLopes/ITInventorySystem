import React, { useState } from "react";
import { Button, Form, FormControl, FormGroup, FormLabel, Modal } from "react-bootstrap";

interface InOutModalProps {
    show: boolean;
    onClose: () => void;
    onSave: (productId: number, quantity: number) => void;
    product: { id: number };
}

export const InOutModal: React.FC<InOutModalProps> = ({ show, onClose, onSave, product }) => {
    const [quantity, setQuantity] = useState<number | null>(null);
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
            onSave(product.id, quantity); // Positive quantity for "entrada"
        } else if (operation === "saída") {
            onSave(product.id, -quantity); // Negative quantity for "saída"
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
                            value={quantity || ""}
                            onChange={(e) => setQuantity(parseInt(e.target.value, 10) || null)}
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
                    disabled={!quantity || quantity <= 0}
                >
                    Salvar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
