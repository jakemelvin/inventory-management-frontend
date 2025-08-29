import { Article } from "./article"

export interface LigneVenteRequestDto {
    articleId: number
    quantite: number
    prixUnitaire: number
    entrepriseId: number
}

export interface LigneVenteResponseDto {
    id: number
    vente: VentesResponseDto
    article: Article
    quantite: number
    prixUnitaire: number
    entrepriseId: number
}

export interface VentesRequestDto {
    code: string
    dateVente: string
    commentaire: string
    entrepriseId: number
    commandeId: number
    ligneVentes: LigneVenteRequestDto[]
}

export interface VentesResponseDto {
    id: number
    code: string
    dateVente: string
    commentaire: string
    entrepriseId: number
    commandeId: number
    ligneVentes: LigneVenteResponseDto[]
}

export interface Vente {
    id: number
    code: string
    commentaire: string
    entrepriseId: number
    commandeId: number
    ligneVentes: LigneVenteResponseDto[]
}