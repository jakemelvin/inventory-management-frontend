import { apiClient } from "@/lib/axios"
import { CreateCategorieRequest, UpdateCategorieRequest, Categorie } from "@/types"

const BASE_URL = '/categories'

export const categorieServices = {
    getAll: async () => {
        const response = await apiClient.get<Categorie[]>(`${BASE_URL}/showAll`);
        return response.data;
    },
    
    create: async (data: CreateCategorieRequest) => {
        const response = await apiClient.post<Categorie>(`${BASE_URL}/create`, data);
        return response.data;
    },
    
    getById: async (id: Categorie['id']) => {
        const response = await apiClient.get<Categorie>(`${BASE_URL}/${id}`);
        return response.data;
    },
    
    getByCode: async (code: string) => {
        const response = await apiClient.get<Categorie>(`${BASE_URL}/code/${code}`);
        return response.data;
    },
    
    delete: async (id: Categorie['id']) => {
        const response = await apiClient.delete(`${BASE_URL}/delete/${id}`);
        return response.data;
    },
    
    update: async (id: Categorie['id'], data: UpdateCategorieRequest) => {
        const response = await apiClient.put<Categorie>(`${BASE_URL}/update/${id}`, data);
        return response.data;
    }
}
