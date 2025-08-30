import { useMutation, useQuery } from '@tanstack/react-query';
import { categorieServices } from "@/services/categorieServices"
import { queryClient } from '@/providers';
import { toast } from 'sonner';
import { Categorie, CreateCategorieRequest, UpdateCategorieRequest, ApiError } from '@/types';
import { CategoriesCacheKeys, CategorieMutationKeys } from "@/lib/const"

export const useCategorie = ({ categorieId }: {
    categorieId?: Categorie['id']
}) => {
    const createCategorie = useMutation({
        mutationKey: [CategorieMutationKeys.Create],
        mutationFn: ({ data }: { data: CreateCategorieRequest }) =>
            categorieServices.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [CategoriesCacheKeys.Categories]
            })
            toast.success("Succès", {
                description: "Catégorie créée avec succès",
            })
        },
        onError: (error: ApiError) => {
            toast.error("Erreur", {
                description: error.response?.data?.message ?? "Impossible de créer la catégorie",
            })
        }
    })

    const updateCategorie = useMutation({
        mutationKey: [CategorieMutationKeys.Update],
        mutationFn: ({ id, data }: { id: Categorie['id'], data: UpdateCategorieRequest }) =>
            categorieServices.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [CategoriesCacheKeys.Categories]
            })
            toast.success("Succès", {
                description: "Catégorie mise à jour avec succès",
            })
        },
        onError: (error: ApiError) => {
            toast.error("Erreur", {
                description: error.response?.data?.message ?? "Impossible de mettre à jour la catégorie",
            })
        }
    })

    const getCategorie = useQuery({
        queryKey: [CategoriesCacheKeys.Categories, categorieId],
        queryFn: () =>
            categorieServices.getById(categorieId as Categorie['id']),
        enabled: !!categorieId
    })

    const deleteCategorie = useMutation({
        mutationKey: [CategorieMutationKeys.Delete],
        mutationFn: (categorieId: Categorie['id']) => categorieServices.delete(categorieId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [CategoriesCacheKeys.Categories]
            })
            toast.success("Succès", {
                description: "Catégorie supprimée avec succès",
            })
        },
        onError: (error: ApiError) => {
            toast.error("Erreur", {
                description: error.response?.data?.message ?? "Impossible de supprimer la catégorie",
            })
        }
    })

    return {
        createCategorie,
        updateCategorie,
        getCategorie,
        deleteCategorie
    }
}

export const useCategories = () => {
    const getCategories = useQuery({
        queryKey: [CategoriesCacheKeys.Categories],
        queryFn: () => categorieServices.getAll()
    })

    return {
        getCategories
    }
}
