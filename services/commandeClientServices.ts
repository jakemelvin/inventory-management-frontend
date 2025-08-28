import { apiClient } from "@/lib/axios"
import { 
  CreateCommandeClientRequest, 
  UpdateCommandeClientRequest, 
  CreateLigneCommandeClientRequest,
  UpdateLigneCommandeClientRequest
} from "@/types"

const BASE_URL = '/commandesclients'

export const commandeClientServices = {
  getAll: async () => {
    const response = await apiClient.get(`${BASE_URL}/showAll`)
    return response.data
  },

  getById: async (id: number) => {
    const response = await apiClient.get(`${BASE_URL}/${id}`)
    return response.data
  },

  getByCode: async (code: string) => {
    const response = await apiClient.get(`${BASE_URL}/code/${code}`)
    return response.data
  },

  create: async (data: CreateCommandeClientRequest) => {
    const response = await apiClient.post(`${BASE_URL}/create`, data)
    return response.data
  },

  update: async (id: number, data: UpdateCommandeClientRequest) => {
    const response = await apiClient.put(`${BASE_URL}/update/${id}`, data)
    return response.data
  },

  delete: async (id: number) => {
    const response = await apiClient.delete(`${BASE_URL}/delete/${id}`)
    return response.data
  },

  // Ligne commande operations
  addLigne: async (commandeId: number, ligne: CreateLigneCommandeClientRequest) => {
    const response = await apiClient.post(`${BASE_URL}/${commandeId}/lignes`, ligne)
    return response.data
  },

  updateLigne: async (commandeId: number, ligneId: number, ligne: UpdateLigneCommandeClientRequest) => {
    const response = await apiClient.put(`${BASE_URL}/${commandeId}/lignes/${ligneId}`, ligne)
    return response.data
  },

  removeLigne: async (commandeId: number, ligneId: number) => {
    const response = await apiClient.delete(`${BASE_URL}/${commandeId}/lignes/${ligneId}`)
    return response.data
  },

  removeAllLignes: async (commandeId: number) => {
    const response = await apiClient.delete(`${BASE_URL}/${commandeId}/lignes`)
    return response.data
  },

  getAllLignesByCommande: async (commandeId: number) => {
    const response = await apiClient.get(`${BASE_URL}/${commandeId}/lignes`)
    return response.data
  }
}
