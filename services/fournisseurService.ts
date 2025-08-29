import { apiClient } from "@/lib/axios"
import { Fournisseur, CreateFournisseurRequest, UpdateFournisseurRequest } from "@/types/fournisseur"

const BASE_URL = '/fournisseurs'

export const fournisseurService = {
  
  getAll: async (): Promise<Fournisseur[]> => {
    const response = await apiClient.get<Fournisseur[]>(`${BASE_URL}/showAll`)
    return response.data
  },

  getById: async (id: Fournisseur['id']): Promise<Fournisseur> => {
    const response = await apiClient.get<Fournisseur>(`${BASE_URL}/${id}`)
    return response.data
  },

  create: async (data: CreateFournisseurRequest): Promise<Fournisseur> => {
    const formData = new FormData()

    const queryParams = new URLSearchParams({
      nom: data.nom,
      prenom: data.prenom,
      email: data.email,
      adresse1: data.adresse1,
      adresse2: data.adresse2 || '',
      ville: data.ville,
      codePostal: data.codePostal,
      pays: data.pays,
      numTel: data.numTel,
      entrepriseId: data.entrepriseId.toString()
    })

    if (data.photo) {
      formData.append('photo', data.photo)
    }

    const response = await apiClient.post<Fournisseur>(
      `${BASE_URL}/create?${queryParams.toString()}`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )

    return response.data
  },

  update: async (id: Fournisseur['id'], data: UpdateFournisseurRequest): Promise<Fournisseur> => {
    const formData = new FormData()

    const queryParams = new URLSearchParams({
      nom: data.nom,
      prenom: data.prenom,
      email: data.email,
      adresse1: data.adresse1,
      adresse2: data.adresse2 || '',
      ville: data.ville,
      codePostal: data.codePostal,
      pays: data.pays,
      numTel: data.numTel,
      entrepriseId: data.entrepriseId.toString()
    })

    if (data.photo) {
      formData.append('photo', data.photo)
    }

    const response = await apiClient.put<Fournisseur>(
      `${BASE_URL}/update/${id}?${queryParams.toString()}`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )

    return response.data
  },

  delete: async (id: Fournisseur['id']): Promise<void> => {
    const response = await apiClient.delete(`${BASE_URL}/delete/${id}`)
    return response.data
  }
}
