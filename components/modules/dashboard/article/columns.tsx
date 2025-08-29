"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Article } from "@/types"
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
import { Badge } from "@/components/ui/badge"

interface ColumnsProps {
  onEdit: (article: Article) => void
  onDelete: (article: Article) => void
}

export const createColumns = ({ onEdit, onDelete }: ColumnsProps): ColumnDef<Article>[] => [
  {
    accessorKey: "codeArticle",
    header: "Code Article",
  },
  {
    accessorKey: "designation",
    header: "Désignation",
  },
  {
    accessorKey: "categorie",
    header: "Catégorie",
    cell: ({ row }) => {
      const categorie = row.getValue("categorie") as Article["categorie"]
      return (
        <Badge variant="outline">
          {categorie?.designation}
        </Badge>
      )
    },
  },
  {
    accessorKey: "entreprise",
    header: "Entreprise",
    cell: ({ row }) => {
      const entreprise = row.getValue("entreprise") as Article["entreprise"]
      return <div>{entreprise?.nomEntreprise}</div>
    },
  },
  {
    accessorKey: "prixUnitaire",
    header: "Prix Unitaire",
    cell: ({ row }) => {
      const prix = row.getValue("prixUnitaire") as number
      return <div>{prix?.toFixed(2)} €</div>
    },
  },
  {
    accessorKey: "tauxTva",
    header: "Taux TVA",
    cell: ({ row }) => {
      const taux = row.getValue("tauxTva") as number
      return <div>{taux}%</div>
    },
  },
  {
    accessorKey: "prixUnitaireTtc",
    header: "Prix TTC",
    cell: ({ row }) => {
      const prixTtc = row.getValue("prixUnitaireTtc") as number
      return <div className="font-medium">{prixTtc?.toFixed(2)} €</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const article = row.original

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
              onClick={() => navigator.clipboard.writeText(article.id.toString())}
            >
              Copier l&apos;ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onEdit(article)}>
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
                    l&apos;article &quot;{article.designation}&quot; de nos serveurs.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => onDelete(article)}
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
