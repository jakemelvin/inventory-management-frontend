export const UserRoles = {
    ADMIN: "ADMIN",
    MANAGER: "MANAGER",
    EMPLOYEE: "EMPLOYEE"
} as const;

export type UserRole = (typeof UserRoles)[keyof typeof UserRoles];

export interface UserResponseData{
  id:number
  username:string
  email:string
  firstName:string
  lastName:string
  role:UserRole
}

export interface ApiError {
    response?: {
        data?: {
            message?: string;
            status?: number
        };
    };
}

// export types

export * from "./user"
export * from "./article"
export * from "./enterprise"
export * from "./commande-client"
export * from "./commande-fournisseur"
export * from "./utilisateur"
export * from "./client"
export * from "./article"
export * from "./categorie"
export * from "./commande-client"
export * from "./enterprise"
export * from "./user"
export * from "./vente"
export * from "./fournisseur"
export type { Role as SystemRole, CreateRoleRequest, UpdateRoleRequest } from "./role"

