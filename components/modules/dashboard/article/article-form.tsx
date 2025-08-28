"use client"

import { useState, useEffect } from "react"
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
import { CreateArticleRequest, UpdateArticleRequest, Article } from "@/types"
import { useArticle } from "@/hooks/useArticles"
import { useEnterprises } from "@/hooks/useEnterprises"

const articleSchema = z.object({
  codeArticle: z.string().min(1, "Le code article est requis"),
  designation: z.string().min(1, "La désignation est requise"),
  categorieId: z.number().min(1, "La catégorie est requise"),
  entrepriseId: z.number().min(1, "L'entreprise est requise"),
  prixUnitaire: z.number().min(0, "Le prix unitaire doit être positif"),
  tauxTva: z.number().min(0, "Le taux TVA doit être positif"),
  prixUnitaireTtc: z.number().min(0, "Le prix TTC doit être positif"),
})

type ArticleFormData = z.infer<typeof articleSchema>

interface ArticleFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  article?: Article
  mode: "create" | "edit"
}

export function ArticleForm({
  open,
  onOpenChange,
  article,
  mode,
}: Readonly<ArticleFormProps>) {
  const [imageFile, setImageFile] = useState<File | undefined>()
  const { createArticle, updateArticle } = useArticle({})
  const { getEnterprises } = useEnterprises()
  const { data: enterprises = [] } = getEnterprises

  const form = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      codeArticle: "",
      designation: "",
      categorieId: 0,
      entrepriseId: 0,
      prixUnitaire: 0,
      tauxTva: 0,
      prixUnitaireTtc: 0,
    },
  })

  useEffect(() => {
    if (article && mode === "edit") {
      form.reset({
        codeArticle: article.codeArticle || "",
        designation: article.designation || "",
        categorieId: article.categorie?.id || 0,
        entrepriseId: article.entreprise?.id || 0,
        prixUnitaire: article.prixUnitaire || 0,
        tauxTva: article.tauxTva || 0,
        prixUnitaireTtc: article.prixUnitaireTtc || 0,
      })
    } else if (mode === "create") {
      form.reset({
        codeArticle: "",
        designation: "",
        categorieId: 0,
        entrepriseId: 0,
        prixUnitaire: 0,
        tauxTva: 0,
        prixUnitaireTtc: 0,
      })
    }
  }, [article, mode, form])

  const onSubmit = async (data: ArticleFormData) => {
    try {
      if (mode === "create") {
        const createData: CreateArticleRequest = {
          ...data,
          image: imageFile,
        }
        await createArticle.mutateAsync({ data: createData })
      } else if (article) {
        const updateData: UpdateArticleRequest = {
          ...data,
          image: imageFile,
        }
        await updateArticle.mutateAsync({ 
          id: article.id, 
          data: updateData 
        })
      }
      onOpenChange(false)
      form.reset()
      setImageFile(undefined)
    } catch (error) {
      console.error("Error submitting form:", error)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setImageFile(file)
  }

  // Calculate TTC when price or TVA changes
  const watchPrixUnitaire = form.watch("prixUnitaire")
  const watchTauxTva = form.watch("tauxTva")

  useEffect(() => {
    if (watchPrixUnitaire && watchTauxTva) {
      const ttc = watchPrixUnitaire + (watchPrixUnitaire * watchTauxTva / 100)
      form.setValue("prixUnitaireTtc", Number(ttc.toFixed(2)))
    }
  }, [watchPrixUnitaire, watchTauxTva, form])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Créer un article" : "Modifier l'article"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create" 
              ? "Remplissez les informations pour créer un nouvel article."
              : "Modifiez les informations de l'article."
            }
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="codeArticle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code Article</FormLabel>
                    <FormControl>
                      <Input placeholder="ART-001" {...field} />
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
                      <Input placeholder="Nom de l'article" {...field} />
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
              <FormField
                control={form.control}
                name="categorieId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catégorie</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(Number(value))} 
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une catégorie" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">Shoes</SelectItem>
                        <SelectItem value="2">Electronics</SelectItem>
                        <SelectItem value="3">Clothing</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="prixUnitaire"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix Unitaire (€)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        placeholder="0.00" 
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
                name="tauxTva"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Taux TVA (%)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        placeholder="20.00" 
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
                name="prixUnitaireTtc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix TTC (€)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        placeholder="0.00" 
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        readOnly
                        className="bg-gray-50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Image (optionnel)
              </label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
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
                disabled={createArticle.isPending || updateArticle.isPending}
              >
                {createArticle.isPending || updateArticle.isPending
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
