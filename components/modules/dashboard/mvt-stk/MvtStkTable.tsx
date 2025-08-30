"use client"

import { useState, useMemo } from "react"
import { Plus, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useMvtStks, useMvtStk } from "@/hooks/useMvtStk"
import { DataTable } from "./data-table"
import { createColumns } from "./columns"
import { MvtStkForm } from "./mvt-stk-form"
import { MvtStkDetails } from "./mvt-stk-details"
import { LoadingContent } from "@/components/global/loading-content"
import { EmptyState } from "@/components/global/empty-state"
import { MvtStk } from "@/types"

export function MvtStkTable() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedMvtStk, setSelectedMvtStk] = useState<MvtStk | undefined>()

  const { getMvtStks } = useMvtStks()
  const { deleteMvtStk } = useMvtStk({})
  const { data: mvtStks = [], isLoading, error } = getMvtStks

  const combinedData = useMemo(() => {
    if (!mvtStks || mvtStks.length === 0) return []
    
    return mvtStks
  }, [mvtStks])

  const handleEdit = (mvtStk: MvtStk) => {
    setSelectedMvtStk(mvtStk)
    setIsEditDialogOpen(true)
  }

  const handleView = (mvtStk: MvtStk) => {
    setSelectedMvtStk(mvtStk)
    setIsViewDialogOpen(true)
  }

  const handleDelete = (mvtStk: MvtStk) => {
    deleteMvtStk.mutate(mvtStk.id)
  }

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false)
    setSelectedMvtStk(undefined)
  }

  const columns = createColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
    onView: handleView,
  })

  if (isLoading) {
    return (
      <LoadingContent 
        className="min-h-[400px]"
        loadingText="Chargement des mouvements de stock..."
        icon={Package}
      />
    )
  }

  if (error) {
    return (
      <div className="container mx-auto">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              <p>Erreur lors du chargement des mouvements de stock</p>
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
          <h1 className="text-2xl font-bold tracking-tight">Mouvements de Stock</h1>
          <p className="text-muted-foreground text-sm">
            Gérez les entrées et sorties de stock
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau Mouvement
        </Button>
      </div>
      <Card>
        <CardContent>
          {combinedData.length === 0 ? (
            <EmptyState
              icon={Package}
              title="Aucun mouvement de stock"
              description="Vous n'avez pas encore de mouvements de stock. Créez votre premier mouvement pour commencer."
              action={{
                label: "Créer un mouvement",
                onClick: () => setIsCreateDialogOpen(true)
              }}
            />
          ) : (
            <DataTable columns={columns} data={combinedData} />
          )}
        </CardContent>
      </Card>

      <MvtStkForm
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        mode="create"
      />

      <MvtStkForm
        open={isEditDialogOpen}
        onOpenChange={handleCloseEditDialog}
        mvtStk={selectedMvtStk}
        mode="edit"
      />

      <MvtStkDetails
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        mvtStk={selectedMvtStk}
      />
    </div>
  )
}
