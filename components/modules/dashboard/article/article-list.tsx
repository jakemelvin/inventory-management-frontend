"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useArticles, useArticle } from "@/hooks/useArticles"
import { DataTable } from "./data-table"
import { createColumns } from "./columns"
import { ArticleForm } from "./article-form"
import { Article } from "@/types"

export function ArticleList() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState<Article | undefined>()

  const { getArticles } = useArticles()
  const { deleteArticle } = useArticle({})
  const { data: articles = [], isLoading, error } = getArticles

  const handleEdit = (article: Article) => {
    setSelectedArticle(article)
    setIsEditDialogOpen(true)
  }

  const handleDelete = async (article: Article) => {
    await deleteArticle.mutateAsync(article.id)
  }

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false)
    setSelectedArticle(undefined)
  }

  const columns = createColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  })

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-600">Chargement des articles...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              <p>Erreur lors du chargement des articles</p>
              <p className="text-sm mt-1">Veuillez réessayer plus tard</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Gestion des Articles</CardTitle>
              <CardDescription>
                Gérez les articles de votre système d&apos;inventaire
              </CardDescription>
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nouvel Article
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={articles} />
        </CardContent>
      </Card>

      <ArticleForm
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        mode="create"
      />

      <ArticleForm
        open={isEditDialogOpen}
        onOpenChange={handleCloseEditDialog}
        article={selectedArticle}
        mode="edit"
      />
    </div>
  )
}
