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
import { CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon, Loader2, Plus, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { useCommandeFournisseur } from "@/hooks/useCommandesFournisseurs"
import { useEnterprises } from "@/hooks/useEnterprises"
import { useFournisseurs } from "@/hooks/useFournisseur"
import { useArticles } from "@/hooks/useArticles"
import { CommandeFournisseur, CreateCommandeFournisseurRequest, UpdateCommandeFournisseurRequest, LigneCommandeFournisseur, Fournisseur } from "@/types"
import { useUserStore } from "@/stores/userStore"

const commandeFournisseurSchema = z.object({
  code: z.string().min(1, "Le code est requis"),
  dateCommande: z.date({
    required_error: "La date de commande est requise",
  }),
  entrepriseId: z.number().min(1, "L'entreprise est requise"),
  fournisseurId: z.number().min(1, "Le fournisseur est requis"),
})

type CommandeFournisseurFormValues = z.infer<typeof commandeFournisseurSchema>

interface CommandeFournisseurFormProps {
  readonly mode: "create" | "edit"
  readonly commandeFournisseur?: CommandeFournisseur
  readonly onSuccess?: () => void
}

export function CommandeFournisseurForm({ mode, commandeFournisseur, onSuccess }: CommandeFournisseurFormProps) {
  const [lignesCommande, setLignesCommande] = useState<LigneCommandeFournisseur[]>([])
  const [selectedArticleId, setSelectedArticleId] = useState<number>(0)
  const [quantite, setQuantite] = useState<number>(1)
  const [prixUnitaire, setPrixUnitaire] = useState<number>(0)
  
  const user = useUserStore((state) => state.user)

  const { createCommandeFournisseur, updateCommandeFournisseur, addLigneCommande, removeLigneCommande } = useCommandeFournisseur({
    commandeFournisseurId: commandeFournisseur?.id
  })
  const { getEnterprises } = useEnterprises()
  const { getFournisseurs } = useFournisseurs()
  const { getArticles } = useArticles()

  const form = useForm<CommandeFournisseurFormValues>({
    resolver: zodResolver(commandeFournisseurSchema),
    defaultValues: {
      code: "",
      dateCommande: new Date(),
      entrepriseId: 0,
      fournisseurId: commandeFournisseur?.fournisseur.id || 0,
    },
  })

  useEffect(() => {
    if (mode === "create") {
      // Auto-select user's enterprise for new commandes
      const userEntrepriseId = user?.roles?.[0]?.entrepriseId || 0
      
      form.reset({
        code: "",
        dateCommande: new Date(),
        entrepriseId: userEntrepriseId,
        fournisseurId: 0,
      })
      
      
      setLignesCommande([])
    } else if (mode === "edit" && commandeFournisseur) {
      // Use setTimeout to ensure fournisseurs are loaded before setting form values
      setTimeout(() => {
        form.reset({
          code: commandeFournisseur.code,
          dateCommande: new Date(commandeFournisseur.dateCommande),
          entrepriseId: commandeFournisseur.entrepriseId,
          fournisseurId: commandeFournisseur.fournisseur.id,
        })
      }, 100)
      
      setLignesCommande(commandeFournisseur.ligneCommandeFournisseurs || [])
    }
  }, [mode, commandeFournisseur, form, user?.roles])

  const onSubmit = async (values: CommandeFournisseurFormValues) => {
    try {
      const requestData: CreateCommandeFournisseurRequest | UpdateCommandeFournisseurRequest = {
        code: values.code,
        dateCommande: values.dateCommande.toISOString(),
        entrepriseId: values.entrepriseId,
        fournisseurId: values.fournisseurId,
      }

      if (mode === "create") {
        await createCommandeFournisseur.mutateAsync({ data: requestData as CreateCommandeFournisseurRequest })
      } else if (commandeFournisseur) {
        await updateCommandeFournisseur.mutateAsync({ 
          id: commandeFournisseur.id, 
          data: requestData as UpdateCommandeFournisseurRequest 
        })
      }

      onSuccess?.()
    } catch (error) {
      console.error("Error submitting commande fournisseur form:", error)
    }
  }

  const handleAddLigne = async () => {
    if (selectedArticleId && quantite > 0 && prixUnitaire > 0 && commandeFournisseur?.id) {
      try {
        await addLigneCommande.mutateAsync({
          commandeFournisseurId: commandeFournisseur.id,
          articleId: selectedArticleId,
          quantite,
          prixUnitaire
        })
        setSelectedArticleId(0)
        setQuantite(1)
        setPrixUnitaire(0)
      } catch (error) {
        console.error("Error adding ligne commande:", error)
      }
    }
  }


  const handleRemoveLigne = async (ligneId: number) => {
    try {
      await removeLigneCommande.mutateAsync(ligneId)
    } catch (error) {
      console.error("Error removing ligne commande:", error)
    }
  }

  const calculateTotal = () => {
    return lignesCommande.reduce((total, ligne) => total + (ligne.quantite * ligne.prixUnitaire), 0)
  }

  const isLoading = createCommandeFournisseur.isPending || updateCommandeFournisseur.isPending
  const enterprises = getEnterprises.data || []
  const fournisseurs = getFournisseurs.data || []
  const articles = getArticles.data || []

  return (
    <div className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Informations de base</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Code</FormLabel>
                      <FormControl>
                        <Input placeholder="CMF-001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dateCommande"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date de commande</FormLabel>
                      <Popover modal={false}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: fr })
                              ) : (
                                <span>Sélectionner une date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 z-50" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Enterprise and Fournisseur Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Entreprise et Fournisseur</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <FormField
                  control={form.control}
                  name="fournisseurId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fournisseur</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        value={field.value?.toString() || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un fournisseur" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {(() => {
                            if (getFournisseurs.isLoading) {
                              return (
                                <SelectItem value="loading" disabled>
                                  <div className="flex items-center">
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Chargement...
                                  </div>
                                </SelectItem>
                              )
                            }
                            
                            if (getFournisseurs.error) {
                              return (
                                <SelectItem value="error" disabled>
                                  Erreur lors du chargement
                                </SelectItem>
                              )
                            }
                            
                            if (fournisseurs.length === 0) {
                              return (
                                <SelectItem value="empty" disabled>
                                  Aucun fournisseur disponible
                                </SelectItem>
                              )
                            }
                            
                            return fournisseurs.map((fournisseur: Fournisseur) => (
                              <SelectItem key={fournisseur.id} value={fournisseur.id.toString()}>
                                {fournisseur.prenom} {fournisseur.nom}
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
            </div>

            {/* Articles Section - Only show in edit mode */}
            {mode === "edit" && commandeFournisseur && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Articles</h3>
                  
                  {/* Add Article Form */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                    <div>
                      <label htmlFor="article-select" className="text-sm font-medium mb-1 block">Article</label>
                      <Select
                        onValueChange={(value) => setSelectedArticleId(parseInt(value))}
                        value={selectedArticleId?.toString() || ""}
                      >
                        <SelectTrigger id="article-select">
                          <SelectValue placeholder="Sélectionner un article" />
                        </SelectTrigger>
                        <SelectContent>
                          {(() => {
                            if (getArticles.isLoading) {
                              return (
                                <SelectItem value="loading" disabled>
                                  <div className="flex items-center">
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Chargement...
                                  </div>
                                </SelectItem>
                              )
                            }
                            
                            if (getArticles.error) {
                              return (
                                <SelectItem value="error" disabled>
                                  Erreur lors du chargement
                                </SelectItem>
                              )
                            }
                            
                            if (articles.length === 0) {
                              return (
                                <SelectItem value="empty" disabled>
                                  Aucun article disponible
                                </SelectItem>
                              )
                            }
                            
                            return articles.map((article) => (
                              <SelectItem key={article.id} value={article.id.toString()}>
                                {article.designation}
                              </SelectItem>
                            ))
                          })()} 
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label htmlFor="quantite-input" className="text-sm font-medium mb-1 block">Quantité</label>
                      <Input
                        id="quantite-input"
                        type="number"
                        placeholder="Quantité"
                        value={quantite}
                        onChange={(e) => setQuantite(parseInt(e.target.value) || 1)}
                        min="1"
                      />
                    </div>
                    <div>
                      <label htmlFor="prix-input" className="text-sm font-medium mb-1 block">Prix unitaire</label>
                      <Input
                        id="prix-input"
                        type="number"
                        placeholder="Prix unitaire"
                        value={prixUnitaire}
                        onChange={(e) => setPrixUnitaire(parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={handleAddLigne}
                      disabled={!selectedArticleId || quantite <= 0 || prixUnitaire <= 0}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter
                    </Button>
                  </div>

                  {/* Articles List */}
                  {lignesCommande.length > 0 && (
                    <div className="space-y-2">
                      {lignesCommande.map((ligne) => (
                        <div key={ligne.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium">{ligne.article.designation}</p>
                            <p className="text-sm text-muted-foreground">
                              {ligne.quantite} × {ligne.prixUnitaire}€ = {(ligne.quantite * ligne.prixUnitaire).toFixed(2)}€
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveLigne(ligne.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <div className="flex justify-end p-4 border-t">
                        <p className="text-lg font-semibold">
                          Total: {calculateTotal().toFixed(2)}€
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

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
