"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useCategories, useCategorie } from "@/hooks/useCategories"
import { useEnterprises } from "@/hooks/useEnterprises"
import { Categorie } from "@/types"
import { DataTable } from "./data-table"
import { createColumns } from "./columns"
import { CategorieForm } from "./categorie-form"
import { LoadingContent } from "@/components/global/loading-content"

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
    return <LoadingContent />
  }

  if (getCategories.error || getEnterprises.error) {
    return (
      <div className="flex items-center justify-center h-32">
        <p className="text-red-500">Erreur lors du chargement des données</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Catégories</h2>
          <p className="text-muted-foreground">
            Gérez vos catégories d&apos;articles
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle catégorie
        </Button>
      </div>

      <DataTable columns={columns} data={categoriesWithEnterprises} />

      <CategorieForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        categorie={selectedCategorie}
        mode={formMode}
      />
    </div>
  )
}
