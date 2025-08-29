export interface UtilisateurAdresse {
  id?: number
  adresse1: string
  adresse2?: string
  ville: string
  codePostal: string
  pays: string
}

export interface Role {
  id: number
  roleName: string
  utilisateur?: string
  entrepriseId: number
}

export interface Entreprise {
  id: number
  nomEntreprise: string
  description: string
  photo?: string
  email: string
  adresse: UtilisateurAdresse
  codeFiscal: string
  numTel: string
  steWeb: string
  creationDate: string
}

export interface Utilisateur {
  id: number
  nom: string
  prenom: string
  email: string
  dateDeNaissance?: string
  motDePasse: string
  photo?: string
  entrepriseId?: number
  entreprise?: Entreprise
  adresse?: UtilisateurAdresse
  roles: Role[]
}

export interface CreateUtilisateurRequest {
  nom: string
  prenom: string
  email: string
  motDePasse: string
  dateDeNaissance: string
  adresse1: string
  adresse2?: string
  ville: string
  codePostal: string
  pays: string
  entrepriseId: number
  image?: File
}

export interface UpdateUtilisateurRequest {
  nom: string
  prenom: string
  email: string
  motDePasse: string
  dateDeNaissance: string
  adresse1: string
  adresse2?: string
  ville: string
  codePostal: string
  pays: string
  entrepriseId: number
  image?: File
}
