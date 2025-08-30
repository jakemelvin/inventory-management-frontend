"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useUtilisateurs, useDeleteUtilisateur } from "@/hooks/useUtilisateurs"
import { useEnterprises } from "@/hooks/useEnterprises"
import { Utilisateur, Entreprise } from "@/types"
import { DataTable } from "./data-table"
import { createColumns } from "./columns"
import { UtilisateurForm } from "./utilisateur-form"

export function UtilisateurList() {
  const [selectedUtilisateur, setSelectedUtilisateur] = useState<Utilisateur | undefined>()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<"create" | "edit">("create")
  const { data: utilisateurs = [], isLoading } = useUtilisateurs()
  const { getEnterprises } = useEnterprises()
  const entreprises: Entreprise[] = (getEnterprises.data || []).map((enterprise) => ({
    id: enterprise.id,
    nomEntreprise: enterprise.nomEntreprise,
    description: enterprise.description,
    photo: enterprise.photo || undefined,
    email: enterprise.email,
    adresse: {
      id: enterprise.adresse.id || undefined,
      adresse1: enterprise.adresse.adresse1,
      adresse2: enterprise.adresse.adresse2 || undefined,
      ville: enterprise.adresse.ville,
      codePostal: enterprise.adresse.codePostal,
      pays: enterprise.adresse.pays,
    },
    codeFiscal: enterprise.codeFiscal,
    numTel: enterprise.numTel,
    steWeb: enterprise.steWeb,
    creationDate: enterprise.creationDate || ""
  }))
  const deleteUtilisateur = useDeleteUtilisateur()

  const handleCreate = () => {
    setSelectedUtilisateur(undefined)
    setFormMode("create")
    setIsFormOpen(true)
  }

  const handleEdit = (utilisateur: Utilisateur) => {
    setSelectedUtilisateur(utilisateur)
    setFormMode("edit")
    setIsFormOpen(true)
  }

  const handleDelete = async (id: number) => {
    await deleteUtilisateur.mutateAsync(id)
  }

  const columns = createColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  })

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gestion des Utilisateurs</CardTitle>
          <CardDescription>
            Gérez les utilisateurs de votre système
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="text-muted-foreground">Chargement...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Gestion des Utilisateurs</CardTitle>
              <CardDescription>
                Gérez les utilisateurs de votre système ({utilisateurs.length} utilisateur{utilisateurs.length > 1 ? 's' : ''})
              </CardDescription>
            </div>
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Nouvel utilisateur
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={utilisateurs} />
        </CardContent>
      </Card>

      <UtilisateurForm
        utilisateur={selectedUtilisateur}
        entreprises={entreprises}
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        mode={formMode}
      />
    </>
  )
}
