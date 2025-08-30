import { apiClient } from "@/lib/axios"
import { CreateMvtStkRequest, UpdateMvtStkRequest, MvtStk } from "@/types"

const BASE_URL = '/mvtstk'

export const mvtStkService = {
  
  getAll: async (): Promise<MvtStk[]> => {
    const response = await apiClient.get<MvtStk[]>(`${BASE_URL}/showAll`)
    return response.data
  },

  getById: async (id: MvtStk['id']): Promise<MvtStk> => {
    const response = await apiClient.get<MvtStk>(`${BASE_URL}/${id}`)
    return response.data
  },

  create: async (data: CreateMvtStkRequest): Promise<MvtStk> => {
    const response = await apiClient.post<MvtStk>(`${BASE_URL}/create`, data)
    return response.data
  },

  update: async (id: MvtStk['id'], data: UpdateMvtStkRequest): Promise<MvtStk> => {
    const response = await apiClient.put<MvtStk>(`${BASE_URL}/update/${id}`, data)
    return response.data
  },

  delete: async (id: MvtStk['id']): Promise<void> => {
    await apiClient.delete(`${BASE_URL}/delete/${id}`)
  }
}
