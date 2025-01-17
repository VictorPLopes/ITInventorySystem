export const formatPhone = (phone: string) =>
    phone.length < 11
        ? phone.replace(/\D/g, "").replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3").slice(0, 15)
        : phone.replace(/\D/g, "").replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3").slice(0, 16);

export const formatCep = (cep: string) => cep.replace(/\D/g, "").replace(/(\d{5})(\d{3})/, "$1-$2").slice(0, 9);

export const formatDoc = (doc: string) =>
    doc.length <= 11
        ? doc.replace(/\D/g, "").replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4").slice(0, 14)
        : doc.replace(/\D/g, "").replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5").slice(0, 18);