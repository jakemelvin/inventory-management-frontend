"use client"

import { useEffect } from "react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Fournisseur, CreateFournisseurRequest, UpdateFournisseurRequest } from "@/types/fournisseur"
import { useFournisseur } from "@/hooks/useFournisseur"
import { useEnterprises } from "@/hooks/useEnterprises"
import { SubmitButton } from "@/components/global/submit-button"

const fournisseurSchema = z.object({
  nom: z.string().min(1, "Le nom est requis"),
  prenom: z.string().min(1, "Le prénom est requis"),
  email: z.string().email("Email invalide"),
  adresse1: z.string().min(1, "L'adresse est requise"),
  adresse2: z.string().optional(),
  ville: z.string().min(1, "La ville est requise"),
  codePostal: z.string().min(1, "Le code postal est requis"),
  pays: z.string().min(1, "Le pays est requis"),
  numTel: z.string().min(1, "Le numéro de téléphone est requis"),
  entrepriseId: z.number().min(1, "L'entreprise est requise"),
})

type FournisseurFormData = z.infer<typeof fournisseurSchema>

interface FournisseurFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  fournisseur?: Fournisseur
  mode: "create" | "edit"
}

export function FournisseurForm({
  open,
  onOpenChange,
  fournisseur,
  mode,
}: Readonly<FournisseurFormProps>) {
  const { createFournisseur, updateFournisseur } = useFournisseur({})
  const { getEnterprises } = useEnterprises()
  const { data: enterprises = [] } = getEnterprises

  const form = useForm<FournisseurFormData>({
    resolver: zodResolver(fournisseurSchema),
    defaultValues: {
      nom: "",
      prenom: "",
      email: "",
      adresse1: "",
      adresse2: "",
      ville: "",
      codePostal: "",
      pays: "",
      numTel: "",
      entrepriseId: 0,
    },
  })

  useEffect(() => {
    if (fournisseur && mode === "edit") {
      form.reset({
        nom: fournisseur.nom || "",
        prenom: fournisseur.prenom || "",
        email: fournisseur.email || "",
        adresse1: fournisseur.adresse?.adresse1 || "",
        adresse2: fournisseur.adresse?.adresse2 || "",
        ville: fournisseur.adresse?.ville || "",
        codePostal: fournisseur.adresse?.codePostal || "",
        pays: fournisseur.adresse?.pays || "",
        numTel: fournisseur.numTel || "",
        entrepriseId: fournisseur.entreprise?.id || 0,
      })
    } else if (mode === "create") {
      form.reset({
        nom: "",
        prenom: "",
        email: "",
        adresse1: "",
        adresse2: "",
        ville: "",
        codePostal: "",
        pays: "",
        numTel: "",
        entrepriseId: 0,
      })
    }
  }, [fournisseur, mode, form])

  const onSubmit = async (data: FournisseurFormData) => {
    try {
      if (mode === "create") {
        const createData: CreateFournisseurRequest = data
        await createFournisseur.mutateAsync({ data: createData })
      } else if (fournisseur) {
        const updateData: UpdateFournisseurRequest = data
        await updateFournisseur.mutateAsync({ 
          id: fournisseur.id, 
          data: updateData 
        })
      }
      onOpenChange(false)
      form.reset()
    } catch (error) {
      console.error("Error submitting form:", error)
    }
  }

  const isLoading = createFournisseur.isPending || updateFournisseur.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight">
            {mode === "create" ? "Créer un fournisseur" : "Modifier le fournisseur"}
          </h2>
          <p className="text-muted-foreground">
            {mode === "create" 
              ? "Remplissez les informations pour créer un nouveau fournisseur."
              : "Modifiez les informations du fournisseur."}
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom du fournisseur" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="prenom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénom</FormLabel>
                    <FormControl>
                      <Input placeholder="Prénom du fournisseur" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email@example.com" {...field} />
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
                    <FormLabel>Téléphone</FormLabel>
                    <FormControl>
                      <Input placeholder="Numéro de téléphone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                    <FormLabel>Code Postal</FormLabel>
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

            <FormField
              control={form.control}
              name="entrepriseId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entreprise</FormLabel>
                  <Select 
                    onValueChange={(value) => field.onChange(Number(value))} 
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une entreprise" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {enterprises.map((enterprise) => (
                        <SelectItem key={enterprise.id} value={enterprise.id.toString()}>
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
              >
                Annuler
              </Button>
              <SubmitButton 
                loading={isLoading}
                label={mode === "create" ? "Créer" : "Modifier"}
                loadingText="En cours..."
              />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}