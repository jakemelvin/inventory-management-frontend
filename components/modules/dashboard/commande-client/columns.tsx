"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { CommandeClient } from "@/types"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface ActionsProps {
  onEdit: (commandeClient: CommandeClient) => void
  onDelete: (commandeClient: CommandeClient) => void
}

const ActionsCell = ({ commandeClient, onEdit, onDelete }: { commandeClient: CommandeClient } & ActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Ouvrir le menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onEdit(commandeClient)}>
          <Edit className="mr-2 h-4 w-4" />
          Modifier
        </DropdownMenuItem>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action ne peut pas être annulée. Cette commande client sera définitivement supprimée.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => onDelete(commandeClient)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const createColumns = ({ onEdit, onDelete }: ActionsProps): ColumnDef<CommandeClient>[] => [
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("code")}</div>
    ),
  },
  {
    accessorKey: "dateCommande",
    header: "Date de commande",
    cell: ({ row }) => {
      const date = row.getValue("dateCommande") as string
      return (
        <div>
          {date ? format(new Date(date), "dd MMMM yyyy", { locale: fr }) : "-"}
        </div>
      )
    },
  },
  {
    accessorKey: "ligneCommandeClients",
    header: "Nb. Articles",
    cell: ({ row }) => {
      const lignes = row.original.ligneCommandeClients || []
      return (
        <div className="text-center">
          {lignes.length}
        </div>
      )
    },
  },
  {
    id: "total",
    header: "Total",
    cell: ({ row }) => {
      const lignes = row.original.ligneCommandeClients || []
      const total = lignes.reduce((sum, ligne) => {
        return sum + (ligne.quantite * ligne.prixUnitaire)
      }, 0)
      return (
        <div className="font-medium">
          {new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR'
          }).format(total)}
        </div>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => (
      <ActionsCell 
        commandeClient={row.original} 
        onEdit={onEdit} 
        onDelete={onDelete} 
      />
    ),
  },
]
