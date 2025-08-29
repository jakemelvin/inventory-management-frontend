"use client"

import { useState } from "react"
import { Plus, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useFournisseurs, useFournisseur } from "@/hooks/useFournisseur"
import { DataTable } from "./data-table"
import { createColumns } from "./columns"
import { FournisseurForm } from "./fournisseur-form"
import { FournisseurDetail } from "./fournisseur-detail"
import { LoadingContent } from "@/components/global/loading-content"
import { EmptyState } from "@/components/global/empty-state"
import { Fournisseur } from "@/types/fournisseur"

export function FournisseursTable() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [selectedFournisseur, setSelectedFournisseur] = useState<Fournisseur | undefined>()

  const { getFournisseurs } = useFournisseurs()
  const { deleteFournisseur } = useFournisseur({})
  const { data: fournisseurs = [], isLoading, error } = getFournisseurs

  const handleEdit = (fournisseur: Fournisseur) => {
    setSelectedFournisseur(fournisseur)
    setIsEditDialogOpen(true)
  }

  const handleDetail = (fournisseur: Fournisseur) => {
    setSelectedFournisseur(fournisseur)
    setIsDetailDialogOpen(true)
  }

  const handleDelete = async (fournisseur: Fournisseur) => {
    await deleteFournisseur.mutateAsync(fournisseur.id)
  }

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false)
    setSelectedFournisseur(undefined)
  }

  const handleCloseDetailDialog = () => {
    setIsDetailDialogOpen(false)
    setSelectedFournisseur(undefined)
  }

  const columns = createColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
    onDetail: handleDetail,
  })

  if (isLoading) {
    return (
      <LoadingContent 
        className="min-h-[400px]"
        loadingText="Chargement des fournisseurs..."
        icon={Truck}
      />
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              <p>Erreur lors du chargement des fournisseurs</p>
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
              <CardTitle>Gestion des Fournisseurs</CardTitle>
              <CardDescription>
                Gérez les fournisseurs de votre système d&apos;inventaire
              </CardDescription>
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau Fournisseur
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {fournisseurs.length === 0 ? (
            <EmptyState
              icon={Truck}
              title="Aucun fournisseur"
              description="Vous n'avez pas encore de fournisseurs. Créez votre premier fournisseur pour commencer."
              action={{
                label: "Créer un fournisseur",
                onClick: () => setIsCreateDialogOpen(true)
              }}
            />
          ) : (
            <DataTable columns={columns} data={fournisseurs} />
          )}
        </CardContent>
      </Card>

      <FournisseurForm
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        mode="create"
      />

      <FournisseurForm
        open={isEditDialogOpen}
        onOpenChange={handleCloseEditDialog}
        fournisseur={selectedFournisseur}
        mode="edit"
      />

      <FournisseurDetail
        open={isDetailDialogOpen}
        onOpenChange={handleCloseDetailDialog}
        fournisseur={selectedFournisseur}
      />
    </div>
  )
}