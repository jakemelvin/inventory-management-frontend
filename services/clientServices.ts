import { apiClient } from "@/lib/axios"
import { ClientResponseDto } from "@/types/commande-client"

const BASE_URL = '/clients'

export const clientServices = {
  getAll: async (entrepriseId?: number) => {
    const params = entrepriseId ? { entrepriseId } : {};
    const response = await apiClient.get<ClientResponseDto[]>(`${BASE_URL}`, { params });
    return response.data;
  },
  getById: async (id: number) => {
    const response = await apiClient.get<ClientResponseDto>(`${BASE_URL}/${id}`)
    return response.data
  },
  getByEntreprise: async (entrepriseId: number) => {
    const response = await apiClient.get<ClientResponseDto[]>(`${BASE_URL}/entreprise/${entrepriseId}`)
    return response.data
  }
}
