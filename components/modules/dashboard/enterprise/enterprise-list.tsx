"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEnterprises, useEnterprise } from "@/hooks/useEnterprises"
import { DataTable } from "./data-table"
import { createColumns } from "./columns"
import { EnterpriseForm } from "./enterprise-form"
import { Enterprise } from "@/types"

export function EnterpriseList() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedEnterprise, setSelectedEnterprise] = useState<Enterprise | undefined>()

  const { getEnterprises } = useEnterprises()
  const { deleteEnterprise } = useEnterprise({})
  const { data: enterprises = [], isLoading, error } = getEnterprises

  const handleEdit = (enterprise: Enterprise) => {
    setSelectedEnterprise(enterprise)
    setIsEditDialogOpen(true)
  }

  const handleDelete = async (enterprise: Enterprise) => {
    await deleteEnterprise.mutateAsync(enterprise.id)
  }

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false)
    setSelectedEnterprise(undefined)
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
                <p className="mt-2 text-sm text-gray-600">Chargement des entreprises...</p>
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
              <p>Erreur lors du chargement des entreprises</p>
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
              <CardTitle>Gestion des Entreprises</CardTitle>
              <CardDescription>
                Gérez les entreprises de votre système d&apos;inventaire
              </CardDescription>
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle Entreprise
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={enterprises} />
        </CardContent>
      </Card>

      <EnterpriseForm
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        mode="create"
      />

      <EnterpriseForm
        open={isEditDialogOpen}
        onOpenChange={handleCloseEditDialog}
        enterprise={selectedEnterprise}
        mode="edit"
      />
    </div>
  )
}
