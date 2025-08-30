"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
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
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { MvtStk, TypeMvtStk } from "@/types"
import { useMvtStk } from "@/hooks/useMvtStk"
import { useArticles } from "@/hooks/useArticles"
import { useEnterprises } from "@/hooks/useEnterprises"

const mvtStkSchema = z.object({
  dateMvt: z.date({
    required_error: "La date du mouvement est requise",
  }),
  quantite: z.number({
    required_error: "La quantité est requise",
  }).positive("La quantité doit être positive"),
  typeMvt: z.nativeEnum(TypeMvtStk, {
    required_error: "Le type de mouvement est requis",
  }),
  articleId: z.number({
    required_error: "L'article est requis",
  }).positive("Veuillez sélectionner un article"),
  entrepriseId: z.number({
    required_error: "L'entreprise est requise",
  }).positive("Veuillez sélectionner une entreprise"),
})

type MvtStkFormData = z.infer<typeof mvtStkSchema>

interface MvtStkFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mvtStk?: MvtStk
  mode: "create" | "edit"
}

export function MvtStkForm({
  open,
  onOpenChange,
  mvtStk,
  mode,
}: Readonly<MvtStkFormProps>) {
  const { createMvtStk, updateMvtStk } = useMvtStk({})
  const { getArticles } = useArticles()
  const { getEnterprises } = useEnterprises()
  const { data: articles = [] } = getArticles
  const { data: enterprises = [] } = getEnterprises

  const form = useForm<MvtStkFormData>({
    resolver: zodResolver(mvtStkSchema),
    defaultValues: {
      dateMvt: new Date(),
      quantite: 0,
      typeMvt: TypeMvtStk.ENTREE,
      articleId: 0,
      entrepriseId: 0,
    },
  })

  useEffect(() => {
    if (mode === "edit" && mvtStk) {
      form.reset({
        dateMvt: new Date(mvtStk.dateMvt),
        quantite: mvtStk.quantite,
        typeMvt: mvtStk.typeMvt,
        articleId: mvtStk.article.id,
        entrepriseId: mvtStk.article.entreprise.id,
      })
    } else {
      form.reset({
        dateMvt: new Date(),
        quantite: 0,
        typeMvt: TypeMvtStk.ENTREE,
        articleId: 0,
        entrepriseId: 0,
      })
    }
  }, [mode, mvtStk, form])

  const onSubmit = async (data: MvtStkFormData) => {
    try {
      const payload = {
        ...data,
        dateMvt: data.dateMvt.toISOString(),
      }

      if (mode === "create") {
        await createMvtStk.mutateAsync({ data: payload })
      } else if (mvtStk) {
        await updateMvtStk.mutateAsync({ id: mvtStk.id, data: payload })
      }
      
      onOpenChange(false)
      form.reset()
    } catch (error) {
      console.error("Error submitting form:", error)
    }
  }

  const isLoading = createMvtStk.isPending || updateMvtStk.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Nouveau mouvement de stock" : "Modifier le mouvement de stock"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create" 
              ? "Créez un nouveau mouvement de stock en remplissant les informations ci-dessous."
              : "Modifiez les informations du mouvement de stock."
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="dateMvt"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date du mouvement</FormLabel>
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
                            format(field.value, "PPP", { locale: fr })
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
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="typeMvt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de mouvement</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner le type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={TypeMvtStk.ENTREE}>Entrée</SelectItem>
                      <SelectItem value={TypeMvtStk.SORTIE}>Sortie</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantite"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantité</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
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
                  <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
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
              name="articleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Article</FormLabel>
                  <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un article" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {articles.map((article) => (
                        <SelectItem key={article.id} value={article.id.toString()}>
                          {article.designation} - {article.codeArticle}
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
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {(() => {
                  if (isLoading) return "En cours..."
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
