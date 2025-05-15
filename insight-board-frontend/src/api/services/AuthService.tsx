import { api } from "../Api";

export const login = async (email: string, password: string): Promise<string> => {
    const res = await api.post('/auth/login', { email, password });
    return res.data.token;
};

export const register = async (email: string, password: string): Promise<string> => {
    const res = await api.post('/auth/register', { email, password });
    return res.data.token;
};
