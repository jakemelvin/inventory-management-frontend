import { UseMutationResult } from "@tanstack/react-query"
import type { ApiError } from "./index"

export interface Categorie {
    id: number
    code: string
    designation: string
    entrepriseId: number
    entreprise?: {
        id: number
        nomEntreprise: string
        description: string
        email: string
    }
}

export interface CreateCategorieRequest {
    code: string
    designation: string
    entrepriseId: number
}

export interface UpdateCategorieRequest {
    code: string
    designation: string
    entrepriseId: number
}

export type CreateCategorieMutation = UseMutationResult<Categorie, ApiError, { data: CreateCategorieRequest }, unknown>
export type UpdateCategorieMutation = UseMutationResult<Categorie, ApiError, { id: number; data: UpdateCategorieRequest }, unknown>
export type DeleteCategorieMutation = UseMutationResult<unknown, ApiError, number, unknown>
