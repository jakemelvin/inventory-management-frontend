import { useMutation, useQuery } from '@tanstack/react-query';
import { enterpriseServices } from "@/services/enterpriseServices"
import { queryClient } from '@/providers';
import { toast } from 'sonner';
import { Enterprise, CreateEnterpriseRequest, UpdateEnterpriseRequest, ApiError } from '@/types';
import { EnterprisesCacheKeys, EnterpriseMutationKeys } from "@/lib/const"

export const useEnterprise = ({ enterpriseId }: {
    enterpriseId?: Enterprise['id']
}) => {
    const createEnterprise = useMutation({
        mutationKey: [EnterpriseMutationKeys.Create],
        mutationFn: ({ data }: { data: CreateEnterpriseRequest }) =>
            enterpriseServices.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [EnterprisesCacheKeys.Enterprises]
            })
            toast.success("Succès", {
                description: "Entreprise créée avec succès",
            })
        },
        onError: (error: ApiError) => {
            toast.error("Erreur", {
                description: error.response?.data?.message ?? "Impossible de créer l'entreprise",
            })
        }
    })

    const updateEnterprise = useMutation({
        mutationKey: [EnterpriseMutationKeys.Update],
        mutationFn: ({ id, data }: { id: Enterprise['id'], data: UpdateEnterpriseRequest }) =>
            enterpriseServices.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [EnterprisesCacheKeys.Enterprises]
            })
            toast.success("Succès", {
                description: "Entreprise mise à jour avec succès",
            })
        },
        onError: (error: ApiError) => {
            toast.error("Erreur", {
                description: error.response?.data?.message ?? "Impossible de mettre à jour l'entreprise",
            })
        }
    })

    const getEnterprise = useQuery({
        queryKey: [EnterprisesCacheKeys.Enterprises, enterpriseId],
        queryFn: () =>
            enterpriseServices.getById(enterpriseId as Enterprise['id']),
        enabled: !!enterpriseId
    })

    const deleteEnterprise = useMutation({
        mutationKey: [EnterpriseMutationKeys.Delete],
        mutationFn: (enterpriseId: Enterprise['id']) => enterpriseServices.delete(enterpriseId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [EnterprisesCacheKeys.Enterprises]
            })
            toast.success("Succès", {
                description: "Entreprise supprimée avec succès",
            })
        },
        onError: (error: ApiError) => {
            toast.error("Erreur", {
                description: error.response?.data?.message ?? "Impossible de supprimer l'entreprise",
            })
        }
    })

    return {
        createEnterprise,
        updateEnterprise,
        getEnterprise,
        deleteEnterprise
    }
}


export const useEnterprises = () => {
    const getEnterprises = useQuery({
        queryKey: [EnterprisesCacheKeys.Enterprises],
        queryFn: () => enterpriseServices.getAll()
    })

    return {
        getEnterprises
    }
}
