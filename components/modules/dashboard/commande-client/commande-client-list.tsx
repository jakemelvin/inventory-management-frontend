"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useCommandesClients, useCommandeClient } from "@/hooks/useCommandesClients"
import { DataTable } from "./data-table"
import { createColumns } from "./columns"
import { CommandeClientForm } from "./commande-client-form"
import { CommandeClient } from "@/types"

export function CommandeClientList() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedCommandeClient, setSelectedCommandeClient] = useState<CommandeClient | undefined>()

  const { getCommandesClients } = useCommandesClients()
  const { deleteCommandeClient } = useCommandeClient({})
  const { data: commandesClients = [], isLoading, error } = getCommandesClients

  const handleEdit = (commandeClient: CommandeClient) => {
    setSelectedCommandeClient(commandeClient)
    setIsEditDialogOpen(true)
  }

  const handleDelete = async (commandeClient: CommandeClient) => {
    await deleteCommandeClient.mutateAsync(commandeClient.id)
  }

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false)
    setSelectedCommandeClient(undefined)
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
                <p className="mt-2 text-sm text-gray-600">Chargement des commandes clients...</p>
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
              <p>Erreur lors du chargement des commandes clients</p>
              <p className="text-sm mt-1">Veuillez réessayer plus tard</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Commandes Clients</h1>
          <p className="text-muted-foreground">
            Gérez les commandes clients de votre système d&apos;inventaire
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle Commande
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <DataTable columns={columns} data={commandesClients} />
        </CardContent>
      </Card>

      <CommandeClientForm
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        mode="create"
      />

      <CommandeClientForm
        open={isEditDialogOpen}
        onOpenChange={handleCloseEditDialog}
        commandeClient={selectedCommandeClient}
        mode="edit"
      />
    </div>
  )
}
