"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useVentes, useVente } from "@/hooks/useVente"
import { DataTable } from "./data-table"
import { createColumns } from "./columns"
import { VenteForm } from "./vente-form"
import { VentesResponseDto } from "@/types/vente"

export function VentesTable() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedVente, setSelectedVente] = useState<VentesResponseDto | undefined>()

  const { getVentes } = useVentes()
  const { deleteVente } = useVente({})
  const { data: ventes = [], isLoading, error } = getVentes

  const handleEdit = (vente: VentesResponseDto) => {
    setSelectedVente(vente)
    setIsEditDialogOpen(true)
  }

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false)
    setSelectedVente(undefined)
  }

  const handleDelete = async (vente: VentesResponseDto) => {
    await deleteVente.mutateAsync(vente.id)
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
                <p className="mt-2 text-sm text-gray-600">Chargement des ventes...</p>
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
              <p>Erreur lors du chargement des ventes</p>
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
              <CardTitle>Gestion des Ventes</CardTitle>
              <CardDescription>
                Gérez les ventes de votre système d&apos;inventaire
              </CardDescription>
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle Vente
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={ventes} />
        </CardContent>
      </Card>

      <VenteForm
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        mode="create"
      />

      <VenteForm
        open={isEditDialogOpen}
        onOpenChange={handleCloseEditDialog}
        vente={selectedVente}
        mode="edit"
      />
    </div>
  )
}