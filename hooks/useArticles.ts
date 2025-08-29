import { useMutation, useQuery } from '@tanstack/react-query';
import { articleServices } from "@/services/articleServices"
import { queryClient } from '@/providers';
import { toast } from 'sonner';
import { Article, CreateArticleRequest, UpdateArticleRequest, ApiError } from '@/types';
import { ArticlesCacheKeys, ArticleMutationKeys } from "@/lib/const"


export const useArticle = ({ articleId }: {
    articleId?: Article['id']
}) => {
    const createArticle = useMutation({
        mutationKey: [ArticleMutationKeys.Create],
        mutationFn: ({ data }: { data: CreateArticleRequest }) =>
            articleServices.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [ArticlesCacheKeys.Articles]
            })
            toast.success("Succès", {
                description: "Article créé avec succès",
            })
        },
        onError: (error: ApiError) => {
            toast.error("Erreur", {
                description: error.response?.data?.message ?? "Impossible de créer l'article",
            })
        }
    })

    const updateArticle = useMutation({
        mutationKey: [ArticleMutationKeys.Update],
        mutationFn: ({ id, data }: { id: Article['id'], data: UpdateArticleRequest }) =>
            articleServices.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [ArticlesCacheKeys.Articles]
            })
            toast.success("Succès", {
                description: "Article mis à jour avec succès",
            })
        },
        onError: (error: ApiError) => {
            toast.error("Erreur", {
                description: error.response?.data?.message ?? "Impossible de mettre à jour l'article",
            })
        }
    })

    const getArticle = useQuery({
        queryKey: [ArticlesCacheKeys.Articles, articleId],
        queryFn: () =>
            articleServices.getById(articleId as Article['id']),
        enabled: !!articleId
    })

    const deleteArticle = useMutation({
        mutationKey: [ArticleMutationKeys.Delete],
        mutationFn: (articleId: Article['id']) => articleServices.delete(articleId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [ArticlesCacheKeys.Articles]
            })
            toast.success("Succès", {
                description: "Article supprimé avec succès",
            })
        },
        onError: (error: ApiError) => {
            toast.error("Erreur", {
                description: error.response?.data?.message ?? "Impossible de supprimer l'article",
            })
        }
    })

    return {
        createArticle,
        updateArticle,
        getArticle,
        deleteArticle
    }
}


export const useArticles = () => {
    const getArticles = useQuery({
        queryKey: [ArticlesCacheKeys.Articles],
        queryFn: () => articleServices.getAll()
    })

    return {
        getArticles
    }
}
