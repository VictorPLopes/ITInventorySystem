import React, {useRef, useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import Product from "../types/Product";

interface ProductModalProps {
    show: boolean;
    onClose: () => void;
    onSave: (product: Partial<Product>) => void;
    product: Partial<Product>;
}

export const ProductModal: React.FC<ProductModalProps> = ({show, onClose, onSave, product}) => {
    const [formData, setFormData] = useState<Partial<Product>>(product);
    const [validated, setValidated] = useState(false);
    const [isCustomCategory, setIsCustomCategory] = useState(false);
    const [customCategory, setCustomCategory] = useState<string>("");
    const formRef = useRef<HTMLFormElement>(null);

    // Lista de categorias disponíveis
    const categories = [
        "Desktops",
        "Notebooks",
        "Monitores",
        "Teclados",
        "Mouses",
        "Impressoras",
        "Acessórios de Rede",
        "Memória RAM",
        "SSD",
        "Placa de vídeo",
        "Processadores",
        "Fontes de Energia",
        "Gabinetes",
    ];

    // Atualiza os campos do formulário
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "quantity" ? Math.max(0, parseInt(value) || 0) : value,
            [name]: name === "costPrice" || name === "salePrice" ? Math.max(0, parseFloat(value) || 0) : value,
        }));
    };

    // Manipula a categoria personalizada
    const handleCustomCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setCustomCategory(value);

        // Atualiza o formData com a categoria personalizada
        setFormData((prev) => ({
            ...prev,
            category: value,
        }));
    };

    // Seleção de categoria (padrão ou personalizada)
    const handleCategorySelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;

        if (value === "custom") {
            setIsCustomCategory(true); // Mostra o campo para categoria personalizada
            setFormData((prev) => ({...prev, category: ""})); // Limpa a categoria anterior
        } else {
            setIsCustomCategory(false); // Esconde o campo personalizado
            setFormData((prev) => ({...prev, category: value})); // Atualiza com a categoria selecionada
        }
    };

    // Valida os campos antes de salvar
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation();

        if (formRef.current?.checkValidity()) {
            onSave(formData); // Salva os dados somente se válidos
        } else {
            setValidated(true);
        }
    };

    // Simula o envio do formulário para forçar a validação
    const handleSave = () => {
        if (formRef.current) {
            const event = new Event("submit", {bubbles: true, cancelable: true});
            formRef.current.dispatchEvent(event);
        }
    };

    const isEdit = Boolean(product.id);

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>{isEdit ? "Editar Produto" : "Novo Produto"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form noValidate validated={validated} onSubmit={handleSubmit} ref={formRef}>
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
                            min="0"
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
                            placeholder="Digite a descrição"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Categoria</Form.Label>
                        <Form.Select
                            value={isCustomCategory ? "custom" : formData.category || ""}
                            onChange={handleCategorySelection}
                            required
                        >
                            <option value="">Selecione uma categoria</option>
                            {categories.map((category, index) => (
                                <option key={index} value={category}>
                                    {category}
                                </option>
                            ))}
                            <option value="custom">Inserir categoria manualmente</option>
                        </Form.Select>
                        {isCustomCategory && (
                            <Form.Control
                                className="mt-3"
                                type="text"
                                placeholder="Digite a nova categoria"
                                value={customCategory}
                                onChange={handleCustomCategoryChange}
                                required
                            />
                        )}
                        <Form.Control.Feedback type="invalid">
                            Por favor, insira uma categoria válida.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Preço de Custo</Form.Label>
                        <Form.Control
                            type="number"
                            step="0.01"
                            name="costPrice"
                            value={formData.costPrice || ""}
                            onChange={handleInputChange}
                            placeholder="Digite o preço de custo"
                            min="0"
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Por favor, insira um preço de custo válido.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Preço de Venda</Form.Label>
                        <Form.Control
                            type="number"
                            step="0.01"
                            name="salePrice"
                            value={formData.salePrice || ""}
                            onChange={handleInputChange}
                            placeholder="Digite o preço de venda"
                            min="0"
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Por favor, insira um preço de venda válido.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Marca/Fabricante</Form.Label>
                        <Form.Control
                            type="text"
                            name="brandManufacturerName"
                            value={formData.brandManufacturerName || ""}
                            onChange={handleInputChange}
                            placeholder="Digite o nome da marca/fabricante"
                        />
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
