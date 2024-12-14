import { useEffect, useState, useCallback } from "react";
import axios from "../AxiosConfig";
import Swal from "sweetalert2";
import toast, { Toaster } from "react-hot-toast";
import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import { GenericTable } from "../components/GenericTable";
import { ProductModal } from "../components/ProductsModal";
import Product from "../types/Product";

const API_ENDPOINTS = {
    products: (port: string) => `https://localhost:${port}/products`,
};

const ProductsPage = ({ port }: { port: string }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});
    const [isEdit, setIsEdit] = useState(false);

    const columns = [
        { title: "ID", data: "id" },
        { title: "Nome", data: "name" },
        { title: "Categoria", data: "category" },
        { title: "Descrição", data: "description" },
        { title: "Quantidade", data: "quantity" },
        { title: "Preço de Custo", data: "costPrice" },
        { title: "Preço de Venda", data: "salePrice" },
        { title: "Marca/Fabricante", data: "brandManufacturerName" },
        { title: "Ações", name: "actions" },
    ];

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(API_ENDPOINTS.products(port));
            setProducts(response.data);
        } catch {
            toast.error("Erro ao buscar os produtos.");
        } finally {
            setLoading(false);
        }
    }, [port]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleAddProduct = () => {
        setCurrentProduct({
            id: 0,
            name: "",
            quantity: 0,
            description: "",
            category: "",
            costPrice: 0,
            salePrice: 0,
            brandManufacturerName: "",
        });
        setIsEdit(false);
        setShowModal(true);
    };

    const handleEditProduct = (product: Product) => {
        setCurrentProduct(product);
        setIsEdit(true);
        setShowModal(true);
    };

    const handleDeleteProduct = async (product: Product) => {
        const confirmed = await Swal.fire({
            title: "Tem certeza?",
            text: "Você não poderá desfazer esta ação!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sim, excluir!",
            cancelButtonText: "Cancelar",
        });

        if (confirmed.isConfirmed) {
            try {
                await axios.delete(`${API_ENDPOINTS.products(port)}/${product.id}`);
                toast.success("Produto excluído com sucesso!");
                await fetchProducts();
            } catch {
                toast.error("Erro ao excluir o produto.");
            }
        }
    };

    const handleSaveProduct = async (product: Partial<Product>) => {
        const endpoint = isEdit
            ? `${API_ENDPOINTS.products(port)}/${product.id}`
            : API_ENDPOINTS.products(port);
        const method = isEdit ? "put" : "post";

        try {
            await axios[method](endpoint, product);
            toast.success("Produto salvo com sucesso!");
            setShowModal(false);
            await fetchProducts();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Erro ao salvar o produto.");
        }
    };

    return (
        <Container className="mt-4">
            <Toaster position="top-right" />
            <Row>
                <Col>
                    <h2 className="mb-4">Produtos Registrados</h2>
                </Col>
            </Row>
            <Row className="mb-4">
                <Col className="text-end">
                    <Button variant="success" onClick={handleAddProduct}>
                        + Novo Produto
                    </Button>
                </Col>
            </Row>
            <Row>
                <Col>
                    {loading ? (
                        <div
                            className="d-flex justify-content-center align-items-center"
                            style={{ minHeight: "300px" }}
                        >
                            <Spinner animation="border" role="status" variant="primary" />
                        </div>
                    ) : (
                        <div className="p-4 rounded shadow-lg bg-body-tertiary">
                            <GenericTable
                                data={products}
                                columns={columns}
                                actions={{
                                    onEdit: handleEditProduct,
                                    onDelete: handleDeleteProduct,
                                }}
                            />
                        </div>
                    )}
                </Col>
            </Row>
            {showModal && (
                <ProductModal
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    onSave={handleSaveProduct}
                    product={currentProduct}
                />
            )}
        </Container>
    );
};

export default ProductsPage;
