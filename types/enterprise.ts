import { UseMutationResult } from "@tanstack/react-query"
import type { ApiError } from "./index"

export interface Adresse {
    id: number | null
    adresse1: string
    adresse2: string | null
    ville: string
    codePostal: string
    pays: string
}

export interface Enterprise {
    id: number
    nomEntreprise: string
    description: string
    photo: string | null
    email: string
    adresse: Adresse
    codeFiscal: string
    numTel: string
    steWeb: string
    creationDate: string | null
}

export interface CreateEnterpriseRequest {
    nomEntreprise: string
    description: string
    email: string
    adresse1: string
    adresse2?: string
    ville: string
    codePostal: string
    pays: string
    codeFiscal: string
    numTel: string
    steWeb: string
    photo?: File
}

export interface UpdateEnterpriseRequest {
    nomEntreprise: string
    description: string
    email: string
    adresse1: string
    adresse2?: string
    ville: string
    codePostal: string
    pays: string
    codeFiscal: string
    numTel: string
    steWeb: string
    photo?: File
}

export type CreateEnterpriseMutation = UseMutationResult<Enterprise, ApiError, { data: CreateEnterpriseRequest }, unknown>
export type UpdateEnterpriseMutation = UseMutationResult<Enterprise, ApiError, { id: number; data: UpdateEnterpriseRequest }, unknown>
export type DeleteEnterpriseMutation = UseMutationResult<unknown, ApiError, number, unknown>
