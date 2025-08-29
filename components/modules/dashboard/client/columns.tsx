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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Client } from "@/types"

interface ClientColumnsProps {
  onEdit: (client: Client) => void
  onDelete: (client: Client) => void
}

export const createClientColumns = ({ onEdit, onDelete }: ClientColumnsProps): ColumnDef<Client>[] => [
  {
    accessorKey: "photo",
    header: "Photo",
    cell: ({ row }) => {
      const client = row.original
      return (
        <Avatar className="h-10 w-10">
          <AvatarImage src={client.photo || undefined} />
          <AvatarFallback>
            {client.prenom?.[0]?.toUpperCase() || ""}
            {client.nom?.[0]?.toUpperCase() || ""}
          </AvatarFallback>
        </Avatar>
      )
    },
  },
  {
    accessorKey: "nom",
    header: "Nom complet",
    cell: ({ row }) => {
      const client = row.original
      return (
        <div className="flex flex-col">
          <span className="font-medium">
            {client.prenom} {client.nom}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const email = row.getValue("email") as string
      return <span className="text-muted-foreground">{email}</span>
    },
  },
  {
    accessorKey: "numTel",
    header: "Téléphone",
    cell: ({ row }) => {
      const numTel = row.getValue("numTel") as string
      return <span className="text-muted-foreground">{numTel}</span>
    },
  },
  {
    accessorKey: "adresse",
    header: "Adresse",
    cell: ({ row }) => {
      const client = row.original
      const adresse = client.adresse
      return (
        <div className="flex flex-col text-sm">
          <span>{adresse.adresse1}</span>
          {adresse.adresse2 && (
            <span className="text-muted-foreground">{adresse.adresse2}</span>
          )}
          <span className="text-muted-foreground">
            {adresse.codePostal} {adresse.ville}, {adresse.pays}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "entreprise",
    header: "Entreprise",
    cell: ({ row }) => {
      const client = row.original
      const entreprise = client.entreprise
      return (
        <Badge variant="secondary" className="font-normal">
          {entreprise.nomEntreprise}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const client = row.original

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
              onClick={() => navigator.clipboard.writeText(client.email)}
            >
              Copier l&apos;email
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(client.numTel)}
            >
              Copier le téléphone
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onEdit(client)}>
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(client)}
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
