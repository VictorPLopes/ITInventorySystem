import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {formatCep, formatDoc, formatPhone} from "./formatUtils.ts";
import axios from "../AxiosConfig";
import Client from "../types/Client";
import WorkOrder from "../types/WorkOrder.tsx";

// Função para gerar o relatório do cliente
export const generateClientReport = async (client: Client, port: string) => {
    try {
        // Busca as ordens de serviço do cliente
        const response = await axios.get(`https://localhost:${port}/work-orders?clientId=${client.id}`);
        const workOrders = response.data;

        // Criação do documento PDF
        const doc = new jsPDF();

        // Adiciona título do relatório
        doc.setFontSize(18);
        doc.text("Relatório do Cliente", 105, 15, { align: "center" });

        // Adiciona a tabela com informações do cliente
        const clientInfo = [
            ["Nome:", client.name],
            ["Documento:", formatDoc(client.idDoc)],
            ["E-mail:", client.email],
            ["Endereço:", `${client.street}, ${client.city}, ${client.state} - ${formatCep(client.postalCode)}`],
            ["Telefone:", formatPhone(client.phoneNumber)],
        ];

        autoTable(doc, {
            body: clientInfo,
            startY: 25,
            theme: "plain",
            styles: { fontSize: 12 },
            columnStyles: {
                0: { fontStyle: "bold", cellWidth: 40 },
                1: { cellWidth: 150 },
            },
        });

        // Adiciona espaço antes da tabela de ordens de serviço
        doc.text("Ordens de Serviço:", 10, doc.lastAutoTable.finalY + 10);

        // Configura a tabela de ordens de serviço
        const tableHeaders = ["ID", "Abertura", "Responsável", "Cliente", "Descrição", "Carga Horária", "Status"];
        const tableRows = workOrders.map((order: any) => [
            order.id,
            new Date(order.startDate).toLocaleDateString("pt-BR"), // Formato de data local
            order.userInChargeId,
            order.clientId,
            order.description,
            order.workHours,
            ["Concluída", "Em Andamento", "Pendente"][order.status] || "Desconhecido", // Formatação de status
        ]);

        autoTable(doc, {
            head: [tableHeaders],
            body: tableRows,
            startY: doc.lastAutoTable.finalY + 15,
            theme: "grid", // Estilo monocromático
            styles: { fontSize: 10, halign: "center" }, // Fonte menor e alinhamento central
            headStyles: { fillColor: [200, 200, 200], textColor: 0 }, // Cabeçalho cinza
            alternateRowStyles: { fillColor: [240, 240, 240] }, // Linhas alternadas
        });

        // Adiciona a data e hora da exportação no rodapé
        const exportDate = new Date().toLocaleString("pt-BR");
        doc.setFontSize(10);
        doc.text(`Exportado em: ${exportDate}`, 10, 290);

        // Salva o documento
        doc.save(`Relatorio_Cliente_${client.name.replace(/\s+/g, "_")}.pdf`);
    } catch (error) {
        console.error("Erro ao gerar o relatório do cliente:", error);
    }
};

// Função para gerar o relatório de uma ordem de serviço, com os dados do cliente, do responsável, da ordem e dos produtos utilizados
export const generateWorkOrderReport = async (workOrder: WorkOrder, port: string) => {
    // Busca os dados completos da ordem de serviço
    const response = await axios.get(`https://localhost:${port}/work-orders/${workOrder.id}`);
    const fullOrder = response.data;
    
    // Busca os dados do cliente e do responsável
    const client = fullOrder.client;
    const userInCharge = fullOrder.userInCharge;
    
    // Busca os produtos utilizados na ordem de serviço
    const products = fullOrder.products;
    
    // Criação do documento PDF
    const doc = new jsPDF();
    
    // Adiciona título do relatório
    doc.setFontSize(18);
    doc.text(`Ordem de Serviço nº${fullOrder.id}`, 105, 15, { align: "center" });
    
    // Adiciona a tabela com as informações da ordem de serviço
    const orderInfo = [
        ["Abertura:", new Date(fullOrder.startDate).toLocaleString("pt-BR")],
        ["Descrição:", fullOrder.description],
        ["Carga Horária:", fullOrder.workHours],
        ["Status:", ["Concluída", "Em Andamento", "Pendente"][fullOrder.status] || "Desconhecido"],
    ];
    
    autoTable(doc, {
        body: orderInfo,
        startY: 25,
        theme: "plain",
        styles: { fontSize: 12 },
        columnStyles: {
            0: { fontStyle: "bold", cellWidth: 40 },
            1: { cellWidth: 150 },
        },
    });
    
    // Adiciona a tabela com as informações do cliente
    const clientInfo = [
        ["Nome:", client.name],
        ["Documento:", formatDoc(client.idDoc)],
        ["E-mail:", client.email],
        ["Endereço:", `${client.street}, ${client.city}, ${client.state} - ${formatCep(client.postalCode)}`],
        ["Telefone:", formatPhone(client.phoneNumber.toString())],
    ];
    
    doc.setFontSize(14);
    doc.text("Informações do Cliente", 10, doc.lastAutoTable.finalY + 15);
    
    autoTable(doc, {
        body: clientInfo,
        startY: doc.lastAutoTable.finalY + 25,
        theme: "plain",
        styles: { fontSize: 12 },
        columnStyles: {
            0: { fontStyle: "bold", cellWidth: 40 },
            1: { cellWidth: 150 },
        },
    });
    
    // Adiciona a tabela com as informações do responsável
    const userInChargeInfo = [
        ["Nome:", userInCharge.name],
        ["E-mail:", userInCharge.email],
    ];
    
    doc.setFontSize(14);
    doc.text("Técnico Reponsável", 10, doc.lastAutoTable.finalY + 15);
    
    autoTable(doc, {
        body: userInChargeInfo,
        startY: doc.lastAutoTable.finalY + 25,
        theme: "plain",
        styles: { fontSize: 12 },
        columnStyles: {
            0: { fontStyle: "bold", cellWidth: 40 },
            1: { cellWidth: 150 },
        },
    });
    
    // Adiciona a tabela com os produtos utilizados
    doc.setFontSize(14);
    doc.text("Produtos Utilizados", 10, doc.lastAutoTable.finalY + 15);
    
    const productsHeaders = ["ID", "Nome", "Descrição", "Preço", "Quantidade Utilizada"];
    const productsRows = products.map((product: any) => [
        product.productId,
        product.product.name,
        product.product.description,
        `R$ ${product.product.salePrice.toFixed(2)}`,
        product.quantity,
    ]);
    
    autoTable(doc, {
        head: [productsHeaders],
        body: productsRows,
        startY: doc.lastAutoTable.finalY + 25,
        theme: "grid",
        styles: { fontSize: 10, halign: "center" },
        headStyles: { fillColor: [200, 200, 200], textColor: 0 },
        alternateRowStyles: { fillColor: [240, 240, 240] },
    });
    
    // Adiciona a data e hora da exportação no rodapé
    const exportDate = new Date().toLocaleString("pt-BR");
    doc.setFontSize(10);
    doc.text(`Exportado em: ${exportDate}`, 10, 290);
    
    // Salva o documento
    doc.save(`Ordem_de_Servico_${fullOrder.id}.pdf`);
};