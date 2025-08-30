import { useMutation, useQuery } from '@tanstack/react-query';
import { commandeFournisseurServices } from "@/services/commandeFournisseurServices"
import { queryClient } from '@/providers';
import { toast } from 'sonner';
import { CommandeFournisseur, CreateCommandeFournisseurRequest, UpdateCommandeFournisseurRequest, ApiError } from '@/types';
import { CommandesFournisseursCacheKeys, CommandeFournisseurMutationKeys } from "@/lib/const"

export const useCommandeFournisseur = ({ commandeFournisseurId }: {
    commandeFournisseurId?: CommandeFournisseur['id']
}) => {
    const createCommandeFournisseur = useMutation({
        mutationKey: [CommandeFournisseurMutationKeys.Create],
        mutationFn: ({ data }: { data: CreateCommandeFournisseurRequest }) =>
            commandeFournisseurServices.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [CommandesFournisseursCacheKeys.CommandesFournisseurs]
            })
            toast.success("Succès", {
                description: "Commande fournisseur créée avec succès",
            })
        },
        onError: (error: ApiError) => {
            toast.error("Erreur", {
                description: error.response?.data?.message ?? "Impossible de créer la commande fournisseur",
            })
        }
    })

    const updateCommandeFournisseur = useMutation({
        mutationKey: [CommandeFournisseurMutationKeys.Update],
        mutationFn: ({ id, data }: { id: CommandeFournisseur['id'], data: UpdateCommandeFournisseurRequest }) =>
            commandeFournisseurServices.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [CommandesFournisseursCacheKeys.CommandesFournisseurs]
            })
            toast.success("Succès", {
                description: "Commande fournisseur mise à jour avec succès",
            })
        },
        onError: (error: ApiError) => {
            toast.error("Erreur", {
                description: error.response?.data?.message ?? "Impossible de mettre à jour la commande fournisseur",
            })
        }
    })

    const getCommandeFournisseur = useQuery({
        queryKey: [CommandesFournisseursCacheKeys.CommandesFournisseurs, commandeFournisseurId],
        queryFn: () =>
            commandeFournisseurServices.getById(commandeFournisseurId as CommandeFournisseur['id']),
        enabled: !!commandeFournisseurId
    })

    const deleteCommandeFournisseur = useMutation({
        mutationKey: [CommandeFournisseurMutationKeys.Delete],
        mutationFn: (commandeFournisseurId: CommandeFournisseur['id']) => commandeFournisseurServices.delete(commandeFournisseurId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [CommandesFournisseursCacheKeys.CommandesFournisseurs]
            })
            toast.success("Succès", {
                description: "Commande fournisseur supprimée avec succès",
            })
        },
        onError: (error: ApiError) => {
            toast.error("Erreur", {
                description: error.response?.data?.message ?? "Impossible de supprimer la commande fournisseur",
            })
        }
    })

    // Ligne commande mutations
    const addLigneCommande = useMutation({
        mutationKey: [CommandeFournisseurMutationKeys.AddLigne],
        mutationFn: ({ commandeFournisseurId, articleId, quantite, prixUnitaire }: {
            commandeFournisseurId: number,
            articleId: number,
            quantite: number,
            prixUnitaire: number
        }) => commandeFournisseurServices.addLigneCommande(commandeFournisseurId, articleId, quantite, prixUnitaire),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [CommandesFournisseursCacheKeys.CommandesFournisseurs]
            })
            toast.success("Succès", {
                description: "Article ajouté à la commande",
            })
        },
        onError: (error: ApiError) => {
            toast.error("Erreur", {
                description: error.response?.data?.message ?? "Impossible d'ajouter l'article",
            })
        }
    })

    const updateLigneCommande = useMutation({
        mutationKey: [CommandeFournisseurMutationKeys.UpdateLigne],
        mutationFn: ({ ligneId, quantite, prixUnitaire }: {
            ligneId: number,
            quantite: number,
            prixUnitaire: number
        }) => commandeFournisseurServices.updateLigneCommande(ligneId, quantite, prixUnitaire),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [CommandesFournisseursCacheKeys.CommandesFournisseurs]
            })
            toast.success("Succès", {
                description: "Ligne de commande mise à jour",
            })
        },
        onError: (error: ApiError) => {
            toast.error("Erreur", {
                description: error.response?.data?.message ?? "Impossible de mettre à jour la ligne",
            })
        }
    })

    const removeLigneCommande = useMutation({
        mutationKey: [CommandeFournisseurMutationKeys.RemoveLigne],
        mutationFn: (ligneId: number) => commandeFournisseurServices.removeLigneCommande(ligneId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [CommandesFournisseursCacheKeys.CommandesFournisseurs]
            })
            toast.success("Succès", {
                description: "Article retiré de la commande",
            })
        },
        onError: (error: ApiError) => {
            toast.error("Erreur", {
                description: error.response?.data?.message ?? "Impossible de retirer l'article",
            })
        }
    })

    return {
        createCommandeFournisseur,
        updateCommandeFournisseur,
        getCommandeFournisseur,
        deleteCommandeFournisseur,
        addLigneCommande,
        updateLigneCommande,
        removeLigneCommande
    }
}

export const useCommandesFournisseurs = () => {
    const getCommandesFournisseurs = useQuery({
        queryKey: [CommandesFournisseursCacheKeys.CommandesFournisseurs],
        queryFn: () => commandeFournisseurServices.getAll()
    })

    return {
        getCommandesFournisseurs
    }
}

export const useCommandeFournisseurByCode = (code?: string) => {
    const getCommandeFournisseurByCode = useQuery({
        queryKey: [CommandesFournisseursCacheKeys.CommandesFournisseursByCode, code],
        queryFn: () => commandeFournisseurServices.getByCode(code as string),
        enabled: !!code
    })

    return {
        getCommandeFournisseurByCode
    }
}
