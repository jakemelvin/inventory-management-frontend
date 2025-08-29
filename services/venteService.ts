import { apiClient } from "@/lib/axios"
import { VentesRequestDto, VentesResponseDto } from "@/types/vente"

const BASE_URL = '/ventes'

export const venteService = {
    // Récupérer toutes les ventes
    getAll: async () => {
        const response = await apiClient.get<VentesResponseDto[]>(`${BASE_URL}/showAll`)
        return response.data
    },

    // Créer une vente
    create: async (data: VentesRequestDto) => {
        const response = await apiClient.post<VentesResponseDto>(`${BASE_URL}/create`, data)
        return response.data
    },

    // Récupérer une vente par ID
    getById: async (id: number) => {
        const response = await apiClient.get<VentesResponseDto>(`${BASE_URL}/${id}`)
        return response.data
    },

    // Récupérer une vente par code
    getByCode: async (code: string) => {
        const response = await apiClient.get<VentesResponseDto>(`${BASE_URL}/code/${code}`)
        return response.data
    },

    // Supprimer une vente
    delete: async (id: number) => {
        const response = await apiClient.delete(`${BASE_URL}/delete/${id}`)
        return response.data
    },

    // Mettre à jour une vente
    update: async (id: number, data: VentesRequestDto) => {
        const response = await apiClient.put<VentesResponseDto>(`${BASE_URL}/update/${id}`, data)
        return response.data
    }
}
