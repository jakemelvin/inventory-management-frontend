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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useCommandesFournisseurs, useCommandeFournisseur } from "@/hooks/useCommandesFournisseurs"
import { CommandeFournisseur } from "@/types"
import { CommandeFournisseurForm } from "./commande-fournisseur-form"
import { DataTable } from "./data-table"
import { createCommandeFournisseurColumns } from "./columns"

export function CommandeFournisseurList() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
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
  })

  if (getCommandesFournisseurs.isLoading) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-4 w-96" />
              </div>
              <Skeleton className="h-10 w-48" />
            </div>
          </CardHeader>
          <CardContent>
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
        <Card>
          <CardHeader>
            <CardTitle>Erreur</CardTitle>
            <CardDescription>
              Impossible de charger les commandes fournisseurs. Veuillez réessayer.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const commandesFournisseurs = getCommandesFournisseurs.data || []

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Gestion des Commandes Fournisseurs</CardTitle>
              <CardDescription>
                Gérez vos commandes fournisseurs et leurs articles
              </CardDescription>
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
        </CardHeader>
        <CardContent>
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
    </div>
  )
}
