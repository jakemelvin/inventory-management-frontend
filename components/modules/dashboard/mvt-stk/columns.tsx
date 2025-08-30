"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MvtStk, TypeMvtStk } from "@/types"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Edit, Trash2, TrendingUp, TrendingDown, Eye } from "lucide-react"
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
  onEdit: (mvtStk: MvtStk) => void
  onDelete: (mvtStk: MvtStk) => void
  onView?: (mvtStk: MvtStk) => void
}

export const createColumns = ({ onEdit, onDelete, onView }: ColumnsProps): ColumnDef<MvtStk>[] => [
  {
    accessorKey: "dateMvt",
    header: () => (
      <div className="text-center">Date</div>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("dateMvt"))
      return (
        <div className="text-center">
          {date.toLocaleDateString("fr-FR")}
        </div>
      )
    },
  },
  {
    accessorKey: "article_designation",
    header: () => (
      <div className="text-center">Article</div>
    ),
    cell: ({ row }) => {
      const mvtStk = row.original
      return (
        <div className="flex flex-col max-w-[180px] text-center">
          <span className="font-medium">{mvtStk.article?.designation}</span>
          <span className="text-sm text-muted-foreground">{mvtStk.article?.codeArticle}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      const mvtStk = row.original
      const searchValue = value.toLowerCase()
      return (
        mvtStk.article?.designation?.toLowerCase().includes(searchValue) ||
        mvtStk.article?.codeArticle?.toLowerCase().includes(searchValue)
      )
    },
  },
  {
    accessorKey: "typeMvt",
    header: () => (
      <div className="text-center">Type</div>
    ),
    cell: ({ row }) => {
      const type = row.getValue("typeMvt") as TypeMvtStk
      return (
        <div className="flex justify-center">
          <Badge 
            variant={type === TypeMvtStk.ENTREE ? "default" : "destructive"}
            className="flex items-center gap-1 w-fit"
          >
            {type === TypeMvtStk.ENTREE ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {type}
          </Badge>
        </div>
      )
    },
  },
  {
    accessorKey: "quantite",
    header: () => (
      <div className="text-center">Quantité</div>
    ),
    cell: ({ row }) => {
      const mvtStk = row.original
      const quantite = mvtStk.quantite
      return (
        <div className="text-center font-medium min-w-[100px]">
          {quantite ? quantite.toLocaleString("fr-FR") : "0"}
        </div>
      )
    },
  },
  {
    accessorKey: "article.categorie.designation",
    header: () => (
      <div className="text-center">Catégorie</div>
    ),
    cell: ({ row }) => {
      const mvtStk = row.original
      return (
        <div className="min-w-[120px] px-2 text-center">
          {mvtStk.article?.categorie?.designation || "-"}
        </div>
      )
    },
  },
  {
    id: "actions",
    header: () => (
      <div className="text-center">Actions</div>
    ),
    cell: ({ row }) => {
      const mvtStk = row.original

      return (
        <div className="flex justify-center">
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
            <DropdownMenuItem onClick={() => onView?.(mvtStk)}>
              <Eye className="mr-2 h-4 w-4" />
              Voir détails
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(mvtStk)}>
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
                    ce mouvement de stock de nos serveurs.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => onDelete(mvtStk)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Supprimer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
        </div>
      )
    },
  },
]
