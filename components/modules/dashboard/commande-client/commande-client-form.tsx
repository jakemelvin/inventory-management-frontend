"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { CalendarIcon, Plus, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCommandeClient } from "@/hooks/useCommandesClients"
import { useArticles } from "@/hooks/useArticles"
import { useClientsByEntreprise } from "@/hooks/useClients"
import { useEnterprises } from "@/hooks/useEnterprises"
import { useUserStore } from "@/stores/userStore"
import { CommandeClient, Article } from "@/types"

const commandeClientSchema = z.object({
  code: z.string().min(1, "Le code est requis"),
  dateCommande: z.date({
    required_error: "La date de commande est requise",
  }),
  clientId: z.number({
    required_error: "Le client est requis",
  }).min(1, "Le client est requis"),
  entrepriseId: z.number({
    required_error: "L'entreprise est requise",
  }).min(1, "L'entreprise est requise"),
})

type CommandeClientFormData = z.infer<typeof commandeClientSchema>
interface LigneFormData {
  articleId: number
  quantite: number
  prixUnitaire: number
}

interface CommandeClientFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  commandeClient?: CommandeClient
  mode: "create" | "edit"
}

export function CommandeClientForm({
  open,
  onOpenChange,
  commandeClient,
  mode,
}: Readonly<CommandeClientFormProps>) {
  const [lignes, setLignes] = useState<(LigneFormData & { id?: number })[]>([])
  const [selectedArticles, setSelectedArticles] = useState<Article[]>([])
  const [selectedEntrepriseId, setSelectedEntrepriseId] = useState<number | undefined>()

  const user = useUserStore((state) => state.user)
  
  const { createCommandeClient, updateCommandeClient, addLigne: addLigneMutation, updateLigne: updateLigneMutation, removeLigne: removeLigneMutation } = useCommandeClient({
    id: commandeClient?.id,
  })
  const { getArticles } = useArticles()
  const { data: articles = [] } = getArticles
  
  const { getEnterprises } = useEnterprises()
  const { data: enterprises = [], isLoading: isLoadingEnterprises, error: enterprisesError } = getEnterprises
  
  const { getClientsByEntreprise } = useClientsByEntreprise(selectedEntrepriseId)
  const { data: clients = [], isLoading: isLoadingClients, error: clientsError } = getClientsByEntreprise

  const form = useForm<CommandeClientFormData>({
    resolver: zodResolver(commandeClientSchema),
    defaultValues: {
      code: "",
      dateCommande: new Date(),
      clientId: 0,
      entrepriseId: 0,
    },
  })

  useEffect(() => {
    if (commandeClient && mode === "edit") {
      const entrepriseId = commandeClient.entrepriseId
      const clientId = commandeClient.client?.id
      
      // Set enterprise first to load clients
      setSelectedEntrepriseId(entrepriseId)
      
      // Use setTimeout to ensure clients are loaded before setting form values
      setTimeout(() => {
        form.reset({
          code: commandeClient.code,
          dateCommande: new Date(commandeClient.dateCommande),
          clientId: clientId || 0,
          entrepriseId: entrepriseId,
        })
      }, 100)
      
      const commandeLignes = commandeClient.ligneCommandeClients?.map(ligne => ({
        id: ligne.id,
        articleId: ligne.article.id,
        quantite: ligne.quantite,
        prixUnitaire: ligne.prixUnitaire,
      })) || []
      
      setLignes(commandeLignes)
      
      const articlesInLignes = commandeClient.ligneCommandeClients?.map(ligne => ligne.article) || []
      setSelectedArticles(articlesInLignes)
    } else {
      // Auto-select user's enterprise for new commandes
      const userEntrepriseId = user?.roles?.[0]?.entrepriseId || 0
      
      form.reset({
        code: "",
        dateCommande: new Date(),
        clientId: 0,
        entrepriseId: userEntrepriseId,
      })
      
      if (userEntrepriseId > 0) {
        setSelectedEntrepriseId(userEntrepriseId)
      }
      
      setLignes([])
      setSelectedArticles([])
    }
  }, [commandeClient, mode, form, user?.roles])

  const addLigneToForm = () => {
    setLignes([
      ...lignes,
      {
        articleId: 0,
        quantite: 1,
        prixUnitaire: 0,
      },
    ])
  }

  const removeLigne = (index: number) => {
    const newLignes = lignes.filter((_, i) => i !== index)
    setLignes(newLignes)
    
    const removedLigne = lignes[index]
    if (removedLigne) {
      const article = articles.find(a => a.id === removedLigne.articleId)
      if (article) {
        setSelectedArticles(prev => prev.filter(a => a.id !== article.id))
      }
    }
  }

  const updateLigne = (index: number, field: keyof LigneFormData, value: number) => {
    const newLignes = [...lignes]
    newLignes[index] = { ...newLignes[index], [field]: value }
    
    if (field === "articleId") {
      const article = articles.find(a => a.id === value)
      if (article) {
        newLignes[index].prixUnitaire = article.prixUnitaire
        setSelectedArticles(prev => {
          const filtered = prev.filter(a => a.id !== lignes[index].articleId)
          return [...filtered, article]
        })
      }
    }
    
    setLignes(newLignes)
  }

  const onSubmit = async (data: CommandeClientFormData) => {
    try {
      const commandeData = {
        code: data.code,
        dateCommande: data.dateCommande.toISOString().split('T')[0],
        clientId: data.clientId,
        entrepriseId: data.entrepriseId,
      }

      let savedCommande
      if (mode === "create") {
        savedCommande = await createCommandeClient.mutateAsync(commandeData)
        
        if (savedCommande && lignes.length > 0) {
          for (const ligne of lignes) {
            if (ligne.articleId && ligne.quantite > 0 && ligne.prixUnitaire >= 0) {
              const ligneData = {
                commandeClientId: savedCommande.id,
                articleId: ligne.articleId,
                quantite: ligne.quantite,
                prixUnitaire: ligne.prixUnitaire,
                entrepriseId: data.entrepriseId,
              }
              
              await addLigneMutation.mutateAsync({
                commandeId: savedCommande.id,
                ligne: ligneData,
              })
            }
          }
        }
      } else if (commandeClient) {
        savedCommande = await updateCommandeClient.mutateAsync({
          id: commandeClient.id,
          data: commandeData,
        })

        if (savedCommande) {
          const existingLignes = commandeClient.ligneCommandeClients || []
          
          for (const ligne of lignes) {
            if (ligne.articleId && ligne.quantite > 0 && ligne.prixUnitaire >= 0) {
              const ligneData = {
                commandeClientId: savedCommande.id,
                articleId: ligne.articleId,
                quantite: ligne.quantite,
                prixUnitaire: ligne.prixUnitaire,
                entrepriseId: data.entrepriseId,
              }

              if (ligne.id) {
                await updateLigneMutation.mutateAsync({
                  commandeId: savedCommande.id,
                  ligneId: ligne.id,
                  ligne: ligneData,
                })
              } else {
                await addLigneMutation.mutateAsync({
                  commandeId: savedCommande.id,
                  ligne: ligneData,
                })
              }
            }
          }

          const currentLigneIds = lignes.filter(l => l.id).map(l => l.id)
          const lignesToRemove = existingLignes.filter(
            existing => !currentLigneIds.includes(existing.id)
          )

          for (const ligneToRemove of lignesToRemove) {
            await removeLigneMutation.mutateAsync({
              commandeId: savedCommande.id,
              ligneId: ligneToRemove.id,
            })
          }
        }
      }

      onOpenChange(false)
      form.reset()
      setLignes([])
      setSelectedArticles([])
    } catch (error) {
      console.error("Erreur lors de la soumission:", error)
    }
  }

  const isLoading = createCommandeClient.isPending || updateCommandeClient.isPending || addLigneMutation.isPending || updateLigneMutation.isPending || removeLigneMutation.isPending

  const getTotalCommande = () => {
    return lignes.reduce((total, ligne) => {
      return total + (ligne.quantite * ligne.prixUnitaire)
    }, 0)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-full lg:max-w-6xl xl:max-w-7xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>
            {mode === "create" ? "Nouvelle Commande Client" : "Modifier la Commande Client"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Créez une nouvelle commande client avec ses lignes de commande."
              : "Modifier la Commande Client\nModifiez les informations de la commande client."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-1">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code de la commande</FormLabel>
                    <FormControl>
                      <Input placeholder="CMD-001" {...field} />
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
                    <Popover modal={true}>
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
                              format(field.value, "dd MMMM yyyy", { locale: fr })
                            ) : (
                              <span>Sélectionner une date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start" side="bottom" sideOffset={4}>
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date: Date) =>
                            date < new Date("1900-01-01")
                          }
                          autoFocus
                        />
                      </PopoverContent>
                    </Popover>
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
                      onValueChange={(value) => {
                        const entrepriseId = parseInt(value)
                        field.onChange(entrepriseId)
                        setSelectedEntrepriseId(entrepriseId)
                        // Reset client selection when enterprise changes
                        form.setValue("clientId", 0)
                        form.clearErrors("clientId")
                      }}
                      value={field.value?.toString() || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une entreprise" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isLoadingEnterprises ? (
                          <SelectItem value="loading" disabled>
                            Chargement des entreprises...
                          </SelectItem>
                        ) : enterprisesError ? (
                          <SelectItem value="error" disabled>
                            Erreur de chargement
                          </SelectItem>
                        ) : enterprises.length === 0 ? (
                          <SelectItem value="empty" disabled>
                            Aucune entreprise disponible
                          </SelectItem>
                        ) : (
                          enterprises.map((enterprise) => (
                            <SelectItem key={enterprise.id} value={enterprise.id.toString()}>
                              {enterprise.nomEntreprise}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {selectedEntrepriseId && (
              <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value?.toString() || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un client" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isLoadingClients ? (
                          <SelectItem value="loading" disabled>
                            Chargement des clients...
                          </SelectItem>
                        ) : clientsError ? (
                          <SelectItem value="error" disabled>
                            Erreur de chargement
                          </SelectItem>
                        ) : clients.length === 0 ? (
                          <SelectItem value="empty" disabled>
                            Aucun client disponible pour cette entreprise
                          </SelectItem>
                        ) : (
                          clients.map((client) => (
                            <SelectItem key={client.id} value={client.id.toString()}>
                              {client.prenom} {client.nom} - {client.email}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Lignes de commande */}
            <Card className="flex-1 min-h-0">
              <CardHeader className="flex-shrink-0">
                <div className="flex items-center justify-between">
                  <CardTitle>Lignes de commande</CardTitle>
                  <Button type="button" onClick={addLigneToForm} size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter une ligne
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 max-h-96 overflow-y-auto">
                {lignes.map((ligne, index) => (
                  <div key={`ligne-${index}-${ligne.articleId || 'new'}`} className="grid grid-cols-12 items-center gap-4 p-4 border rounded-lg">
                    <div className="col-span-5">
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Article</label>
                      <Select
                        value={ligne.articleId.toString()}
                        onValueChange={(value) => updateLigne(index, "articleId", parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un article" />
                        </SelectTrigger>
                        <SelectContent>
                          {articles
                            .filter(article => !selectedArticles.some(selected => selected.id === article.id) || article.id === ligne.articleId)
                            .map((article) => (
                              <SelectItem key={article.id} value={article.id.toString()}>
                                {article.designation} - {article.prixUnitaire?.toFixed(2)}€
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Quantité</label>
                      <Input
                        type="number"
                        placeholder="Quantité"
                        value={ligne.quantite}
                        onChange={(e) => updateLigne(index, "quantite", parseInt(e.target.value) || 0)}
                        min="1"
                      />
                    </div>
                    
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Prix unitaire (€)</label>
                      <Input
                        type="number"
                        placeholder="Prix unitaire"
                        value={ligne.prixUnitaire}
                        onChange={(e) => updateLigne(index, "prixUnitaire", parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                      />
                    </div>
                    
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Total</label>
                      <div className="font-medium pt-2">
                        {new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: 'EUR'
                        }).format(ligne.quantite * ligne.prixUnitaire)}
                      </div>
                    </div>
                    
                    <div className="col-span-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeLigne(index)}
                        className="w-full"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {lignes.length === 0 && (
                  <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                    <p className="font-medium">Aucune ligne de commande</p>
                    <p className="text-sm mt-1">Ajoutez des articles à votre commande</p>
                  </div>
                )}
                
                {lignes.length > 0 && (
                  <div className="flex justify-end pt-4 border-t">
                    <div className="text-lg font-semibold">
                      Total: {new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: 'EUR'
                      }).format(getTotalCommande())}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && mode === "create" && "Création..."}
                {isLoading && mode === "edit" && "Mise à jour..."}
                {!isLoading && mode === "create" && "Créer"}
                {!isLoading && mode === "edit" && "Mettre à jour"}
              </Button>
            </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
