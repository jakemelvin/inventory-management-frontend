"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useEffect, useState } from "react"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Loader2, Upload, X } from "lucide-react"
import { useClient } from "@/hooks/useClients"
import { useEnterprises } from "@/hooks/useEnterprises"
import { Client, CreateClientRequest, UpdateClientRequest } from "@/types"

const clientSchema = z.object({
  nom: z.string().min(1, "Le nom est requis"),
  prenom: z.string().min(1, "Le prénom est requis"),
  email: z.string().email("Email invalide"),
  numTel: z.string().min(1, "Le numéro de téléphone est requis"),
  adresse1: z.string().min(1, "L'adresse est requise"),
  adresse2: z.string().optional(),
  ville: z.string().min(1, "La ville est requise"),
  codePostal: z.string().min(1, "Le code postal est requis"),
  pays: z.string().min(1, "Le pays est requis"),
  entrepriseId: z.number().min(1, "L'entreprise est requise"),
})

type ClientFormValues = z.infer<typeof clientSchema>

interface ClientFormProps {
  readonly mode: "create" | "edit"
  readonly client?: Client
  readonly onSuccess?: () => void
}

export function ClientForm({ mode, client, onSuccess }: ClientFormProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const { createClient, updateClient } = useClient({
    clientId: client?.id
  })
  const { getEnterprises } = useEnterprises()

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      nom: "",
      prenom: "",
      email: "",
      numTel: "",
      adresse1: "",
      adresse2: "",
      ville: "",
      codePostal: "",
      pays: "France",
      entrepriseId: 0,
    },
  })

  // Reset form when mode or client changes
  useEffect(() => {
    if (mode === "create") {
      form.reset({
        nom: "",
        prenom: "",
        email: "",
        numTel: "",
        adresse1: "",
        adresse2: "",
        ville: "",
        codePostal: "",
        pays: "France",
        entrepriseId: 0,
      })
      setSelectedImage(null)
      setImagePreview(null)
    } else if (mode === "edit" && client) {
      form.reset({
        nom: client.nom,
        prenom: client.prenom,
        email: client.email,
        numTel: client.numTel,
        adresse1: client.adresse.adresse1,
        adresse2: client.adresse.adresse2 || "",
        ville: client.adresse.ville,
        codePostal: client.adresse.codePostal,
        pays: client.adresse.pays,
        entrepriseId: client.entreprise.id,
      })
      setImagePreview(client.photo)
      setSelectedImage(null)
    }
  }, [mode, client, form])

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
  }

  const onSubmit = async (values: ClientFormValues) => {
    try {
      const requestData: CreateClientRequest | UpdateClientRequest = {
        nom: values.nom,
        prenom: values.prenom,
        email: values.email,
        numTel: values.numTel,
        adresse1: values.adresse1,
        adresse2: values.adresse2,
        ville: values.ville,
        codePostal: values.codePostal,
        pays: values.pays,
        entrepriseId: values.entrepriseId,
        photo: selectedImage || undefined,
      }

      if (mode === "create") {
        await createClient.mutateAsync({ data: requestData as CreateClientRequest })
      } else if (client) {
        await updateClient.mutateAsync({ 
          id: client.id, 
          data: requestData as UpdateClientRequest 
        })
      }

      onSuccess?.()
    } catch (error) {
      console.error("Error submitting client form:", error)
    }
  }

  const isLoading = createClient.isPending || updateClient.isPending
  const enterprises = getEnterprises.data || []

  return (
    <div className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Photo Section */}
            <div className="space-y-4">
              <FormLabel>Photo</FormLabel>
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={imagePreview || undefined} />
                  <AvatarFallback>
                    {form.watch("prenom")?.[0]?.toUpperCase() || ""}
                    {form.watch("nom")?.[0]?.toUpperCase() || ""}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-2">
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById("photo-upload")?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Choisir une photo
                    </Button>
                    {imagePreview && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={removeImage}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Supprimer
                      </Button>
                    )}
                  </div>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Informations personnelles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="prenom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prénom</FormLabel>
                      <FormControl>
                        <Input placeholder="Prénom" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom</FormLabel>
                      <FormControl>
                        <Input placeholder="Nom" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="email@exemple.com" {...field} />
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
            </div>

            <Separator />

            {/* Address Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Adresse</h3>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            </div>

            <Separator />

            {/* Enterprise Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Entreprise</h3>
              <FormField
                control={form.control}
                name="entrepriseId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Entreprise</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value?.toString() || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une entreprise" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {(() => {
                          if (getEnterprises.isLoading) {
                            return (
                              <SelectItem value="loading" disabled>
                                <div className="flex items-center">
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Chargement...
                                </div>
                              </SelectItem>
                            )
                          }
                          
                          if (getEnterprises.error) {
                            return (
                              <SelectItem value="error" disabled>
                                Erreur lors du chargement
                              </SelectItem>
                            )
                          }
                          
                          if (enterprises.length === 0) {
                            return (
                              <SelectItem value="empty" disabled>
                                Aucune entreprise disponible
                              </SelectItem>
                            )
                          }
                          
                          return enterprises.map((enterprise) => (
                            <SelectItem key={enterprise.id} value={enterprise.id.toString()}>
                              {enterprise.nomEntreprise}
                            </SelectItem>
                          ))
                        })()}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="submit"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === "create" ? "Créer" : "Mettre à jour"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </div>
  )
}
