import { useMutation, useQuery } from "@tanstack/react-query"
import { queryClient } from "@/providers"
import { commandeClientServices } from "@/services/commandeClientServices"
import { 
  CommandeClientsCacheKeys, 
  CommandeClientMutationKeys 
} from "@/lib/const"
import { 
  CreateCommandeClientRequest, 
  UpdateCommandeClientRequest,
  CreateLigneCommandeClientRequest,
  UpdateLigneCommandeClientRequest,
  ApiError
} from "@/types"
import { toast } from "sonner"

export function useCommandesClients() {
  const getCommandesClients = useQuery({
    queryKey: [CommandeClientsCacheKeys.CommandesClients],
    queryFn: commandeClientServices.getAll,
  })

  return {
    getCommandesClients,
  }
}

export function useCommandeClient({ id }: { id?: number }) {
  const getCommandeClient = useQuery({
    queryKey: [CommandeClientsCacheKeys.CommandesClients, id],
    queryFn: () => commandeClientServices.getById(id!),
    enabled: !!id,
  })

  const createCommandeClient = useMutation({
    mutationKey: [CommandeClientMutationKeys.Create],
    mutationFn: (data: CreateCommandeClientRequest) => commandeClientServices.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CommandeClientsCacheKeys.CommandesClients] })
      toast.success("Commande client créée avec succès")
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message || "Erreur lors de la création de la commande client")
    },
  })

  const updateCommandeClient = useMutation({
    mutationKey: [CommandeClientMutationKeys.Update],
    mutationFn: ({ id, data }: { id: number; data: UpdateCommandeClientRequest }) =>
      commandeClientServices.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CommandeClientsCacheKeys.CommandesClients] })
      toast.success("Commande client mise à jour avec succès")
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message || "Erreur lors de la mise à jour de la commande client")
    },
  })

  const deleteCommandeClient = useMutation({
    mutationKey: [CommandeClientMutationKeys.Delete],
    mutationFn: (id: number) => commandeClientServices.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CommandeClientsCacheKeys.CommandesClients] })
      toast.success("Commande client supprimée avec succès")
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message || "Erreur lors de la suppression de la commande client")
    },
  })

  const addLigne = useMutation({
    mutationKey: [CommandeClientMutationKeys.AddLigne],
    mutationFn: ({ commandeId, ligne }: { commandeId: number; ligne: CreateLigneCommandeClientRequest }) =>
      commandeClientServices.addLigne(commandeId, ligne),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CommandeClientsCacheKeys.CommandesClients] })
      toast.success("Ligne ajoutée avec succès")
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message || "Erreur lors de l'ajout de la ligne")
    },
  })

  const updateLigne = useMutation({
    mutationKey: [CommandeClientMutationKeys.UpdateLigne],
    mutationFn: ({ commandeId, ligneId, ligne }: { commandeId: number; ligneId: number; ligne: UpdateLigneCommandeClientRequest }) =>
      commandeClientServices.updateLigne(commandeId, ligneId, ligne),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CommandeClientsCacheKeys.CommandesClients] })
      toast.success("Ligne mise à jour avec succès")
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message || "Erreur lors de la mise à jour de la ligne")
    },
  })

  const removeLigne = useMutation({
    mutationKey: [CommandeClientMutationKeys.RemoveLigne],
    mutationFn: ({ commandeId, ligneId }: { commandeId: number; ligneId: number }) =>
      commandeClientServices.removeLigne(commandeId, ligneId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CommandeClientsCacheKeys.CommandesClients] })
      toast.success("Ligne supprimée avec succès")
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message || "Erreur lors de la suppression de la ligne")
    },
  })

  return {
    getCommandeClient,
    createCommandeClient,
    updateCommandeClient,
    deleteCommandeClient,
    addLigne,
    updateLigne,
    removeLigne,
  }
}
