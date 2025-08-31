"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Role } from "@/types/role"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Edit, Trash2 } from "lucide-react"
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

interface ColumnsProps {
  onEdit: (role: Role) => void
  onDelete: (role: Role) => void
}

export const createColumns = ({ onEdit, onDelete }: ColumnsProps): ColumnDef<Role>[] => [
  {
    accessorKey: "roleName",
    header: "Nom du Rôle",
  },
  {
    accessorKey: "utilisateur",
    header: "Utilisateur",
    cell: ({ row }) => {
      const role = row.original
      const userName = role.utilisateur ? `${role.utilisateur.firstName} ${role.utilisateur.lastName}` : `ID: ${role.utilisateurId}`
      return (
        <div>
          {userName}
        </div>
      )
    },
  },
  {
    accessorKey: "entreprise",
    header: "Entreprise",
    cell: ({ row }) => {
      const role = row.original
      const entrepriseName = role.entreprise?.nomEntreprise || `ID: ${role.entrepriseId}`
      return (
        <div>
          {entrepriseName}
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const role = row.original

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
            <DropdownMenuItem onClick={() => onEdit(role)}>
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </DropdownMenuItem>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem 
                  className="text-red-600"
                  onSelect={(e) => e.preventDefault()}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action ne peut pas être annulée. Cela supprimera définitivement 
                    le rôle &quot;{role.roleName}&quot; de nos serveurs.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => onDelete(role)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Supprimer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
