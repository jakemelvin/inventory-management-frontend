import { Article } from "./article"

export interface CommandeClient {
  id: number
  code: string
  dateCommande: string
  entrepriseId: number
  client?: ClientResponseDto
  ligneCommandeClients: LigneCommandeClient[]
}

export interface CreateCommandeClientRequest {
  code: string
  dateCommande: string
  entrepriseId: number
  clientId: number
}

export interface UpdateCommandeClientRequest {
  code: string
  dateCommande: string
  entrepriseId: number
  clientId: number
}

export interface LigneCommandeClient {
  id: number
  commandeClient?: CommandeClient
  article: Article
  quantite: number
  prixUnitaire: number
  entrepriseId: number
}

export interface CreateLigneCommandeClientRequest {
  commandeClientId: number
  articleId: number
  quantite: number
  prixUnitaire: number
  entrepriseId: number
}

export interface UpdateLigneCommandeClientRequest {
  commandeClientId: number
  articleId: number
  quantite: number
  prixUnitaire: number
  entrepriseId: number
}

export interface ClientResponseDto {
  id: number
  nom: string
  prenom: string
  adresse?: {
    adresse1: string
    adresse2?: string
    ville: string
    codePostal: string
    pays: string
  }
  photo?: string
  mail: string
  numTel: string
  entrepriseId: number
}
