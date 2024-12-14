import React, { useState, useRef } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import Product from "../types/Product";

interface ProductModalProps {
    show: boolean;
    onClose: () => void;
    onSave: (product: Partial<Product>) => void;
    product: Partial<Product>;
}

export const ProductModal: React.FC<ProductModalProps> = ({
                                                              show,
                                                              onClose,
                                                              onSave,
                                                              product,
                                                          }) => {
    const [formData, setFormData] = useState<Partial<Product>>(product);
    const [validated, setValidated] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    const isEdit = Boolean(product.id); // Determine if it's an edit action

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "quantity" || name === "costPrice" || name === "salePrice"
                ? parseFloat(value) || 0 // Parse numeric fields
                : value,
        }));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();

        if (!form.checkValidity()) {
            setValidated(true);
            return;
        }

        setValidated(true);
        onSave(formData); // Call the save handler with the form data
    };

    const handleSave = () => {
        if (formRef.current) {
            const event = new Event("submit", { bubbles: true, cancelable: true });
            formRef.current.dispatchEvent(event);
        }
    };

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {isEdit ? "Editar Produto" : "Novo Produto"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form
                    noValidate
                    validated={validated}
                    onSubmit={handleSubmit}
                    ref={formRef}
                >
                    <Form.Group className="mb-3">
                        <Form.Label>Nome</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name || ""}
                            onChange={handleInputChange}
                            placeholder="Digite o nome do produto"
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Por favor, insira um nome válido.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Quantidade</Form.Label>
                        <Form.Control
                            type="number"
                            name="quantity"
                            value={formData.quantity || ""}
                            onChange={handleInputChange}
                            placeholder="Digite a quantidade"
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Por favor, insira uma quantidade válida.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Descrição</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="description"
                            value={formData.description || ""}
                            onChange={handleInputChange}
                            placeholder="Digite a descrição do produto"
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Por favor, insira uma descrição válida.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Preço (Custo)</Form.Label>
                        <Form.Control
                            type="number"
                            step="0.01"
                            name="costPrice"
                            value={formData.costPrice || ""}
                            onChange={handleInputChange}
                            placeholder="Digite o preço de custo"
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Por favor, insira um preço de custo válido.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Preço (Venda)</Form.Label>
                        <Form.Control
                            type="number"
                            step="0.01"
                            name="salePrice"
                            value={formData.salePrice || ""}
                            onChange={handleInputChange}
                            placeholder="Digite o preço de venda"
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Por favor, insira um preço de venda válido.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Marca / Fabricante</Form.Label>
                        <Form.Control
                            type="text"
                            name="brandManufacturer"
                            value={formData.brandManufacturerName || ""}
                            onChange={handleInputChange}
                            placeholder="Digite a marca ou fabricante"
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Por favor, insira uma marca ou fabricante válida.
                        </Form.Control.Feedback>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cancelar
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    Salvar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ProductModal;