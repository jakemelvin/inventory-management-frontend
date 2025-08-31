"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Upload, X, Eye, EyeOff } from "lucide-react"
import { format } from "date-fns"

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DateOfBirthPicker } from "@/components/ui/date-of-birth-picker"
import { useCreateUtilisateur, useUpdateUtilisateur } from "@/hooks/useUtilisateurs"
import { Utilisateur, Entreprise } from "@/types"

const utilisateurSchema = z.object({
  nom: z.string()
    .min(1, "Le nom est requis")
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(50, "Le nom ne peut pas dépasser 50 caractères")
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Le nom ne peut contenir que des lettres, espaces, apostrophes et tirets"),
  prenom: z.string()
    .min(1, "Le prénom est requis")
    .min(2, "Le prénom doit contenir au moins 2 caractères")
    .max(50, "Le prénom ne peut pas dépasser 50 caractères")
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Le prénom ne peut contenir que des lettres, espaces, apostrophes et tirets"),
  email: z.string()
    .min(1, "L'email est requis")
    .email("Format d'email invalide")
    .max(100, "L'email ne peut pas dépasser 100 caractères")
    .toLowerCase(),
  motDePasse: z.string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .max(128, "Le mot de passe ne peut pas dépasser 128 caractères")
    .regex(/[a-z]/, "Le mot de passe doit contenir au moins une lettre minuscule")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une lettre majuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre")
    .regex(/[^a-zA-Z0-9]/, "Le mot de passe doit contenir au moins un caractère spécial (!@#$%^&*(),.?\":{}|<>)"),
  dateDeNaissance: z.date({
    required_error: "La date de naissance est requise",
  }).refine((date) => {
    const today = new Date()
    const age = today.getFullYear() - date.getFullYear()
    return age >= 16 && age <= 120
  }, "L'âge doit être compris entre 16 et 120 ans"),
  adresse1: z.string()
    .min(1, "L'adresse est requise")
    .min(5, "L'adresse doit contenir au moins 5 caractères")
    .max(100, "L'adresse ne peut pas dépasser 100 caractères"),
  adresse2: z.string()
    .max(100, "L'adresse secondaire ne peut pas dépasser 100 caractères")
    .optional(),
  ville: z.string()
    .min(1, "La ville est requise")
    .min(2, "La ville doit contenir au moins 2 caractères")
    .max(50, "La ville ne peut pas dépasser 50 caractères")
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "La ville ne peut contenir que des lettres, espaces, apostrophes et tirets"),
  codePostal: z.string()
    .min(1, "Le code postal est requis")
    .regex(/^[0-9]{5}$/, "Le code postal doit contenir exactement 5 chiffres"),
  pays: z.string()
    .min(1, "Le pays est requis")
    .min(2, "Le pays doit contenir au moins 2 caractères")
    .max(50, "Le pays ne peut pas dépasser 50 caractères")
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Le pays ne peut contenir que des lettres, espaces, apostrophes et tirets"),
  entrepriseId: z.number()
    .min(1, "L'entreprise est requise")
    .positive("L'ID de l'entreprise doit être positif"),
})

type UtilisateurFormValues = z.infer<typeof utilisateurSchema>

interface UtilisateurFormProps {
  utilisateur?: Utilisateur
  entreprises: Entreprise[]
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "create" | "edit"
}

export function UtilisateurForm({
  utilisateur,
  entreprises,
  open,
  onOpenChange,
  mode,
}: UtilisateurFormProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const createUtilisateur = useCreateUtilisateur()
  const updateUtilisateur = useUpdateUtilisateur()

  const form = useForm<UtilisateurFormValues>({
    resolver: zodResolver(utilisateurSchema),
    defaultValues: {
      nom: "",
      prenom: "",
      email: "",
      motDePasse: "",
      dateDeNaissance: new Date(),
      adresse1: "",
      adresse2: "",
      ville: "",
      codePostal: "",
      pays: "",
      entrepriseId: 0,
    },
  })

  useEffect(() => {
    if (utilisateur && mode === "edit") {
      form.reset({
        nom: utilisateur.nom,
        prenom: utilisateur.prenom,
        email: utilisateur.email,
        motDePasse: utilisateur.motDePasse,
        dateDeNaissance: utilisateur.dateDeNaissance ? new Date(utilisateur.dateDeNaissance) : new Date(),
        adresse1: utilisateur.adresse?.adresse1 || "",
        adresse2: utilisateur.adresse?.adresse2 || "",
        ville: utilisateur.adresse?.ville || "",
        codePostal: utilisateur.adresse?.codePostal || "",
        pays: utilisateur.adresse?.pays || "",
        entrepriseId: utilisateur.entrepriseId || 0,
      })
      setImagePreview(utilisateur.photo || null)
    } else {
      form.reset({
        nom: "",
        prenom: "",
        email: "",
        motDePasse: "",
        dateDeNaissance: new Date(),
        adresse1: "",
        adresse2: "",
        ville: "",
        codePostal: "",
        pays: "",
        entrepriseId: 0,
      })
      setSelectedImage(null)
      setImagePreview(null)
    }
  }, [utilisateur, mode, form])

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
  }

  const onSubmit = async (data: UtilisateurFormValues) => {
    try {
      const formData = {
        ...data,
        dateDeNaissance: format(data.dateDeNaissance, "dd/MM/yyyy"),
        image: selectedImage || undefined,
      }

      if (mode === "create") {
        await createUtilisateur.mutateAsync(formData)
      } else if (utilisateur) {
        await updateUtilisateur.mutateAsync({
          id: utilisateur.id,
          data: formData,
        })
      }

      onOpenChange(false)
      form.reset()
      setSelectedImage(null)
      setImagePreview(null)
    } catch (error) {
      console.error("Erreur lors de la soumission:", error)
    }
  }

  const isLoading = createUtilisateur.isPending || updateUtilisateur.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-full lg:max-w-4xl xl:max-w-5xl max-h-[95vh] overflow-hidden flex flex-col">
        <div className="flex-shrink-0 mb-6">
          <h2 className="text-2xl font-bold tracking-tight">
            {mode === "create" ? "Nouvel Utilisateur" : "Modifier l'Utilisateur"}
          </h2>
          <p className="text-muted-foreground">
            {mode === "create"
              ? "Créez un nouvel utilisateur avec ses informations personnelles."
              : "Modifiez les informations de l'utilisateur."}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-1">
              {/* Photo de profil */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={imagePreview || ""} />
                    <AvatarFallback>
                      <Upload className="h-8 w-8" />
                    </AvatarFallback>
                  </Avatar>
                  {imagePreview && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                      onClick={removeImage}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                <div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload">
                    <Button type="button" variant="outline" asChild>
                      <span className="cursor-pointer">
                        <Upload className="mr-2 h-4 w-4" />
                        Choisir une photo
                      </span>
                    </Button>
                  </label>
                </div>
              </div>

              {/* Informations personnelles */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="nom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom</FormLabel>
                      <FormControl>
                        <Input placeholder="Nom de famille" {...field} />
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
                        <Input placeholder="Prénom" {...field} />
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
                        <Input type="email" placeholder="email@exemple.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="motDePasse"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mot de passe</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="••••••••" 
                            {...field} 
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateDeNaissance"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date de naissance</FormLabel>
                      <FormControl>
                        <DateOfBirthPicker
                          date={field.value}
                          onSelect={field.onChange}
                          placeholder="Sélectionner une date de naissance"
                        />
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
                      <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une entreprise" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {entreprises.map((entreprise) => (
                            <SelectItem key={entreprise.id} value={entreprise.id.toString()}>
                              {entreprise.nomEntreprise}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Adresse */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Adresse</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="adresse1"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Adresse principale</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Rue de la Paix" {...field} />
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
                        <FormLabel>Adresse secondaire (optionnel)</FormLabel>
                        <FormControl>
                          <Input placeholder="Appartement, étage..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ville"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ville</FormLabel>
                        <FormControl>
                          <Input placeholder="Paris" {...field} />
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
                          <Input placeholder="75001" {...field} />
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
                          <Input placeholder="France" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Annuler
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Enregistrement..." : mode === "create" ? "Créer" : "Modifier"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
