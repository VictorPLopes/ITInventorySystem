import React, {useRef, useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import Client from "../types/Client";

interface ClientModalProps {
    show: boolean;
    onClose: () => void;
    onSave: (client: Partial<Client>) => void;
    client: Partial<Client>;
}

export const ClientModal: React.FC<ClientModalProps> = ({show, onClose, onSave, client}) => {
    const [formData, setFormData] = useState<Partial<Client>>(client);
    const [validated, setValidated] = useState(false);
    const [cepError, setCepError] = useState<string>(""); // Para mensagens de erro relacionadas ao CEP
    const formRef = useRef<HTMLFormElement>(null);

    const isEdit = Boolean(client.id);

    const brazilianStates = [
        "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
        "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
        "RS", "RO", "RR", "SC", "SP", "SE", "TO",
    ];

    // Formatters
    const formatCPFOrCNPJ = (value: string) => {
        // Remove todos os caracteres que não são números
        const numbers = value.replace(/\D/g, "");

        if (numbers.length <= 11) {
            // Limita ao formato CPF e impede mais de 11 números
            return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4").substring(0, 14);
        }

        // Limita ao formato CNPJ e impede mais de 14 números
        return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5").substring(0, 18);
    };

    const formatCEP = (value: string) => {
        const numbers = value.replace(/\D/g, "");
        return numbers.replace(/(\d{5})(\d{3})/, "$1-$2").substring(0, 9);
    };

    const formatPhone = (value: string) => {
        // Remove todos os caracteres que não são números
        const numbers = value.replace(/\D/g, "");

        if (numbers.length <= 10) {
            // Formato para telefones fixos: +XX XXXX-XXXX
            return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, "+$1 $2-$3").substr(0, 15);
        }

        // Formato para telefones móveis: +XX XXXXX-XXXX
        return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, "+$1 $2-$3").substr(0, 16);
    };

    const fetchAddressByCep = async (cep: string) => {
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();

            if (data.erro) {
                setCepError("CEP não encontrado.");
                return;
            }

            // Atualiza os campos de endereço automaticamente
            setFormData((prev) => ({
                ...prev,
                street: data.logradouro || "",
                city: data.localidade || "",
                state: data.uf || "",
            }));
            setCepError(""); // Limpa o erro
        } catch (error) {
            setCepError("Erro ao buscar o endereço. Tente novamente.");
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | any>) => {
        const {name, value} = e.target;
        setFormData((prev) => {
            let formattedValue = value;

            if (name === "idDoc") {
                formattedValue = formatCPFOrCNPJ(value);
            } else if (name === "postalCode") {
                formattedValue = formatCEP(value);
                formattedValue = formatCEP(value);
                if (formattedValue.length === 9) {
                    fetchAddressByCep(formattedValue.replace(/\D/g, "")); // Busca o endereço ao completar o CEP
                }
            } else if (name === "phoneNumber") {
                formattedValue = formatPhone(value);
            }

            return {
                ...prev,
                [name]: formattedValue,
            };
        });
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();

        if (!form.checkValidity()) {
            setValidated(true);
            return;
        }

        // Clean up formatted fields before saving
        const cleanedData = {
            ...formData,
            idDoc: formData.idDoc?.replace(/\D/g, ""), // Only numbers
            postalCode: formData.postalCode?.replace(/\D/g, ""), // Only numbers
            phoneNumber: formData.phoneNumber?.replace(/\D/g, ""), // Only numbers
        };

        setValidated(true);
        onSave(cleanedData); // Pass cleaned data to onSave
    };

    const handleSave = () => {
        if (formRef.current) {
            const event = new Event("submit", {bubbles: true, cancelable: true});
            formRef.current.dispatchEvent(event);
        }
    };

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>{isEdit ? "Editar Cliente" : "Novo Cliente"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form noValidate validated={validated} onSubmit={handleSubmit} ref={formRef}>
                    <Form.Group className="mb-3">
                        <Form.Label>Documento</Form.Label>
                        <Form.Control
                            type="text"
                            name="idDoc"
                            value={formData.idDoc || ""}
                            onChange={handleInputChange}
                            placeholder="Digite o CPF ou CNPJ"
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Por favor, insira um documento válido.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Nome</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name || ""}
                            onChange={handleInputChange}
                            placeholder="Digite o nome"
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Por favor, insira um nome válido.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>E-mail</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={formData.email || ""}
                            onChange={handleInputChange}
                            placeholder="Digite o e-mail"
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Por favor, insira um e-mail válido.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>CEP</Form.Label>
                        <Form.Control
                            type="text"
                            name="postalCode"
                            value={formData.postalCode || ""}
                            onChange={handleInputChange}
                            placeholder="Digite o CEP"
                            required
                        />
                        {cepError && <div className="text-danger">{cepError}</div>}
                        <Form.Control.Feedback type="invalid">
                            Por favor, insira um CEP válido.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Endereço</Form.Label>
                        <Form.Control
                            type="text"
                            name="street"
                            value={formData.street || ""}
                            onChange={handleInputChange}
                            placeholder="Digite o endereço"
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Por favor, insira um endereço válido.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Cidade</Form.Label>
                        <Form.Control
                            type="text"
                            name="city"
                            value={formData.city || ""}
                            onChange={handleInputChange}
                            placeholder="Digite a cidade"
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Por favor, insira uma cidade válida.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Estado</Form.Label>
                        <Form.Select
                            name="state"
                            value={formData.state || ""}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Selecione um estado</option>
                            {brazilianStates.map((state) => (
                                <option key={state} value={state}>
                                    {state}
                                </option>
                            ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            Por favor, selecione um estado válido.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Telefone (DDD + Número)</Form.Label>
                        <Form.Control
                            type="text"
                            name="phoneNumber"
                            value={formData.phoneNumber || ""}
                            onChange={handleInputChange}
                            placeholder="Digite o telefone"
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Por favor, insira um telefone válido.
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
