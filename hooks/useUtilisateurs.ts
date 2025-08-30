import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { utilisateurServices } from "@/services/utilisateurServices"
import { UtilisateursCacheKeys, UtilisateurMutationKeys } from "@/lib/const"
import { CreateUtilisateurRequest, UpdateUtilisateurRequest } from "@/types"
import { queryClient } from "@/providers"

export const useUtilisateurs = () => {
  return useQuery({
    queryKey: [UtilisateursCacheKeys.UTILISATEURS],
    queryFn: utilisateurServices.getAll,
  })
}

export const useUtilisateur = (id: number) => {
  return useQuery({
    queryKey: [UtilisateursCacheKeys.UTILISATEUR, id],
    queryFn: () => utilisateurServices.getById(id),
    enabled: !!id,
  })
}

export const useCreateUtilisateur = () => {

  return useMutation({
    mutationKey: [UtilisateurMutationKeys.CREATE_UTILISATEUR],
    mutationFn: (data: CreateUtilisateurRequest) => utilisateurServices.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [UtilisateursCacheKeys.UTILISATEURS],
      })
      toast.success("Utilisateur créé avec succès")
    },
    onError: (error: Error) => {
      const axiosError = error as { response?: { data?: { message?: string } } }
      toast.error(axiosError?.response?.data?.message || "Erreur lors de la création de l'utilisateur")
    },
  })
}

export const useUpdateUtilisateur = () => {

  return useMutation({
    mutationKey: [UtilisateurMutationKeys.UPDATE_UTILISATEUR],
    mutationFn: ({ id, data }: { id: number; data: UpdateUtilisateurRequest }) =>
      utilisateurServices.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [UtilisateursCacheKeys.UTILISATEURS],
      })
      toast.success("Utilisateur modifié avec succès")
    },
    onError: (error: Error) => {
      const axiosError = error as { response?: { data?: { message?: string } } }
      toast.error(axiosError?.response?.data?.message || "Erreur lors de la modification de l'utilisateur")
    },
  })
}

export const useDeleteUtilisateur = () => {

  return useMutation({
    mutationKey: [UtilisateurMutationKeys.DELETE_UTILISATEUR],
    mutationFn: (id: number) => utilisateurServices.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [UtilisateursCacheKeys.UTILISATEURS],
      })
      toast.success("Utilisateur supprimé avec succès")
    },
    onError: (error: Error) => {
      const axiosError = error as { response?: { data?: { message?: string } } }
      toast.error(axiosError?.response?.data?.message || "Erreur lors de la suppression de l'utilisateur")
    },
  })
}
