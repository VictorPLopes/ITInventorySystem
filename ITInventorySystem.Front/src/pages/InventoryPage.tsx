import {useCallback, useEffect, useState} from "react";
import axios from "../AxiosConfig";
import Swal from "sweetalert2";
import toast, {Toaster} from "react-hot-toast";
import {Button, Col, Container, Row, Spinner} from "react-bootstrap";
import {MdCompareArrows} from "react-icons/md";
import {GenericTable} from "../components/GenericTable";
import {ProductModal} from "../components/ProductModal";
import Product from "../types/Product";

const API_ENDPOINTS = {
    inventoryPage: (port: string) => `https://localhost:${port}/auth/inventory-page`,
    products: (port: string) => `https://localhost:${port}/products`,
};

const InventoryPage = ({port}: { port: string }) => {
    // Estados principais da página
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});
    const [isEdit, setIsEdit] = useState(false);
    const [hasAccess, setHasAccess] = useState<boolean | null>(null);

    const columns = [
        {title: "ID", data: "id"},
        {title: "Nome", data: "name"},
        {title: "Quantidade", data: "quantity"},
        {title: "Descrição", data: "description"},
        {
            title: "Preço (Custo)",
            data: "costPrice",
            render: (data: number) => `R$ ${data.toFixed(2)}`,
        },
        {
            title: "Preço (Venda)",
            data: "salePrice",
            render: (data: number) => `R$ ${data.toFixed(2)}`,
        },
        {title: "Marca / Fabricante", data: "brandManufacturerName"},
        {title: "Ações", name: "actions"},
    ];

    // Verifica o acesso do usuário e busca os dados iniciais
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

    // Busca os produtos registrados
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

    // Abre o modal para adicionar um novo produto
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

    // Abre o modal para editar um produto existente
    const handleEditProduct = (product: Product) => {
        setCurrentProduct(product);
        setIsEdit(true);
        setShowModal(true);
    };
   

    // Exclui um produto com confirmação
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

    // Salva as alterações de um produto (novo ou existente)
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
                                <div
                                    className="table-container p-4 rounded shadow-lg bg-body-tertiary"
                                    style={{overflowX: "auto", width: "100%"}}
                                >
                                    <GenericTable
                                        data={products}
                                        columns={columns}
                                        actions={{
                                            onEdit: handleEditProduct,
                                            onDelete: handleDeleteProduct,
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
        </Container>
    );
};

export default InventoryPage;