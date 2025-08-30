"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useCategorie } from "@/hooks/useCategories"
import { useEnterprises } from "@/hooks/useEnterprises"
import { Categorie, CreateCategorieRequest, UpdateCategorieRequest } from "@/types"

const categorieSchema = z.object({
  code: z.string().min(1, "Le code est requis"),
  designation: z.string().min(1, "La désignation est requise"),
  entrepriseId: z.coerce.number().min(1, "L'entreprise est requise"),
})

type CategorieFormData = z.infer<typeof categorieSchema>

interface CategorieFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categorie?: Categorie
  mode: "create" | "edit"
}

export function CategorieForm({ open, onOpenChange, categorie, mode }: CategorieFormProps) {
  const { createCategorie, updateCategorie } = useCategorie({})
  const { getEnterprises } = useEnterprises()
  const { data: enterprises = [] } = getEnterprises
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<CategorieFormData>({
    resolver: zodResolver(categorieSchema),
    defaultValues: {
      code: "",
      designation: "",
      entrepriseId: 0,
    },
  })

  useEffect(() => {
    if (categorie && mode === "edit") {
      form.reset({
        code: categorie.code,
        designation: categorie.designation,
        entrepriseId: categorie.entrepriseId,
      })
    } else {
      form.reset({
        code: "",
        designation: "",
        entrepriseId: 0,
      })
    }
  }, [categorie, mode, form])

  const onSubmit = async (data: CategorieFormData) => {
    setIsSubmitting(true)
    try {
      if (mode === "create") {
        const createData: CreateCategorieRequest = {
          code: data.code,
          designation: data.designation,
          entrepriseId: data.entrepriseId,
        }
        await createCategorie.mutateAsync({ data: createData })
      } else if (categorie) {
        const updateData: UpdateCategorieRequest = {
          code: data.code,
          designation: data.designation,
          entrepriseId: data.entrepriseId,
        }
        await updateCategorie.mutateAsync({ id: categorie.id, data: updateData })
      }
      
      form.reset()
      onOpenChange(false)
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Créer une catégorie" : "Modifier la catégorie"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create" 
              ? "Ajoutez une nouvelle catégorie à votre inventaire." 
              : "Modifiez les informations de la catégorie."}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: CAT001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="designation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Désignation</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Électronique" {...field} />
                  </FormControl>
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
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {(() => {
                  if (isSubmitting) {
                    return mode === "create" ? "Création..." : "Modification..."
                  }
                  return mode === "create" ? "Créer" : "Modifier"
                })()}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
