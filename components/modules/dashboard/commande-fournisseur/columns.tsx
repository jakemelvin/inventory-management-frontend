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
import { Badge } from "@/components/ui/badge"
import { CommandeFournisseur } from "@/types"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface CommandeFournisseurColumnsProps {
  onEdit: (commandeFournisseur: CommandeFournisseur) => void
  onDelete: (commandeFournisseur: CommandeFournisseur) => void
  onViewDetails: (commandeFournisseur: CommandeFournisseur) => void
}

export const createCommandeFournisseurColumns = ({ onEdit, onDelete, onViewDetails }: CommandeFournisseurColumnsProps): ColumnDef<CommandeFournisseur>[] => [
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => {
      const code = row.getValue("code") as string
      return <span className="font-medium">{code}</span>
    },
  },
  {
    accessorKey: "dateCommande",
    header: "Date de commande",
    cell: ({ row }) => {
      const date = row.getValue("dateCommande") as string
      return (
        <span className="text-muted-foreground">
          {format(new Date(date), "PPP", { locale: fr })}
        </span>
      )
    },
  },
  {
    accessorKey: "fournisseur",
    header: "Fournisseur",
    cell: ({ row }) => {
      const commandeFournisseur = row.original
      const fournisseur = commandeFournisseur.fournisseur
      return (
        <div className="flex flex-col">
          <span className="font-medium">
            {fournisseur.prenom} {fournisseur.nom}
          </span>
          <span className="text-sm text-muted-foreground">
            {fournisseur.email}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "ligneCommandeFournisseurs",
    header: "Articles",
    cell: ({ row }) => {
      const commandeFournisseur = row.original
      const lignes = commandeFournisseur.ligneCommandeFournisseurs || []
      return (
        <Badge variant="secondary">
          {lignes.length} article{lignes.length > 1 ? 's' : ''}
        </Badge>
      )
    },
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => {
      const commandeFournisseur = row.original
      const lignes = commandeFournisseur.ligneCommandeFournisseurs || []
      const total = lignes.reduce((sum, ligne) => sum + (ligne.quantite * ligne.prixUnitaire), 0)
      return (
        <span className="font-medium">
          {total.toFixed(2)}€
        </span>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const commandeFournisseur = row.original

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
            <DropdownMenuItem onClick={() => onViewDetails(commandeFournisseur)}>
              Voir les détails
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(commandeFournisseur.code)}
            >
              Copier le code
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onEdit(commandeFournisseur)}>
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(commandeFournisseur)}
              className="text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
