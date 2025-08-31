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
import { useCommandesFournisseurs, useCommandeFournisseur } from "@/hooks/useCommandesFournisseurs"
import { CommandeFournisseur } from "@/types"
import { CommandeFournisseurForm } from "./commande-fournisseur-form"
import { CommandeFournisseurDetailsDialog } from "./commande-fournisseur-details-dialog"
import { DataTable } from "./data-table"
import { createCommandeFournisseurColumns } from "./columns"

export function CommandeFournisseurList() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [selectedCommandeFournisseur, setSelectedCommandeFournisseur] = useState<CommandeFournisseur | null>(null)

  const { getCommandesFournisseurs } = useCommandesFournisseurs()
  const { deleteCommandeFournisseur } = useCommandeFournisseur({ commandeFournisseurId: selectedCommandeFournisseur?.id })

  const handleEdit = (commandeFournisseur: CommandeFournisseur) => {
    setSelectedCommandeFournisseur(commandeFournisseur)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (commandeFournisseur: CommandeFournisseur) => {
    setSelectedCommandeFournisseur(commandeFournisseur)
    setIsDeleteDialogOpen(true)
  }

  const handleViewDetails = (commandeFournisseur: CommandeFournisseur) => {
    setSelectedCommandeFournisseur(commandeFournisseur)
    setIsDetailsDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (selectedCommandeFournisseur) {
      await deleteCommandeFournisseur.mutateAsync(selectedCommandeFournisseur.id)
      setIsDeleteDialogOpen(false)
      setSelectedCommandeFournisseur(null)
    }
  }

  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false)
  }

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false)
    setSelectedCommandeFournisseur(null)
  }

  const columns = createCommandeFournisseurColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
    onViewDetails: handleViewDetails,
  })

  if (getCommandesFournisseurs.isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-48" />
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
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

  if (getCommandesFournisseurs.error) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestion des Commandes Fournisseurs</h1>
            <p className="text-muted-foreground">
              Gérez vos commandes fournisseurs et leurs articles
            </p>
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <h3 className="text-lg font-semibold text-red-600">Erreur</h3>
              <p className="text-muted-foreground mt-2">
                Impossible de charger les commandes fournisseurs. Veuillez réessayer.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const commandesFournisseurs = getCommandesFournisseurs.data || []

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Commandes Fournisseurs</h1>
          <p className="text-muted-foreground">
            Gérez vos commandes fournisseurs et leurs articles
          </p>
        </div>
        <Dialog modal={false} open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle Commande Fournisseur
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Créer une nouvelle commande fournisseur</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <CommandeFournisseurForm
                mode="create"
                onSuccess={handleCreateSuccess}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardContent className="p-6">
          <DataTable columns={columns} data={commandesFournisseurs} />
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog modal={false} open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier la commande fournisseur</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {selectedCommandeFournisseur && (
              <CommandeFournisseurForm
                mode="edit"
                commandeFournisseur={selectedCommandeFournisseur}
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
              la commande fournisseur {selectedCommandeFournisseur?.code} et toutes ses données associées.
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

      {/* Details Dialog */}
      <CommandeFournisseurDetailsDialog
        commandeFournisseur={selectedCommandeFournisseur}
        open={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
      />
    </div>
  )
}
