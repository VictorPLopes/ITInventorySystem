import React, {useState} from "react";
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
    const [errors, setErrors] = useState<Record<string, string>>({}); // Gerencia os erros por campo
    const [categories] = useState<string[]>([
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
    ]);
    const [isCustomCategory, setIsCustomCategory] = useState(false);
    const [customCategory, setCustomCategory] = useState<string>("");

    const validateFields = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name || formData.name.trim() === "") {
            newErrors.name = "O nome é obrigatório.";
        }

        if (formData.quantity == null || formData.quantity < 0) {
            newErrors.quantity = "A quantidade deve ser maior ou igual a zero.";
        }

        if (formData.costPrice == null || formData.costPrice < 0) {
            newErrors.costPrice = "O preço de custo deve ser maior ou igual a zero.";
        }

        if (formData.salePrice == null || formData.salePrice < 0) {
            newErrors.salePrice = "O preço de venda deve ser maior ou igual a zero.";
        }

        if (!formData.category || formData.category.trim() === "") {
            newErrors.category = "A categoria é obrigatória.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const {name, value} = e.target;

        // Remove erros do campo corrigido
        setErrors((prev) => ({...prev, [name]: ""}));

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCustomCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setCustomCategory(value);

        // Atualiza o valor no formData
        setErrors((prev) => ({...prev, category: ""})); // Remove erros do campo de categoria
        setFormData((prev) => ({
            ...prev,
            category: value,
        }));
    };

    const handleCategorySelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;

        if (value === "custom") {
            setIsCustomCategory(true); // Mostra o campo de input
            setFormData((prev) => ({...prev, category: ""})); // Reseta a categoria no formData
        } else {
            setIsCustomCategory(false); // Esconde o campo de input
            setErrors((prev) => ({...prev, category: ""})); // Remove erros de categoria
            setFormData((prev) => ({...prev, category: value})); // Define a categoria selecionada
        }
    };

    const handleSave = () => {
        if (validateFields()) {
            onSave(formData); // Salva os dados apenas se estiverem válidos
        }
    };

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>{product.id ? "Editar Produto" : "Novo Produto"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Nome</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name || ""}
                            onChange={handleInputChange}
                            placeholder="Digite o nome do produto"
                            isInvalid={!!errors.name}
                        />
                        <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Quantidade</Form.Label>
                        <Form.Control
                            type="number"
                            name="quantity"
                            value={formData.quantity || ""}
                            onChange={handleInputChange}
                            placeholder="Digite a quantidade"
                            isInvalid={!!errors.quantity}
                        />
                        <Form.Control.Feedback type="invalid">{errors.quantity}</Form.Control.Feedback>
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
                            isInvalid={!!errors.category}
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
                                isInvalid={!!errors.category}
                            />
                        )}
                        <Form.Control.Feedback type="invalid">{errors.category}</Form.Control.Feedback>
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
                            isInvalid={!!errors.costPrice}
                        />
                        <Form.Control.Feedback type="invalid">{errors.costPrice}</Form.Control.Feedback>
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
                            isInvalid={!!errors.salePrice}
                        />
                        <Form.Control.Feedback type="invalid">{errors.salePrice}</Form.Control.Feedback>
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
