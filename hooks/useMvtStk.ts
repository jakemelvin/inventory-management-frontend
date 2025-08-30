import { useMutation, useQuery } from '@tanstack/react-query';
import { mvtStkService } from "@/services/mvtStkServices"
import { queryClient } from '@/providers';
import { toast } from 'sonner';
import { MvtStk, CreateMvtStkRequest, UpdateMvtStkRequest, ApiError } from '@/types';
import { MvtStkCacheKeys, MvtStkMutationKeys } from "@/lib/const"

export const useMvtStk = ({ mvtStkId }: {
    mvtStkId?: MvtStk['id']
}) => {
    const createMvtStk = useMutation({
        mutationKey: [MvtStkMutationKeys.Create],
        mutationFn: ({ data }: { data: CreateMvtStkRequest }) =>
            mvtStkService.create(data),
        onSuccess: () => {
            queryClient.refetchQueries({
                queryKey: [MvtStkCacheKeys.MvtStks]
            })
            toast.success("Succès", {
                description: "Mouvement de stock créé avec succès",
            })
        },
        onError: (error: ApiError) => {
            toast.error("Erreur", {
                description: error.response?.data?.message ?? "Impossible de créer le mouvement de stock",
            })
        }
    })

    const updateMvtStk = useMutation({
        mutationKey: [MvtStkMutationKeys.Update],
        mutationFn: ({ id, data }: { id: MvtStk['id'], data: UpdateMvtStkRequest }) =>
            mvtStkService.update(id, data),
        onSuccess: () => {
            queryClient.refetchQueries({
                queryKey: [MvtStkCacheKeys.MvtStks]
            })
            toast.success("Succès", {
                description: "Mouvement de stock mis à jour avec succès",
            })
        },
        onError: (error: ApiError) => {
            toast.error("Erreur", {
                description: error.response?.data?.message ?? "Impossible de mettre à jour le mouvement de stock",
            })
        }
    })

    const getMvtStk = useQuery({
        queryKey: [MvtStkCacheKeys.MvtStk, mvtStkId],
        queryFn: () =>
            mvtStkService.getById(mvtStkId as MvtStk['id']),
        enabled: !!mvtStkId
    })

    const deleteMvtStk = useMutation({
        mutationKey: [MvtStkMutationKeys.Delete],
        mutationFn: (mvtStkId: MvtStk['id']) => mvtStkService.delete(mvtStkId),
        onSuccess: () => {
            queryClient.refetchQueries({
                queryKey: [MvtStkCacheKeys.MvtStks]
            })
            toast.success("Succès", {
                description: "Mouvement de stock supprimé avec succès",
            })
        },
        onError: (error: ApiError) => {
            console.error('Delete mvtStk error:', error)
            toast.error("Erreur", {
                description: error.response?.data?.message ?? "Impossible de supprimer le mouvement de stock",
            })
        }
    })

    return {
        createMvtStk,
        updateMvtStk,
        getMvtStk,
        deleteMvtStk
    }
}

export const useMvtStks = () => {
    const getMvtStks = useQuery({
        queryKey: [MvtStkCacheKeys.MvtStks],
        queryFn: () => mvtStkService.getAll()
    })

    return {
        getMvtStks
    }
}
