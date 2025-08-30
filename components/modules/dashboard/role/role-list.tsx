"use client"

import { useRoles } from "@/hooks/useRoles"
import { useEnterprises } from "@/hooks/useEnterprises"
import { useUsers } from "@/hooks/useUsers"
import { DataTable } from "./data-table"
import { createColumns } from "./columns"
import { Role } from "@/types"
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
  const { getUsers } = useUsers()

  const combinedData = useMemo(() => {
    if (!getRoles.data || !getEnterprises.data || !getUsers.data) return []
    
    return getRoles.data.map(role => ({
      ...role,
      entreprise: getEnterprises.data.find(
        enterprise => enterprise.id === role.entrepriseId
      ),
      utilisateur: getUsers.data.find(
        user => user.id === role.utilisateurId
      )
    }))
  }, [getRoles.data, getEnterprises.data, getUsers.data])

  const columns = createColumns({ onEdit, onDelete })

  if (getRoles.isLoading || getEnterprises.isLoading || getUsers.isLoading) {
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

  if (getUsers.error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Erreur lors du chargement des utilisateurs: {getUsers.error.message}
        </AlertDescription>
      </Alert>
    )
  }

  return <DataTable columns={columns} data={combinedData} />
}
