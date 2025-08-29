import { apiClient } from "@/lib/axios"
import { CreateUtilisateurRequest, UpdateUtilisateurRequest } from "@/types"

const BASE_URL = '/utilisateurs'

export const utilisateurServices = {
  getAll: async () => {
    const response = await apiClient.get(`${BASE_URL}/showAll`)
    return response.data
  },

  getById: async (id: number) => {
    const response = await apiClient.get(`${BASE_URL}/${id}`)
    return response.data
  },

  create: async (data: CreateUtilisateurRequest) => {
    const formData = new FormData()
    
    const params = new URLSearchParams({
      nom: data.nom,
      prenom: data.prenom,
      email: data.email,
      motDePasse: data.motDePasse,
      dateDeNaissance: data.dateDeNaissance,
      adresse1: data.adresse1,
      ville: data.ville,
      codePostal: data.codePostal,
      pays: data.pays,
      entrepriseId: data.entrepriseId.toString(),
    })

    if (data.adresse2) {
      params.append('adresse2', data.adresse2)
    }

    if (data.image) {
      formData.append('image', data.image)
    }

    const response = await apiClient.post(`${BASE_URL}/create?${params.toString()}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  update: async (id: number, data: UpdateUtilisateurRequest) => {
    const formData = new FormData()
    
    const params = new URLSearchParams({
      nom: data.nom,
      prenom: data.prenom,
      email: data.email,
      motDePasse: data.motDePasse,
      dateDeNaissance: data.dateDeNaissance,
      adresse1: data.adresse1,
      ville: data.ville,
      codePostal: data.codePostal,
      pays: data.pays,
      entrepriseId: data.entrepriseId.toString(),
    })

    if (data.adresse2) {
      params.append('adresse2', data.adresse2)
    }

    if (data.image) {
      formData.append('image', data.image)
    }

    const response = await apiClient.put(`${BASE_URL}/update/${id}?${params.toString()}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  delete: async (id: number) => {
    const response = await apiClient.delete(`${BASE_URL}/delete/${id}`)
    return response.data
  }
}
