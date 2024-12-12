interface User {
    id?: number;
    name: string;
    email: string;
    password?: string;
    type: number;
    status: boolean;
    createdAt?: string;
    updatedAt?: string | null;
}

export default User;