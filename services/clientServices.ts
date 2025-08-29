import { apiClient } from "@/lib/axios"
import { Client, CreateClientRequest, UpdateClientRequest } from "@/types/client"

const BASE_URL = '/clients'

export const clientServices = {
  getAll: async () => {
    const response = await apiClient.get<Client[]>(`${BASE_URL}/showAll`);
    return response.data;
  },
  getById: async (id: number) => {
    const response = await apiClient.get<Client>(`${BASE_URL}/${id}`)
    return response.data
  },
  getByEntreprise: async (entrepriseId: number) => {
    const allClients = await clientServices.getAll();
    return allClients.filter(client => client.entreprise.id === entrepriseId);
  },
  create: async (data: CreateClientRequest) => {
    const formData = new FormData();
    
    const queryParams = new URLSearchParams({
      nom: data.nom,
      prenom: data.prenom,
      email: data.email,
      adresse1: data.adresse1,
      ville: data.ville,
      codePostal: data.codePostal,
      pays: data.pays,
      numTel: data.numTel,
      entrepriseId: data.entrepriseId.toString(),
    });
    
    if (data.adresse2) {
      queryParams.append('adresse2', data.adresse2);
    }
    
    if (data.photo) {
      formData.append('photo', data.photo);
    }
    
    const response = await apiClient.post<Client>(
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
  update: async (id: number, data: UpdateClientRequest) => {
    const formData = new FormData();
    
    const queryParams = new URLSearchParams({
      nom: data.nom,
      prenom: data.prenom,
      email: data.email,
      adresse1: data.adresse1,
      ville: data.ville,
      codePostal: data.codePostal,
      pays: data.pays,
      numTel: data.numTel,
      entrepriseId: data.entrepriseId.toString(),
    });
    
    if (data.adresse2) {
      queryParams.append('adresse2', data.adresse2);
    }
    
    if (data.photo) {
      formData.append('photo', data.photo);
    }
    
    const response = await apiClient.put<Client>(
      `${BASE_URL}/update/${id}?${queryParams.toString()}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },
  delete: async (id: number) => {
    const response = await apiClient.delete(`${BASE_URL}/delete/${id}`);
    return response.data;
  }
}
