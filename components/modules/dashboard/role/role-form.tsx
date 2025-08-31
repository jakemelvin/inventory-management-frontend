"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Role } from "@/types/role"
import { Utilisateur } from "@/types/utilisateur"
import { useRole } from "@/hooks/useRoles"
import { useEnterprises } from "@/hooks/useEnterprises"
import { useUtilisateurs } from "@/hooks/useUtilisateurs"
import { SubmitButton } from "@/components/global/submit-button"

const roleSchema = z.object({
  roleName: z.string().min(1, "Le nom du rôle est requis"),
  utilisateurId: z.coerce.number().min(1, "L'ID utilisateur est requis"),
  entrepriseId: z.coerce.number().min(1, "L'entreprise est requise"),
})

type RoleFormData = z.infer<typeof roleSchema>

interface RoleFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  role?: Role
  mode: "create" | "edit"
}

export function RoleForm({
  open,
  onOpenChange,
  role,
  mode,
}: Readonly<RoleFormProps>) {
  const { createRole, updateRole } = useRole({})
  const { getEnterprises } = useEnterprises()
  const { data: enterprises = [] } = getEnterprises
  const { data: users = [] } = useUtilisateurs()

  const form = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      roleName: "",
      utilisateurId: 0,
      entrepriseId: 0,
    },
  })

  useEffect(() => {
    if (role && mode === "edit") {
      form.reset({
        roleName: role.roleName || "",
        utilisateurId: role.utilisateurId || 0,
        entrepriseId: role.entrepriseId || 0,
      })
    } else if (mode === "create") {
      form.reset({
        roleName: "",
        utilisateurId: 0,
        entrepriseId: 0,
      })
    }
  }, [role, mode, form])

  const onSubmit = async (data: RoleFormData) => {
    try {
      if (mode === "create") {
        await createRole.mutateAsync({ data })
      } else if (role) {
        await updateRole.mutateAsync({ id: role.id, data })
      }
      onOpenChange(false)
      form.reset()
    } catch (error) {
      console.error("Error submitting form:", error)
    }
  }

  const isLoading = createRole.isPending || updateRole.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Créer un nouveau rôle" : "Modifier le rôle"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create" 
              ? "Remplissez les informations pour créer un nouveau rôle."
              : "Modifiez les informations du rôle."
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="roleName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom du Rôle</FormLabel>
                  <FormControl>
                    <Input placeholder="Entrez le nom du rôle" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="utilisateurId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Utilisateur</FormLabel>
                  <Select 
                    onValueChange={(value) => field.onChange(parseInt(value))} 
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un utilisateur" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {users?.map((user: Utilisateur) => (
                        <SelectItem 
                          key={user.id} 
                          value={user.id.toString()}
                        >
                          {user.prenom} {user.nom} ({user.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="entrepriseId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entreprise</FormLabel>
                  <Select 
                    onValueChange={(value) => field.onChange(parseInt(value))} 
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une entreprise" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {enterprises?.map((enterprise) => (
                        <SelectItem 
                          key={enterprise.id} 
                          value={enterprise.id.toString()}
                        >
                          {enterprise.nomEntreprise}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <SubmitButton loading={isLoading}>
                {mode === "create" ? "Créer" : "Modifier"}
              </SubmitButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
