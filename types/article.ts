import { UseMutationResult } from "@tanstack/react-query"
import type { ApiError, Categorie } from "./index"

export interface Article {
    id: number
    codeArticle: string
    designation: string
    prixUnitaire: number
    tauxTva: number
    prixUnitaireTtc: number
    photo: string | null
    categorie: Categorie
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

export interface CreateArticleRequest {
    codeArticle: string
    designation: string
    categorieId: number
    entrepriseId: number
    prixUnitaire: number
    tauxTva: number
    prixUnitaireTtc: number
    image?: File
}

export interface UpdateArticleRequest {
    codeArticle: string
    designation: string
    categorieId: number
    entrepriseId: number
    prixUnitaire: number
    tauxTva: number
    prixUnitaireTtc: number
    image?: File
}

export type CreateArticleMutation = UseMutationResult<Article, ApiError, { data: CreateArticleRequest }, unknown>
export type UpdateArticleMutation = UseMutationResult<Article, ApiError, { id: number; data: UpdateArticleRequest }, unknown>
export type DeleteArticleMutation = UseMutationResult<unknown, ApiError, number, unknown>
