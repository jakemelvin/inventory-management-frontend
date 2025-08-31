export interface Role {
    id: number
    roleName: string
    utilisateurId: number
    entrepriseId: number
    utilisateur?: {
        id: number
        firstName: string
        lastName: string
        email: string
    }
    entreprise?: {
        id: number
        nomEntreprise: string
        description: string
        email: string
    }
}

// Extended type for API responses that might have different structure
export interface RoleWithIds extends Omit<Role, 'utilisateurId' | 'entrepriseId'> {
    utilisateurId: number
    entrepriseId: number
}

export interface CreateRoleRequest {
    roleName: string
    utilisateurId: number
    entrepriseId: number
}

export interface UpdateRoleRequest {
    roleName: string
    utilisateurId: number
    entrepriseId: number
}
