"use client"

import { useRoles } from "@/hooks/useRoles"
import { useEnterprises } from "@/hooks/useEnterprises"
import { useUtilisateurs } from "@/hooks/useUtilisateurs"
import { DataTable } from "./data-table"
import { createColumns } from "./columns"
import { Role } from "@/types/role"
import { Utilisateur } from "@/types/utilisateur"
import { LoadingContent } from "@/components/global"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useMemo } from "react"

interface RoleListProps {
  onEdit: (role: Role) => void
  onDelete: (role: Role) => void
}

export function RoleList({ onEdit, onDelete }: RoleListProps) {
  const { getRoles } = useRoles()
  const { getEnterprises } = useEnterprises()
  const { data: users } = useUtilisateurs()

  const combinedData = useMemo(() => {
    if (!getRoles.data || !getEnterprises.data || !users) return []
    
    return getRoles.data.map(role => {
      const user = users.find((u: Utilisateur) => u.id === (role as Role & { utilisateurId: number }).utilisateurId)
      const enterprise = getEnterprises.data.find(
        e => e.id === (role as Role & { entrepriseId: number }).entrepriseId
      )
      
      return {
        ...role,
        entreprise: enterprise,
        utilisateur: user ? {
          id: user.id,
          firstName: user.prenom,
          lastName: user.nom,
          email: user.email
        } : undefined
      }
    })
  }, [getRoles.data, getEnterprises.data, users])

  const columns = createColumns({ onEdit, onDelete })

  if (getRoles.isLoading || getEnterprises.isLoading) {
    return <LoadingContent />
  }

  if (getRoles.error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Erreur lors du chargement des rôles: {getRoles.error.message}
        </AlertDescription>
      </Alert>
    )
  }

  if (getEnterprises.error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Erreur lors du chargement des entreprises: {getEnterprises.error.message}
        </AlertDescription>
      </Alert>
    )
  }


  return <DataTable columns={columns} data={combinedData as Role[]} />
}
