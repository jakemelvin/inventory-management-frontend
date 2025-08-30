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
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Utilisateur } from "@/types"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface ColumnsProps {
  onEdit: (utilisateur: Utilisateur) => void
  onDelete: (id: number) => void
}

export const createColumns = ({ onEdit, onDelete }: ColumnsProps): ColumnDef<Utilisateur>[] => [
  {
    accessorKey: "photo",
    header: "Photo",
    cell: ({ row }) => {
      const utilisateur = row.original
      return (
        <Avatar className="h-10 w-10">
          <AvatarImage src={utilisateur.photo || ""} alt={`${utilisateur.prenom} ${utilisateur.nom}`} />
          <AvatarFallback>
            {utilisateur.prenom.charAt(0)}{utilisateur.nom.charAt(0)}
          </AvatarFallback>
        </Avatar>
      )
    },
  },
  {
    accessorKey: "nom",
    header: "Nom",
    cell: ({ row }) => {
      const utilisateur = row.original
      return (
        <div>
          <div className="font-medium">{utilisateur.nom}</div>
          <div className="text-sm text-muted-foreground">{utilisateur.prenom}</div>
        </div>
      )
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "dateDeNaissance",
    header: "Date de naissance",
    cell: ({ row }) => {
      const date = row.getValue("dateDeNaissance") as string
      if (!date) return <span className="text-muted-foreground">Non renseignée</span>
      return format(new Date(date), "dd MMMM yyyy", { locale: fr })
    },
  },
  {
    accessorKey: "entreprise",
    header: "Entreprise",
    cell: ({ row }) => {
      const entreprise = row.original.entreprise
      if (!entreprise) return <span className="text-muted-foreground">Aucune</span>
      return (
        <div>
          <div className="font-medium">{entreprise.nomEntreprise}</div>
          <div className="text-sm text-muted-foreground">{entreprise.email}</div>
        </div>
      )
    },
  },
  {
    accessorKey: "adresse",
    header: "Adresse",
    cell: ({ row }) => {
      const adresse = row.original.adresse
      if (!adresse) return <span className="text-muted-foreground">Non renseignée</span>
      return (
        <div className="text-sm">
          <div>{adresse.adresse1}</div>
          {adresse.adresse2 && <div>{adresse.adresse2}</div>}
          <div>{adresse.ville}, {adresse.codePostal}</div>
          <div>{adresse.pays}</div>
        </div>
      )
    },
  },
  {
    accessorKey: "roles",
    header: "Rôles",
    cell: ({ row }) => {
      const roles = row.original.roles
      if (!roles || roles.length === 0) {
        return <span className="text-muted-foreground">Aucun rôle</span>
      }
      return (
        <div className="flex flex-wrap gap-1">
          {roles.map((role) => (
            <Badge key={role.id} variant="secondary">
              {role.roleName}
            </Badge>
          ))}
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const utilisateur = row.original

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
            <DropdownMenuItem onClick={() => onEdit(utilisateur)}>
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </DropdownMenuItem>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive hover:text-destructive/90">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action ne peut pas être annulée. Cela supprimera définitivement l&apos;utilisateur {utilisateur.prenom} {utilisateur.nom}.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(utilisateur.id)} className="bg-destructive text-primary-foreground hover:bg-destructive/90">
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
