import { useMutation, useQuery } from '@tanstack/react-query'
import { venteService } from "@/services/venteService"
import { queryClient } from '@/providers'
import { toast } from 'sonner'
import { VentesRequestDto, VentesResponseDto } from '@/types/vente'
import type { ApiError } from '@/types'
import { VentesCacheKeys, VenteMutationKeys } from "@/lib/const"

export const useVente = ({ venteId }: { venteId?: VentesResponseDto['id'] }) => {
    const createVente = useMutation({
        mutationKey: [VenteMutationKeys.Create],
        mutationFn: ({ data }: { data: VentesRequestDto }) =>
            venteService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [VentesCacheKeys.Ventes]
            })
            toast.success("Succès", {
                description: "Vente créée avec succès",
            })
        },
        onError: (error: ApiError) => {
            toast.error("Erreur", {
                description: error.response?.data?.message ?? "Impossible de créer la vente",
            })
        }
    })

    const updateVente = useMutation({
        mutationKey: [VenteMutationKeys.Update],
        mutationFn: ({ id, data }: { id: VentesResponseDto['id'], data: VentesRequestDto }) =>
            venteService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [VentesCacheKeys.Ventes]
            })
            toast.success("Succès", {
                description: "Vente mise à jour avec succès",
            })
        },
        onError: (error: ApiError) => {
            toast.error("Erreur", {
                description: error.response?.data?.message ?? "Impossible de mettre à jour la vente",
            })
        }
    })

    const getVente = useQuery({
        queryKey: [VentesCacheKeys.Ventes, venteId],
        queryFn: () => venteService.getById(venteId as VentesResponseDto['id']),
        enabled: !!venteId
    })

    const deleteVente = useMutation({
        mutationKey: [VenteMutationKeys.Delete],
        mutationFn: (venteId: VentesResponseDto['id']) => venteService.delete(venteId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [VentesCacheKeys.Ventes]
            })
            toast.success("Succès", {
                description: "Vente supprimée avec succès",
            })
        },
        onError: (error: ApiError) => {
            toast.error("Erreur", {
                description: error.response?.data?.message ?? "Impossible de supprimer la vente",
            })
        }
    })

    return {
        createVente,
        updateVente,
        getVente,
        deleteVente
    }
}

export const useVentes = () => {
    const getVentes = useQuery({
        queryKey: [VentesCacheKeys.Ventes],
        queryFn: () => venteService.getAll()
    })

    return {
        getVentes
    }
}
