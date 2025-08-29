import { apiClient } from "@/lib/axios"
import { CreateRoleRequest, UpdateRoleRequest, Role } from "@/types"

const BASE_URL = '/roles'

export const roleService = {
  
  getAll: async (): Promise<Role[]> => {
    const response = await apiClient.get<Role[]>(`${BASE_URL}/showAll`)
    return response.data
  },

  getById: async (id: Role['id']): Promise<Role> => {
    const response = await apiClient.get<Role>(`${BASE_URL}/${id}`)
    return response.data
  },

  create: async (data: CreateRoleRequest): Promise<Role> => {
    const response = await apiClient.post<Role>(`${BASE_URL}/create`, data)
    return response.data
  },

  update: async (id: Role['id'], data: UpdateRoleRequest): Promise<Role> => {
    const response = await apiClient.put<Role>(`${BASE_URL}/update/${id}`, data)
    return response.data
  },

  delete: async (id: Role['id']): Promise<void> => {
    await apiClient.delete(`${BASE_URL}/delete/${id}`)
  }
}
