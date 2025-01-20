import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

interface ReportDownloadModalProps {
    show: boolean;
    reportType: string | null;
    onClose: () => void;
    onDownload: (startDate: string, endDate: string) => void;
}

const ReportDownloadModal = ({ show, reportType, onClose, onDownload }: ReportDownloadModalProps) => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const handleDownload = () => {
        if (!startDate || !endDate) {
            alert("Por favor, selecione um período válido.");
            return;
        }
        onDownload(startDate, endDate);
    };

    // Mapear os tipos de relatório para um nome mais amigável
    const reportTitle = reportType === "stock-movement" ? "Movimentação de Estoque" :
        reportType === "work-orders" ? "Ordens de Serviço" :
            "Relatório";

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title className="w-100 text-center">
                    <div>📅 Selecionar período para:</div>
                    <div className="fw-bold">{reportTitle}</div>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group controlId="startDate">
                    <Form.Label>Data Inicial</Form.Label>
                    <Form.Control
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId="endDate" className="mt-3">
                    <Form.Label>Data Final</Form.Label>
                    <Form.Control
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cancelar
                </Button>
                <Button variant="primary" onClick={handleDownload} disabled={!startDate || !endDate}>
                    📥 Baixar {reportTitle}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ReportDownloadModal;
