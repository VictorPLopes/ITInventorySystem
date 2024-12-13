interface Client {
    id?: number;
    idDoc: string;
    name: string;
    email: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    phoneNumber: string;
    createdAt?: string;
    updatedAt?: string | null;
}

export default Client;