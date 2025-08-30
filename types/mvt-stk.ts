import { UseMutationResult } from "@tanstack/react-query"
import type { ApiError } from "./index"

export enum TypeMvtStk {
  ENTREE = "ENTREE",
  SORTIE = "SORTIE"
}

export interface MvtStkAdresse {
  id: number | null
  adresse1: string
  adresse2: string | null
  ville: string
  codePostal: string
  pays: string
}

export interface MvtStkEntreprise {
  id: number
  nomEntreprise: string
  description: string
  photo: string | null
  email: string
  adresse: MvtStkAdresse
  codeFiscal: string
  numTel: string
  steWeb: string
  creationDate: string | null
}

export interface MvtStkCategorie {
  id: number
  code: string
  designation: string
  entrepriseId: number
}

export interface MvtStkArticle {
  id: number
  codeArticle: string
  designation: string
  prixUnitaire: number
  tauxTva: number
  prixUnitaireTtc: number
  photo: string | null
  categorie: MvtStkCategorie
  entreprise: MvtStkEntreprise
}

export interface MvtStk {
  id: number
  dateMvt: string
  quantite: number
  typeMvt: TypeMvtStk
  article: MvtStkArticle
}

export interface CreateMvtStkRequest {
  dateMvt: string
  quantite: number
  typeMvt: TypeMvtStk
  articleId: number
  entrepriseId: number
}

export interface UpdateMvtStkRequest {
  dateMvt: string
  quantite: number
  typeMvt: TypeMvtStk
  articleId: number
  entrepriseId: number
}

export type CreateMvtStkMutation = UseMutationResult<MvtStk, ApiError, { data: CreateMvtStkRequest }, unknown>
export type UpdateMvtStkMutation = UseMutationResult<MvtStk, ApiError, { id: number; data: UpdateMvtStkRequest }, unknown>
export type DeleteMvtStkMutation = UseMutationResult<unknown, ApiError, number, unknown>