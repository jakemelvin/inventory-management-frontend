import { apiClient } from "@/lib/axios"

interface ClientResponse {
  id: number
  nom: string
  prenom: string
  adresse: {
    id: number | null
    adresse1: string
    adresse2: string | null
    ville: string
    codePostal: string
    pays: string
  }
  photo: string | null
  email: string
  numTel: string
  entreprise: {
    id: number
    nomEntreprise: string
    description: string
    photo: string | null
    email: string
    adresse: {
      id: number | null
      adresse1: string
      adresse2: string | null
      ville: string
      codePostal: string
      pays: string
    }
    codeFiscal: string
    numTel: string
    steWeb: string
    creationDate: string | null
  }
}

const BASE_URL = '/clients'

export const clientServices = {
  getAll: async () => {
    const response = await apiClient.get<ClientResponse[]>(`${BASE_URL}/showAll`);
    return response.data;
  },
  getById: async (id: number) => {
    const response = await apiClient.get<ClientResponse>(`${BASE_URL}/${id}`)
    return response.data
  },
  getByEntreprise: async (entrepriseId: number) => {
    const allClients = await clientServices.getAll();
    return allClients.filter(client => client.entreprise.id === entrepriseId);
  }
}
