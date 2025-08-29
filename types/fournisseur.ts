import { Adresse } from "./enterprise"

export interface EntrepriseResponseDto {
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

export interface Fournisseur {
    id: number
    nom: string
    prenom: string
    adresse: Adresse
    photo: string | null
    email: string
    numTel: string
    commandeFournisseurs: any[] 
    entreprise: EntrepriseResponseDto
}

export interface CreateFournisseurRequest {
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

export interface UpdateFournisseurRequest {
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