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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { VentesRequestDto, VentesResponseDto } from "@/types/vente"
import { useVente } from "@/hooks/useVente"

const venteSchema = z.object({
  code: z.string().min(1, "Le code est requis"),
  dateVente: z.string().min(1, "La date de vente est requise"),
  commentaire: z.string().min(1, "Le commentaire est requis"),
  entrepriseId: z.number().min(1, "L'entreprise est requise"),
  commandeId: z.number().min(1, "La commande est requise"),
})

type VenteFormData = z.infer<typeof venteSchema>

interface VenteFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  vente?: VentesResponseDto
  mode: "create" | "edit"
}

export function VenteForm({
  open,
  onOpenChange,
  vente,
  mode,
}: Readonly<VenteFormProps>) {
  const { createVente, updateVente } = useVente({})

  const form = useForm<VenteFormData>({
    resolver: zodResolver(venteSchema),
    defaultValues: {
      code: "",
      dateVente: "",
      commentaire: "",
      entrepriseId: 0,
      commandeId: 0,
    },
  })

  useEffect(() => {
    if (vente && mode === "edit") {
      form.reset({
        code: vente.code || "",
        dateVente: vente.dateVente ? new Date(vente.dateVente).toISOString().slice(0, 16) : "",
        commentaire: vente.commentaire || "",
        entrepriseId: vente.entrepriseId || 0,
        commandeId: vente.commandeId || 0,
      })
    } else if (mode === "create") {
      form.reset({
        code: "",
        dateVente: "",
        commentaire: "",
        entrepriseId: 0,
        commandeId: 0,
      })
    }
  }, [vente, mode, form])

  const onSubmit = async (data: VenteFormData) => {
    try {
      const venteData: VentesRequestDto = {
        ...data,
        ligneVentes: [],
      }

      if (mode === "create") {
        await createVente.mutateAsync({ data: venteData })
      } else if (vente) {
        await updateVente.mutateAsync({ 
          id: vente.id, 
          data: venteData 
        })
      }
      onOpenChange(false)
      form.reset()
    } catch (error) {
      console.error("Error submitting form:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Créer une vente" : "Modifier la vente"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create" 
              ? "Remplissez les informations pour créer une nouvelle vente."
              : "Modifiez les informations de la vente."
            }
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code</FormLabel>
                    <FormControl>
                      <Input placeholder="VENTE-2025-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateVente"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de Vente</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="entrepriseId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID Entreprise</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="1" 
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="commandeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID Commande</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="1" 
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="commentaire"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Commentaire</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Commentaire sur la vente..." 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                disabled={createVente.isPending || updateVente.isPending}
              >
                {createVente.isPending || updateVente.isPending
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