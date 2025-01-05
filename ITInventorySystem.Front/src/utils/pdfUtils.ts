import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {formatCep, formatDoc, formatPhone} from "./formatUtils.ts";
import axios from "../AxiosConfig";
import Client from "../types/Client";

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
