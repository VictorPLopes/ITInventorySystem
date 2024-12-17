import React, {useRef, useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import Client from "../types/Client";

interface ClientModalProps {
    show: boolean;
    onClose: () => void;
    onSave: (client: Partial<Client>) => void;
    client: Partial<Client>;
}

export const ClientModal: React.FC<ClientModalProps> = ({
                                                            show,
                                                            onClose,
                                                            onSave,
                                                            client,
                                                        }) => {
    const [formData, setFormData] = useState<Partial<Client>>(client);
    const [validated, setValidated] = useState(false);
    const [cepError, setCepError] = useState<string>(""); // Para mensagens de erro relacionadas ao CEP
    const [docError, setDocError] = useState<string>(""); // Para mensagens de erro relacionadas ao CPF/CNPJ
    const formRef = useRef<HTMLFormElement>(null);

    const isEdit = Boolean(client.id);

    const brazilianStates = [
        "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
        "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
        "RS", "RO", "RR", "SC", "SP", "SE", "TO",
    ];

    // Função para formatar CPF ou CNPJ
    const formatCPFOrCNPJ = (value: string) => {
        const numbers = value.replace(/\D/g, "");
        return numbers.length <= 11
            ? numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4").substring(0, 14)
            : numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5").substring(0, 18);
    };

    // Função para formatar CEP
    const formatCEP = (value: string) => {
        const numbers = value.replace(/\D/g, "");
        return numbers.replace(/(\d{5})(\d{3})/, "$1-$2").substring(0, 9);
    };

    // Função para formatar telefone
    const formatPhone = (value: string) => {
        const numbers = value.replace(/\D/g, "");
        return numbers.length <= 12
            ? numbers.replace(/(\d{2})(\d{2})(\d{4})(\d{0,4})/, "+$1 ($2) $3-$4").substr(0, 18)
            : numbers.replace(/(\d{2})(\d{2})(\d{5})(\d{0,4})/, "+$1 ($2) $3-$4").substr(0, 19);
    };

    // Validações de CPF
    const isValidCPF = (cpf: string) => {
        if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpf.charAt(9))) return false;

        sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += parseInt(cpf.charAt(i)) * (11 - i);
        }
        remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        return remainder === parseInt(cpf.charAt(10));
    };

    // Validações de CNPJ
    const isValidCNPJ = (cnpj: string) => {
        if (cnpj.length !== 14) return false;

        let length = cnpj.length - 2;
        let numbers = cnpj.substring(0, length);
        let digits = cnpj.substring(length);
        let sum = 0;
        let pos = length - 7;

        for (let i = length; i >= 1; i--) {
            sum += parseInt(numbers.charAt(length - i)) * pos--;
            if (pos < 2) pos = 9;
        }

        let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
        if (result !== parseInt(digits.charAt(0))) return false;

        length += 1;
        numbers = cnpj.substring(0, length);
        sum = 0;
        pos = length - 7;

        for (let i = length; i >= 1; i--) {
            sum += parseInt(numbers.charAt(length - i)) * pos--;
            if (pos < 2) pos = 9;
        }

        result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
        return result === parseInt(digits.charAt(1));
    };

    const validateCPFOrCNPJ = (idDoc: string) => {
        const cleaned: string = idDoc.replace(/\D/g, "");
        if (isValidCPF(cleaned) || isValidCNPJ(cleaned)) {
            setDocError("");
            return true;
        } else {
            setDocError("CPF ou CNPJ inválido.");
            return false;
        }
    };

    // Busca endereço baseado no CEP
    const fetchAddressByCep = async (cep: string) => {
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();

            if (data.erro) {
                setCepError("CEP não encontrado.");
                return;
            }

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

    // Manipulação das mudanças nos campos
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | any>) => {
        const {name, value} = e.target;
        setFormData((prev) => {
            let formattedValue = value;

            if (name === "idDoc") {
                validateCPFOrCNPJ(value);
                formattedValue = formatCPFOrCNPJ(value);
            } else if (name === "postalCode") {
                formattedValue = formatCEP(value);
                if (formattedValue.length === 9) {
                    fetchAddressByCep(formattedValue.replace(/\D/g, ""));
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

    // Validações antes de enviar o formulário
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation();

        const idDocValid = !docError && formData.idDoc;
        const cepValid = !cepError && formData.postalCode;

        if (!idDocValid || !cepValid || !formRef.current?.checkValidity()) {
            setValidated(true);
            return;
        }

        const cleanedData = {
            ...formData,
            idDoc: formData.idDoc?.replace(/\D/g, ""),
            postalCode: formData.postalCode?.replace(/\D/g, ""),
            phoneNumber: formData.phoneNumber?.replace(/\D/g, ""),
        };

        setValidated(true);
        onSave(cleanedData);
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
                            isInvalid={validated && (docError !== "" || !formData.idDoc)}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Documento inválido.
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
                            isInvalid={validated && (cepError !== "" || !formData.postalCode)}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            {cepError || "Por favor, insira um CEP válido."}
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
                        <Form.Label>Telefone (Código do País + DDD + Número)</Form.Label>
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