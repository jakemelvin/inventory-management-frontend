"use client"

import { useState, useMemo } from "react"
import { Plus, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRoles, useRole } from "@/hooks/useRoles"
import { useEnterprises } from "@/hooks/useEnterprises"
import { useUtilisateurs } from "@/hooks/useUtilisateurs"
import { DataTable } from "./data-table"
import { createColumns } from "./columns"
import { RoleForm } from "./role-form"
import { LoadingContent } from "@/components/global/loading-content"
import { EmptyState } from "@/components/global/empty-state"
import { Role } from "@/types/role"
import { Utilisateur } from "@/types/utilisateur"
import { Enterprise } from "@/types/enterprise"

export function RolesTable() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | undefined>()

  const { getRoles } = useRoles()
  const { getEnterprises } = useEnterprises()
  const { data: users } = useUtilisateurs()
  const { deleteRole } = useRole({})
  const { data: roles = [], isLoading, error } = getRoles

  const combinedData = useMemo(() => {
  
    
    if (!roles || roles.length === 0) return []
    
    const combined = roles.map(role => {
      const user = users?.find((u: Utilisateur) => u.id === (role as Role & { utilisateurId: number }).utilisateurId)
      const enterprise = getEnterprises.data?.find((e: Enterprise) => e.id === (role as Role & { entrepriseId: number }).entrepriseId)
            
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
    
    console.log('Final combined data:', combined)
    return combined
  }, [roles, getEnterprises.data, users])

  const handleEdit = (role: Role) => {
    setSelectedRole(role)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (role: Role) => {
    deleteRole.mutate(role.id)
  }

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false)
    setSelectedRole(undefined)
  }

  const columns = createColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  })

  if (isLoading) {
    return (
      <LoadingContent 
        className="min-h-[400px]"
        loadingText="Chargement des rôles..."
        icon={Users}
      />
    )
  }

  if (error) {
    return (
      <div className="container mx-auto">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              <p>Erreur lors du chargement des rôles</p>
              <p className="text-sm mt-1">Veuillez réessayer plus tard</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestion des Rôles</h1>
          <p className="text-muted-foreground text-sm">
            Gérez les rôles de votre système
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau Rôle
        </Button>
      </div>
      <Card>
        <CardContent>
          {combinedData.length === 0 ? (
            <EmptyState
              icon={Users}
              title="Aucun rôle"
              description="Vous n'avez pas encore de rôles. Créez votre premier rôle pour commencer."
              action={{
                label: "Créer un rôle",
                onClick: () => setIsCreateDialogOpen(true)
              }}
            />
          ) : (
            <DataTable columns={columns} data={combinedData as Role[]} />
          )}
        </CardContent>
      </Card>

      <RoleForm
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        mode="create"
      />

      <RoleForm
        open={isEditDialogOpen}
        onOpenChange={handleCloseEditDialog}
        role={selectedRole}
        mode="edit"
      />
    </div>
  )
}
