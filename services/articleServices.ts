import { apiClient } from "@/lib/axios"
import { CreateArticleRequest, UpdateArticleRequest, Article } from "@/types"

const BASE_URL = '/articles'

export const articleServices = {
    getAll: async () => {
        const response = await apiClient.get<Article[]>(`${BASE_URL}/showAll`);
        return response.data;
    },
    
    create: async (data: CreateArticleRequest) => {
        const formData = new FormData();
        
        const queryParams = new URLSearchParams({
            codeArticle: data.codeArticle,
            designation: data.designation,
            categorieId: data.categorieId.toString(),
            entrepriseId: data.entrepriseId.toString(),
            prixUnitaire: data.prixUnitaire.toString(),
            tauxTva: data.tauxTva.toString(),
            prixUnitaireTtc: data.prixUnitaireTtc.toString(),
        });
        
        if (data.image) {
            formData.append('image', data.image);
        }
        
        const response = await apiClient.post<Article>(
            `${BASE_URL}/create?${queryParams.toString()}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data;
    },
    
    getById: async (id: Article['id']) => {
        const response = await apiClient.get<Article>(`${BASE_URL}/id/${id}`);
        return response.data;
    },
    
    getByCode: async (code: string) => {
        const response = await apiClient.get<Article>(`${BASE_URL}/code/${code}`);
        return response.data;
    },
    
    delete: async (id: Article['id']) => {
        const response = await apiClient.delete(`${BASE_URL}/delete/${id}`);
        return response.data;
    },
    
    update: async (id: Article['id'], data: UpdateArticleRequest) => {
        const formData = new FormData();
        
        const queryParams = new URLSearchParams({
            codeArticle: data.codeArticle,
            designation: data.designation,
            categorieId: data.categorieId.toString(),
            entrepriseId: data.entrepriseId.toString(),
            prixUnitaire: data.prixUnitaire.toString(),
            tauxTva: data.tauxTva.toString(),
            prixUnitaireTtc: data.prixUnitaireTtc.toString(),
        });
        
        if (data.image) {
            formData.append('image', data.image);
        }
        
        const response = await apiClient.put<Article>(
            `${BASE_URL}/update/${id}?${queryParams.toString()}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data;
    }
}
