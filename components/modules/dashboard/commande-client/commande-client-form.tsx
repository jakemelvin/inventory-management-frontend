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
import { CommandeClient, Article } from "@/types"

const commandeClientSchema = z.object({
  code: z.string().min(1, "Le code est obligatoire"),
  dateCommande: z.date({
    required_error: "La date de commande est obligatoire",
  }),
  clientId: z.number().optional(),
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
}: CommandeClientFormProps) {
  const [lignes, setLignes] = useState<(LigneFormData & { id?: number })[]>([])
  const [selectedArticles, setSelectedArticles] = useState<Article[]>([])

  const { createCommandeClient, updateCommandeClient } = useCommandeClient({})
  const { getArticles } = useArticles()
  const { data: articles = [] } = getArticles

  const form = useForm<CommandeClientFormData>({
    resolver: zodResolver(commandeClientSchema),
    defaultValues: {
      code: "",
      dateCommande: new Date(),
      clientId: undefined,
    },
  })

  useEffect(() => {
    if (commandeClient && mode === "edit") {
      form.reset({
        code: commandeClient.code,
        dateCommande: new Date(commandeClient.dateCommande),
        clientId: undefined,
      })
      
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
      form.reset({
        code: "",
        dateCommande: new Date(),
        clientId: undefined,
      })
      setLignes([])
      setSelectedArticles([])
    }
  }, [commandeClient, mode, form])

  const addLigne = () => {
    setLignes([...lignes, { articleId: 0, quantite: 1, prixUnitaire: 0 }])
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
      }

      if (mode === "create") {
        await createCommandeClient.mutateAsync(commandeData)
      } else if (commandeClient) {
        await updateCommandeClient.mutateAsync({
          id: commandeClient.id,
          data: commandeData,
        })
      }

      onOpenChange(false)
    } catch (error) {
      console.error("Erreur lors de la soumission:", error)
    }
  }

  const isLoading = createCommandeClient.isPending || updateCommandeClient.isPending

  const getTotalCommande = () => {
    return lignes.reduce((total, ligne) => {
      return total + (ligne.quantite * ligne.prixUnitaire)
    }, 0)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Nouvelle Commande Client" : "Modifier la Commande Client"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Gérez les commandes clients de votre système d'inventaires de commande."
              : "Modifiez les informations de la commande client."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <Popover>
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
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date: Date) =>
                            date < new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Lignes de commande */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Lignes de commande</CardTitle>
                  <Button type="button" onClick={addLigne} size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter une ligne
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {lignes.map((ligne, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="flex-1">
                      <Select
                        value={ligne.articleId.toString()}
                        onValueChange={(value) => updateLigne(index, "articleId", parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un article" />
                        </SelectTrigger>
                        <SelectContent>
                          {articles
                            .filter(article => 
                              !selectedArticles.some(selected => selected.id === article.id) ||
                              article.id === ligne.articleId
                            )
                            .map((article) => (
                              <SelectItem key={article.id} value={article.id.toString()}>
                                {article.designation} - {article.codeArticle}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="w-24">
                      <Input
                        type="number"
                        placeholder="Qté"
                        value={ligne.quantite}
                        onChange={(e) => updateLigne(index, "quantite", parseInt(e.target.value) || 0)}
                        min="1"
                      />
                    </div>
                    
                    <div className="w-32">
                      <Input
                        type="number"
                        placeholder="Prix unitaire"
                        value={ligne.prixUnitaire}
                        onChange={(e) => updateLigne(index, "prixUnitaire", parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                      />
                    </div>
                    
                    <div className="w-32 text-right font-medium">
                      {new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: 'EUR'
                      }).format(ligne.quantite * ligne.prixUnitaire)}
                    </div>
                    
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeLigne(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                {lignes.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Aucune ligne de commande. Cliquez sur &quot;Ajouter une ligne&quot; pour commencer.
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
                {isLoading
                  ? mode === "create"
                    ? "Création..."
                    : "Mise à jour..."
                  : mode === "create"
                  ? "Créer"
                  : "Mettre à jour"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
