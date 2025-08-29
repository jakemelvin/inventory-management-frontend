import { useMutation, useQuery } from '@tanstack/react-query'
import { fournisseurService } from '@/services/fournisseurService'
import { queryClient } from '@/providers'
import { toast } from 'sonner'
import { Fournisseur, CreateFournisseurRequest, UpdateFournisseurRequest } from '@/types/fournisseur'
import type { ApiError } from '@/types'
import { FournisseursCacheKeys, FournisseurMutationKeys } from '@/lib/const'

export const useFournisseur = ({ fournisseurId }: { fournisseurId?: Fournisseur['id'] }) => {

  const createFournisseur = useMutation({
    mutationKey: [FournisseurMutationKeys.Create],
    mutationFn: ({ data }: { data: CreateFournisseurRequest }) => fournisseurService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FournisseursCacheKeys.Fournisseurs] })
      toast.success("Succès", { description: "Fournisseur créé avec succès" })
    },
    onError: (error: ApiError) => {
      toast.error("Erreur", { description: error.response?.data?.message ?? "Impossible de créer le fournisseur" })
    }
  })

  const updateFournisseur = useMutation({
    mutationKey: [FournisseurMutationKeys.Update],
    mutationFn: ({ id, data }: { id: Fournisseur['id'], data: UpdateFournisseurRequest }) =>
      fournisseurService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FournisseursCacheKeys.Fournisseurs] })
      toast.success("Succès", { description: "Fournisseur mis à jour avec succès" })
    },
    onError: (error: ApiError) => {
      toast.error("Erreur", { description: error.response?.data?.message ?? "Impossible de mettre à jour le fournisseur" })
    }
  })

  const getFournisseur = useQuery({
    queryKey: [FournisseursCacheKeys.Fournisseurs, fournisseurId],
    queryFn: () => fournisseurService.getById(fournisseurId as Fournisseur['id']),
    enabled: !!fournisseurId
  })

  const deleteFournisseur = useMutation({
    mutationKey: [FournisseurMutationKeys.Delete],
    mutationFn: (id: Fournisseur['id']) => fournisseurService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FournisseursCacheKeys.Fournisseurs] })
      toast.success("Succès", { description: "Fournisseur supprimé avec succès" })
    },
    onError: (error: ApiError) => {
      toast.error("Erreur", { description: error.response?.data?.message ?? "Impossible de supprimer le fournisseur" })
    }
  })

  return {
    createFournisseur,
    updateFournisseur,
    getFournisseur,
    deleteFournisseur
  }
}

export const useFournisseurs = () => {
  const getFournisseurs = useQuery({
    queryKey: [FournisseursCacheKeys.Fournisseurs],
    queryFn: () => fournisseurService.getAll()
  })

  return { getFournisseurs }
}
