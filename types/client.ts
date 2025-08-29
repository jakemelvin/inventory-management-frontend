import { UseMutationResult } from "@tanstack/react-query"
import type { ApiError } from "./index"

export interface ClientAdresse {
    id: number | null
    adresse1: string
    adresse2: string | null
    ville: string
    codePostal: string
    pays: string
}

export interface ClientEnterprise {
    id: number
    nomEntreprise: string
    description: string
    photo: string | null
    email: string
    adresse: ClientAdresse
    codeFiscal: string
    numTel: string
    steWeb: string
    creationDate: string | null
}

export interface Client {
    id: number
    nom: string
    prenom: string
    adresse: ClientAdresse
    photo: string | null
    email: string
    numTel: string
    entreprise: ClientEnterprise
}

export interface CreateClientRequest {
    nom: string
    prenom: string
    email: string
    adresse1: string
    adresse2?: string
    ville: string
    codePostal: string
    pays: string
    numTel: string
    entrepriseId: number
    photo?: File
}

export interface UpdateClientRequest {
    nom: string
    prenom: string
    email: string
    adresse1: string
    adresse2?: string
    ville: string
    codePostal: string
    pays: string
    numTel: string
    entrepriseId: number
    photo?: File
}

export type CreateClientMutation = UseMutationResult<Client, ApiError, { data: CreateClientRequest }, unknown>
export type UpdateClientMutation = UseMutationResult<Client, ApiError, { id: number; data: UpdateClientRequest }, unknown>
export type DeleteClientMutation = UseMutationResult<unknown, ApiError, number, unknown>
