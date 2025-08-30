import { useMutation, useQuery } from '@tanstack/react-query';
import { roleService } from "@/services/roleServices"
import { queryClient } from '@/providers';
import { toast } from 'sonner';
import { Role, CreateRoleRequest, UpdateRoleRequest, ApiError } from '@/types';
import { RolesCacheKeys, RoleMutationKeys } from "@/lib/const"

export const useRole = ({ roleId }: {
    roleId?: Role['id']
}) => {
    const createRole = useMutation({
        mutationKey: [RoleMutationKeys.Create],
        mutationFn: ({ data }: { data: CreateRoleRequest }) =>
            roleService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [RolesCacheKeys.Roles]
            })
            toast.success("Succès", {
                description: "Rôle créé avec succès",
            })
        },
        onError: (error: ApiError) => {
            toast.error("Erreur", {
                description: error.response?.data?.message ?? "Impossible de créer le rôle",
            })
        }
    })

    const updateRole = useMutation({
        mutationKey: [RoleMutationKeys.Update],
        mutationFn: ({ id, data }: { id: Role['id'], data: UpdateRoleRequest }) =>
            roleService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [RolesCacheKeys.Roles]
            })
            toast.success("Succès", {
                description: "Rôle mis à jour avec succès",
            })
        },
        onError: (error: ApiError) => {
            toast.error("Erreur", {
                description: error.response?.data?.message ?? "Impossible de mettre à jour le rôle",
            })
        }
    })

    const getRole = useQuery({
        queryKey: [RolesCacheKeys.Roles, roleId],
        queryFn: () =>
            roleService.getById(roleId as Role['id']),
        enabled: !!roleId
    })

    const deleteRole = useMutation({
        mutationKey: [RoleMutationKeys.Delete],
        mutationFn: (roleId: Role['id']) => roleService.delete(roleId),
        onSuccess: () => {
            // Force refetch instead of just invalidating
            queryClient.refetchQueries({
                queryKey: [RolesCacheKeys.Roles]
            })
            toast.success("Succès", {
                description: "Rôle supprimé avec succès",
            })
        },
        onError: (error: ApiError) => {
            console.error('Delete role error:', error)
            toast.error("Erreur", {
                description: error.response?.data?.message ?? "Impossible de supprimer le rôle",
            })
        }
    })

    return {
        createRole,
        updateRole,
        getRole,
        deleteRole
    }
}

export const useRoles = () => {
    const getRoles = useQuery({
        queryKey: [RolesCacheKeys.Roles],
        queryFn: () => roleService.getAll()
    })

    return {
        getRoles
    }
}
