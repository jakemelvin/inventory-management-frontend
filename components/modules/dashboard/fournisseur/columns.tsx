"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Fournisseur } from "@/types/fournisseur"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"
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
  onEdit: (fournisseur: Fournisseur) => void
  onDelete: (fournisseur: Fournisseur) => void
  onDetail: (fournisseur: Fournisseur) => void
}

export const createColumns = ({ onEdit, onDelete, onDetail }: ColumnsProps): ColumnDef<Fournisseur>[] => [
  {
    accessorKey: "nom",
    header: "Nom",
  },
  {
    accessorKey: "prenom",
    header: "Prénom",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "numTel",
    header: "Téléphone",
  },
  {
    accessorKey: "adresse",
    header: "Ville",
    cell: ({ row }) => {
      const adresse = row.getValue("adresse") as Fournisseur["adresse"]
      return <div>{adresse?.ville}</div>
    },
  },
  {
    accessorKey: "entreprise",
    header: "Entreprise",
    cell: ({ row }) => {
      const entreprise = row.getValue("entreprise") as Fournisseur["entreprise"]
      return <div>{entreprise?.nomEntreprise}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const fournisseur = row.original

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
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(fournisseur.id.toString())}
            >
              Copier l&apos;ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onDetail(fournisseur)}>
              <Eye className="mr-2 h-4 w-4" />
              Voir détails
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(fournisseur)}>
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
                    le fournisseur &quot;{fournisseur.nom} {fournisseur.prenom}&quot; de nos serveurs.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => onDelete(fournisseur)}
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