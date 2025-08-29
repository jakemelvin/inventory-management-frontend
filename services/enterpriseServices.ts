import { apiClient } from "@/lib/axios"
import { CreateEnterpriseRequest, UpdateEnterpriseRequest, Enterprise } from "@/types"

const BASE_URL = '/entreprises'

export const enterpriseServices = {
    getAll: async () => {
        const response = await apiClient.get<Enterprise[]>(`${BASE_URL}/showAll`);
        return response.data;
    },
    
    create: async (data: CreateEnterpriseRequest) => {
        const formData = new FormData();
        
        const queryParams = new URLSearchParams({
            nomEntreprise: data.nomEntreprise,
            description: data.description,
            email: data.email,
            adresse1: data.adresse1,
            ville: data.ville,
            codePostal: data.codePostal,
            pays: data.pays,
            codeFiscal: data.codeFiscal,
            numTel: data.numTel,
            steWeb: data.steWeb,
        });
        
        if (data.adresse2) {
            queryParams.append('adresse2', data.adresse2);
        }
        
        if (data.photo) {
            formData.append('photo', data.photo);
        }
        
        const response = await apiClient.post<Enterprise>(
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
    
    getById: async (id: Enterprise['id']) => {
        const response = await apiClient.get<Enterprise>(`${BASE_URL}/${id}`);
        return response.data;
    },
    
    delete: async (id: Enterprise['id']) => {
        const response = await apiClient.delete(`${BASE_URL}/delete/${id}`);
        return response.data;
    },
    
    update: async (id: Enterprise['id'], data: UpdateEnterpriseRequest) => {
        const formData = new FormData();
        
        const queryParams = new URLSearchParams({
            nomEntreprise: data.nomEntreprise,
            description: data.description,
            email: data.email,
            adresse1: data.adresse1,
            ville: data.ville,
            codePostal: data.codePostal,
            pays: data.pays,
            codeFiscal: data.codeFiscal,
            numTel: data.numTel,
            steWeb: data.steWeb,
        });
        
        if (data.adresse2) {
            queryParams.append('adresse2', data.adresse2);
        }
        
        if (data.photo) {
            formData.append('photo', data.photo);
        }
        
        const response = await apiClient.put<Enterprise>(
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
