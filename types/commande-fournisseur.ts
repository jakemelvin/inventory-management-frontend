import { UseMutationResult } from "@tanstack/react-query"
import type { ApiError } from "./index"

export interface CommandeFournisseurAdresse {
    id: number | null
    adresse1: string
    adresse2: string | null
    ville: string
    codePostal: string
    pays: string
}

export interface CommandeFournisseurEnterprise {
    id: number
    nomEntreprise: string
    description: string
    photo: string | null
    email: string
    adresse: CommandeFournisseurAdresse
    codeFiscal: string
    numTel: string
    steWeb: string
    creationDate: string | null
}

export interface CommandeFournisseurFournisseur {
    id: number
    nom: string
    prenom: string
    adresse: CommandeFournisseurAdresse
    photo: string | null
    email: string
    numTel: string
    entreprise: CommandeFournisseurEnterprise
}

export interface CommandeFournisseurCategorie {
    id: number
    code: string
    designation: string
    entrepriseId: number
}

export interface CommandeFournisseurArticle {
    id: number
    codeArticle: string
    designation: string
    prixUnitaire: number
    tauxTva: number
    prixUnitaireTtc: number
    photo: string | null
    categorie: CommandeFournisseurCategorie
    entreprise: CommandeFournisseurEnterprise
}

export interface LigneCommandeFournisseur {
    id: number
    commandeFournisseur: string
    article: CommandeFournisseurArticle
    quantite: number
    prixUnitaire: number
    entrepriseId: number
}

export interface CommandeFournisseur {
    id: number
    code: string
    dateCommande: string
    fournisseur: CommandeFournisseurFournisseur
    entrepriseId: number
    ligneCommandeFournisseurs: LigneCommandeFournisseur[]
}

export interface CommandeFournisseurRequestDto {
    code: string
    dateCommande: string
    entrepriseId: number
    fournisseurId: number
}

export interface CommandeFournisseurResponseDto {
    id: number
    code: string
    dateCommande: string
    entrepriseId: number
    fournisseurId: number
}

export interface CreateCommandeFournisseurRequest {
    code: string
    dateCommande: string
    entrepriseId: number
    fournisseurId: number
}

export interface UpdateCommandeFournisseurRequest {
    code: string
    dateCommande: string
    entrepriseId: number
    fournisseurId: number
}

export interface CreateLigneCommandeFournisseurRequest {
    commandeFournisseurId: number
    articleId: number
    quantite: number
    prixUnitaire: number
    entrepriseId: number
}

export interface UpdateLigneCommandeFournisseurRequest {
    commandeFournisseurId: number
    articleId: number
    quantite: number
    prixUnitaire: number
    entrepriseId: number
}

export type CreateCommandeFournisseurMutation = UseMutationResult<CommandeFournisseur, ApiError, { data: CreateCommandeFournisseurRequest }, unknown>
export type UpdateCommandeFournisseurMutation = UseMutationResult<CommandeFournisseur, ApiError, { id: number; data: UpdateCommandeFournisseurRequest }, unknown>
export type DeleteCommandeFournisseurMutation = UseMutationResult<unknown, ApiError, number, unknown>