"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MvtStk, TypeMvtStk } from "@/types"
import { TrendingUp, TrendingDown, Package, Building2, Calendar, Hash } from "lucide-react"

interface MvtStkDetailsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mvtStk?: MvtStk
}

export function MvtStkDetails({
  open,
  onOpenChange,
  mvtStk,
}: Readonly<MvtStkDetailsProps>) {
  if (!mvtStk) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Détails du Mouvement de Stock
          </DialogTitle>
          <DialogDescription>
            Informations complètes sur ce mouvement de stock
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations principales */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Hash className="h-4 w-4" />
                Informations Générales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Type de mouvement</label>
                  <div className="mt-1">
                    <Badge 
                      variant={mvtStk.typeMvt === TypeMvtStk.ENTREE ? "default" : "destructive"}
                      className="flex items-center gap-1 w-fit"
                    >
                      {mvtStk.typeMvt === TypeMvtStk.ENTREE ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {mvtStk.typeMvt}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Quantité</label>
                  <p className="text-lg font-semibold mt-1">
                    {mvtStk.quantite.toLocaleString("fr-FR")}
                  </p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Date du mouvement
                </label>
                <p className="mt-1">{formatDate(mvtStk.dateMvt)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Informations article */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="h-4 w-4" />
                Article Concerné
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Désignation</label>
                  <p className="font-medium mt-1">{mvtStk.article.designation}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Code Article</label>
                  <p className="font-mono text-sm mt-1">{mvtStk.article.codeArticle}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Prix Unitaire</label>
                  <p className="mt-1">{mvtStk.article.prixUnitaire.toLocaleString("fr-FR")} €</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Catégorie</label>
                  <p className="mt-1">{mvtStk.article.categorie.designation}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Prix TTC</label>
                <p className="text-lg font-semibold mt-1">
                  {mvtStk.article.prixUnitaireTtc.toLocaleString("fr-FR")} €
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Informations entreprise */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Entreprise
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Nom de l&apos;entreprise</label>
                <p className="font-medium mt-1">{mvtStk.article.entreprise.nomEntreprise}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <p className="mt-1">{mvtStk.article.entreprise.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="mt-1">{mvtStk.article.entreprise.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Téléphone</label>
                  <p className="mt-1">{mvtStk.article.entreprise.numTel}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
