"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Enterprise } from "@/types"
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
  onEdit: (enterprise: Enterprise) => void
  onDelete: (enterprise: Enterprise) => void
}

export const createColumns = ({ onEdit, onDelete }: ColumnsProps): ColumnDef<Enterprise>[] => [
  {
    accessorKey: "nomEntreprise",
    header: "Nom de l'entreprise",
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
      const adresse = row.getValue("adresse") as Enterprise["adresse"]
      return <div>{adresse?.ville}</div>
    },
  },
  {
    accessorKey: "codeFiscal",
    header: "Code Fiscal",
  },
  {
    accessorKey: "steWeb",
    header: "Site Web",
    cell: ({ row }) => {
      const steWeb = row.getValue("steWeb") as string
      return steWeb ? (
        <a 
          href={`https://${steWeb}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {steWeb}
        </a>
      ) : (
        <span className="text-gray-400">-</span>
      )
    },
  },
  {
    accessorKey: "creationDate",
    header: "Date de création",
    cell: ({ row }) => {
      const date = row.getValue("creationDate") as string
      return date ? new Date(date).toLocaleDateString('fr-FR') : '-'
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const enterprise = row.original

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
              onClick={() => navigator.clipboard.writeText(enterprise.id.toString())}
            >
              Copier l&apos;ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onEdit(enterprise)}>
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
                    l&apos;entreprise &quot;{enterprise.nomEntreprise}&quot; de nos serveurs.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => onDelete(enterprise)}
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
