"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CreateEnterpriseRequest, UpdateEnterpriseRequest, Enterprise } from "@/types"
import { useEnterprise } from "@/hooks/useEnterprises"

const enterpriseSchema = z.object({
  nomEntreprise: z.string().min(1, "Le nom de l'entreprise est requis"),
  description: z.string().min(1, "La description est requise"),
  email: z.string().email("Email invalide"),
  adresse1: z.string().min(1, "L'adresse est requise"),
  adresse2: z.string().optional(),
  ville: z.string().min(1, "La ville est requise"),
  codePostal: z.string().min(1, "Le code postal est requis"),
  pays: z.string().min(1, "Le pays est requis"),
  codeFiscal: z.string().min(1, "Le code fiscal est requis"),
  numTel: z.string().min(1, "Le numéro de téléphone est requis"),
  steWeb: z.string().min(1, "Le site web est requis"),
})

type EnterpriseFormData = z.infer<typeof enterpriseSchema>

interface EnterpriseFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  enterprise?: Enterprise
  mode: "create" | "edit"
}

export function EnterpriseForm({
  open,
  onOpenChange,
  enterprise,
  mode,
}: Readonly<EnterpriseFormProps>) {
  const [photoFile, setPhotoFile] = useState<File | undefined>()
  const { createEnterprise, updateEnterprise } = useEnterprise({})

  const form = useForm<EnterpriseFormData>({
    resolver: zodResolver(enterpriseSchema),
    defaultValues: {
      nomEntreprise: "",
      description: "",
      email: "",
      adresse1: "",
      adresse2: "",
      ville: "",
      codePostal: "",
      pays: "",
      codeFiscal: "",
      numTel: "",
      steWeb: "",
    },
  })

  useEffect(() => {
    if (enterprise && mode === "edit") {
      form.reset({
        nomEntreprise: enterprise.nomEntreprise || "",
        description: enterprise.description || "",
        email: enterprise.email || "",
        adresse1: enterprise.adresse?.adresse1 || "",
        adresse2: enterprise.adresse?.adresse2 || "",
        ville: enterprise.adresse?.ville || "",
        codePostal: enterprise.adresse?.codePostal || "",
        pays: enterprise.adresse?.pays || "",
        codeFiscal: enterprise.codeFiscal || "",
        numTel: enterprise.numTel || "",
        steWeb: enterprise.steWeb || "",
      })
    } else if (mode === "create") {
      form.reset({
        nomEntreprise: "",
        description: "",
        email: "",
        adresse1: "",
        adresse2: "",
        ville: "",
        codePostal: "",
        pays: "",
        codeFiscal: "",
        numTel: "",
        steWeb: "",
      })
    }
  }, [enterprise, mode, form])

  const onSubmit = async (data: EnterpriseFormData) => {
    try {
      if (mode === "create") {
        const createData: CreateEnterpriseRequest = {
          ...data,
          photo: photoFile,
        }
        await createEnterprise.mutateAsync({ data: createData })
      } else if (enterprise) {
        const updateData: UpdateEnterpriseRequest = {
          ...data,
          photo: photoFile,
        }
        await updateEnterprise.mutateAsync({ 
          id: enterprise.id, 
          data: updateData 
        })
      }
      onOpenChange(false)
      form.reset()
      setPhotoFile(undefined)
    } catch (error) {
      console.error("Error submitting form:", error)
    }
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setPhotoFile(file)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight">
            {mode === "create" ? "Créer une entreprise" : "Modifier l'entreprise"}
          </h2>
          <p className="text-muted-foreground">
            {mode === "create" 
              ? "Remplissez les informations pour créer une nouvelle entreprise."
              : "Modifiez les informations de l'entreprise."}
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nomEntreprise"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom de l&apos;entreprise</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom de l'entreprise" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email@entreprise.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Description de l'entreprise" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="adresse1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse 1</FormLabel>
                    <FormControl>
                      <Input placeholder="Adresse principale" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="adresse2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse 2 (optionnel)</FormLabel>
                    <FormControl>
                      <Input placeholder="Complément d'adresse" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="ville"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ville</FormLabel>
                    <FormControl>
                      <Input placeholder="Ville" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="codePostal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code postal</FormLabel>
                    <FormControl>
                      <Input placeholder="Code postal" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pays</FormLabel>
                    <FormControl>
                      <Input placeholder="Pays" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="codeFiscal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code fiscal</FormLabel>
                    <FormControl>
                      <Input placeholder="Code fiscal" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="numTel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numéro de téléphone</FormLabel>
                    <FormControl>
                      <Input placeholder="Numéro de téléphone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="steWeb"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Site web</FormLabel>
                  <FormControl>
                    <Input placeholder="www.entreprise.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <label className="block text-sm font-medium mb-2">
                Photo (optionnel)
              </label>
              <Input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                disabled={createEnterprise.isPending || updateEnterprise.isPending}
              >
                {createEnterprise.isPending || updateEnterprise.isPending
                  ? "En cours..."
                  : mode === "create"
                  ? "Créer"
                  : "Modifier"
                }
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
