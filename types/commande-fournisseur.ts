import { Article } from "./article"
import { Fournisseur } from "./fournisseur"

export interface CommandeFournisseur {
  id: number
  code: string
  dateCommande: string
  entrepriseId: number
  fournisseur?: Fournisseur
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

export interface LigneCommandeFournisseur {
  id: number
  commandeFournisseur?: CommandeFournisseur
  article: Article
  quantite: number
  prixUnitaire: number
  entrepriseId: number
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