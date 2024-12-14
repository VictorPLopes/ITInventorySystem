import {useEffect, useState, useCallback} from "react";
import axios from "../AxiosConfig";
import Swal from "sweetalert2";
import toast, {Toaster} from "react-hot-toast";
import {Button, Col, Container, Row, Spinner} from "react-bootstrap";
import {MdCompareArrows} from "react-icons/md";
import {GenericTable} from "../components/GenericTable";
import {ProductModal} from "../components/ProductModal";
import {InOutModal} from "../components/InOutModal";
import Product from "../types/Product";

const API_ENDPOINTS = {
    inventoryPage: (port: string) => `https://localhost:${port}/auth/inventory-page`,
    products: (port: string) => `https://localhost:${port}/products`,
    inOutProduct: (port: string, productId: number) =>
        `https://localhost:${port}/products/${productId}/in-out`,
};

const InventoryPage = ({port}: { port: string }) => {
    // Page state management
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});
    const [isEdit, setIsEdit] = useState(false);
    const [showInOutModal, setShowInOutModal] = useState(false);
    const [hasAccess, setHasAccess] = useState<boolean | null>(null);

    const columns = [
        {title: "ID", data: "id"},
        {title: "Nome", data: "name"},
        {title: "Quantidade", data: "quantity"},
        {title: "Descrição", data: "description"},
        {title: "Preço (Custo)", data: "costPrice"},
        {title: "Preço (Venda)", data: "salePrice"},
        {title: "Marca / Fabricante", data: "brandManufacturerName"},
        {title: "Ações", name: "actions"},
    ];

    // Check access to the products page
    useEffect(() => {
        const checkAccess = async () => {
            try {
                await axios.get(API_ENDPOINTS.inventoryPage(port));
                setHasAccess(true);
            } catch {
                setHasAccess(false);
            }
        };

        checkAccess();
    }, [port]);

    // Fetch products from the server
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
        if (hasAccess) fetchProducts();
    }, [hasAccess, fetchProducts]);

    // Open modal to add a new product
    const handleAddProduct = () => {
        setCurrentProduct({
            id: 0,
            name: "",
            quantity: 0,
            description: "",
            costPrice: 0,
            salePrice: 0,
            brandManufacturerName: "",
        });
        setIsEdit(false);
        setShowModal(true);
    };

    // Open modal to edit an existing product
    const handleEditProduct = (product: Product) => {
        setCurrentProduct(product);
        setIsEdit(true);
        setShowModal(true);
    };

    // Open modal for product in/out operations
    const handleInOutProduct = (product: Product) => {
        setCurrentProduct(product);
        setShowInOutModal(true);
    };

    // Delete a product with confirmation
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

    // Save a new or edited product
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

    // Save product in/out operations
    const handleSaveInOut = async (productId: number, quantity: number) => {
        const product = products.find((p) => p.id === productId);

        if (!product) {
            toast.error("Produto não encontrado.");
            return;
        }

        // Check if it's an exit and there's enough quantity
        if (quantity < 0 && product.quantity + quantity < 0) {
            toast.error("Quantidade insuficiente para saída.");
            return;
        }

        try {
            // Update the product quantity directly
            const updatedProducts = products.map((p) =>
                p.id === productId ? { ...p, quantity: p.quantity + quantity } : p
            );
            setProducts(updatedProducts);

            toast.success("Movimentação realizada com sucesso!");
            setShowInOutModal(false);
        } catch {
            toast.error("Erro ao realizar a movimentação.");
        }
    };

    return (
        <Container className="mt-4">
            <Toaster position="top-right"/>
            <Row>
                <Col>
                    <h2 className="mb-4">Produtos Registrados</h2>
                </Col>
            </Row>
            {hasAccess === null ? (
                <p>Carregando...</p>
            ) : hasAccess ? (
                <>
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
                                    style={{minHeight: "300px"}}
                                >
                                    <Spinner animation="border" role="status" variant="primary"/>
                                </div>
                            ) : (
                                <div className="p-4 rounded shadow-lg bg-body-tertiary">
                                    <GenericTable
                                        data={products}
                                        columns={columns}
                                        actions={{
                                            onEdit: handleEditProduct,
                                            onDelete: handleDeleteProduct,
                                            onExtra: handleInOutProduct,
                                        }}
                                        extraAction={<MdCompareArrows/>}
                                    />
                                </div>
                            )}
                        </Col>
                    </Row>
                </>
            ) : (
                <p>Erro ao acessar a página de produtos. Verifique sua autenticação.</p>
            )}
            {showModal && (
                <ProductModal
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    onSave={handleSaveProduct}
                    product={currentProduct}
                />
            )}
            {showInOutModal && (
                <InOutModal
                    show={showInOutModal}
                    onClose={() => setShowInOutModal(false)}
                    onSave={handleSaveInOut}
                    product={{id: currentProduct.id as number}}
                />
            )}
        </Container>
    );
};

export default InventoryPage;