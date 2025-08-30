import { apiClient } from "@/lib/axios"
import { CommandeFournisseur, CreateCommandeFournisseurRequest, UpdateCommandeFournisseurRequest } from "@/types/commande-fournisseur"

const BASE_URL = '/commandesfournisseurs'
const LINE_BASE_URL = '/lignecommandefournisseurs'

export const commandeFournisseurServices = {
  getAll: async () => {
    const response = await apiClient.get<CommandeFournisseur[]>(`${BASE_URL}/showAll`);
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get<CommandeFournisseur>(`${BASE_URL}/${id}`)
    return response.data
  },

  getByCode: async (code: string) => {
    const response = await apiClient.get<CommandeFournisseur>(`${BASE_URL}/code/${code}`)
    return response.data
  },

  create: async (data: CreateCommandeFournisseurRequest) => {
    const response = await apiClient.post<CommandeFournisseur>(`${BASE_URL}/create`, data)
    return response.data
  },

  update: async (id: number, data: UpdateCommandeFournisseurRequest) => {
    const response = await apiClient.put<CommandeFournisseur>(`${BASE_URL}/update/${id}`, data)
    return response.data
  },

  delete: async (id: number) => {
    await apiClient.delete(`${BASE_URL}/delete/${id}`)
  },

  addLigneCommande: async (commandeFournisseurId: number, articleId: number, quantite: number, prixUnitaire: number) => {
    const response = await apiClient.post(
      `${LINE_BASE_URL}/create`,
      null,
      {
        params: {
          commandeFournisseurId,
          articleId,
          quantite,
          prixUnitaire
        }
      }
    )
    return response.data
  },

  updateLigneCommande: async (ligneId: number, quantite: number, prixUnitaire: number) => {
    const response = await apiClient.put(
      `${LINE_BASE_URL}/update/${ligneId}`,
      null,
      {
        params: {
          quantite,
          prixUnitaire
        }
      }
    )
    return response.data
  },

  removeLigneCommande: async (ligneId: number) => {
    await apiClient.delete(`${LINE_BASE_URL}/delete/${ligneId}`)
  }
}
