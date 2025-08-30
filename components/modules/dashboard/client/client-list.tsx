"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useClients, useClient } from "@/hooks/useClients"
import { Client } from "@/types"
import { ClientForm } from "./client-form"
import { DataTable } from "./data-table"
import { createClientColumns } from "./columns"

export function ClientList() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)

  const { getClients } = useClients()
  const { deleteClient } = useClient({ clientId: selectedClient?.id })

  const handleEdit = (client: Client) => {
    setSelectedClient(client)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (client: Client) => {
    setSelectedClient(client)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (selectedClient) {
      await deleteClient.mutateAsync(selectedClient.id)
      setIsDeleteDialogOpen(false)
      setSelectedClient(null)
    }
  }

  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false)
  }

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false)
    setSelectedClient(null)
  }

  const columns = createClientColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  })

  if (getClients.isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={`skeleton-${i}`} className="flex items-center space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-8 w-8" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (getClients.error) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestion des Clients</h1>
            <p className="text-muted-foreground">
              Gérez vos clients et leurs informations
            </p>
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              <p>Une erreur est survenue lors du chargement des clients.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const clients = getClients.data || []

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Clients</h1>
          <p className="text-muted-foreground">
            Gérez vos clients et leurs informations
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau Client
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Créer un nouveau client</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <ClientForm
                mode="create"
                onSuccess={handleCreateSuccess}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <DataTable columns={columns} data={clients} />
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier le client</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {selectedClient && (
              <ClientForm
                mode="edit"
                client={selectedClient}
                onSuccess={handleEditSuccess}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cela supprimera définitivement
              le client {selectedClient?.prenom} {selectedClient?.nom} et toutes ses données associées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
