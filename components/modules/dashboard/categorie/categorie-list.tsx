"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Package } from "lucide-react"
import { useCategories, useCategorie } from "@/hooks/useCategories"
import { useEnterprises } from "@/hooks/useEnterprises"
import { Categorie } from "@/types"
import { DataTable } from "./data-table"
import { createColumns } from "./columns"
import { CategorieForm } from "./categorie-form"
import { LoadingContent } from "@/components/global/loading-content"
import { EmptyState } from "@/components/global/empty-state"

export function CategorieList() {
  const { getCategories } = useCategories()
  const { getEnterprises } = useEnterprises()
  const { deleteCategorie } = useCategorie({})
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedCategorie, setSelectedCategorie] = useState<Categorie | undefined>()
  const [formMode, setFormMode] = useState<"create" | "edit">("create")

  // Combine categories with enterprise names
  const categoriesWithEnterprises = useMemo(() => {
    if (!getCategories.data || !getEnterprises.data) return []
    
    return getCategories.data.map(categorie => ({
      ...categorie,
      entreprise: getEnterprises.data.find(enterprise => enterprise.id === categorie.entrepriseId)
    }))
  }, [getCategories.data, getEnterprises.data])

  const handleEdit = (categorie: Categorie) => {
    setSelectedCategorie(categorie)
    setFormMode("edit")
    setIsFormOpen(true)
  }

  const handleDelete = async (categorie: Categorie) => {
    await deleteCategorie.mutateAsync(categorie.id)
  }

  const handleCreate = () => {
    setSelectedCategorie(undefined)
    setFormMode("create")
    setIsFormOpen(true)
  }

  const columns = createColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  })

  if (getCategories.isLoading || getEnterprises.isLoading) {
    return (
      <LoadingContent 
        className="min-h-[400px]"
        loadingText="Chargement des catégories..."
        icon={Package}
      />
    )
  }

  if (getCategories.error || getEnterprises.error) {
    return (
      <div className="container mx-auto">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              <p>Erreur lors du chargement des catégories</p>
              <p className="text-sm mt-1">Veuillez réessayer plus tard</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestion des Catégories</h1>
          <p className="text-muted-foreground text-sm">
            Gérez les catégories de votre système
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle Catégorie
        </Button>
      </div>
      <Card>
        <CardContent>
          {categoriesWithEnterprises.length === 0 ? (
            <EmptyState
              icon={Package}
              title="Aucune catégorie"
              description="Vous n'avez pas encore de catégories. Créez votre première catégorie pour commencer."
              action={{
                label: "Créer une catégorie",
                onClick: handleCreate
              }}
            />
          ) : (
            <DataTable columns={columns} data={categoriesWithEnterprises} />
          )}
        </CardContent>
      </Card>

      <CategorieForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        categorie={selectedCategorie}
        mode={formMode}
      />
    </div>
  )
}
