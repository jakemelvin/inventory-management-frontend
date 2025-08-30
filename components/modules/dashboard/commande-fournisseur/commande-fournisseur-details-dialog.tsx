"use client"

import { CommandeFournisseur } from "@/types"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { 
  User, 
  Calendar, 
  Hash, 
  Building, 
  ShoppingCart, 
  Euro,
  Package,
  Mail,
  Phone,
  MapPin
} from "lucide-react"

interface CommandeFournisseurDetailsDialogProps {
  commandeFournisseur: CommandeFournisseur | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandeFournisseurDetailsDialog({
  commandeFournisseur,
  open,
  onOpenChange,
}: CommandeFournisseurDetailsDialogProps) {
  if (!commandeFournisseur) return null

  const lignes = commandeFournisseur.ligneCommandeFournisseurs || []
  const total = lignes.reduce((sum, ligne) => sum + (ligne.quantite * ligne.prixUnitaire), 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Détails de la commande {commandeFournisseur.code}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations générales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Hash className="h-4 w-4" />
                Informations générales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Code:</span>
                  <Badge variant="outline">{commandeFournisseur.code}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Date de commande:</span>
                  <span>{format(new Date(commandeFournisseur.dateCommande), "PPP", { locale: fr })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Entreprise ID:</span>
                  <Badge variant="secondary">{commandeFournisseur.entrepriseId}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Euro className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Total:</span>
                  <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                    {total.toFixed(2)}€
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informations fournisseur */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-4 w-4" />
                Informations fournisseur
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Nom complet:</span>
                  </div>
                  <p className="text-lg">{commandeFournisseur.fournisseur.prenom} {commandeFournisseur.fournisseur.nom}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Email:</span>
                  </div>
                  <p>{commandeFournisseur.fournisseur.email}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Téléphone:</span>
                  </div>
                  <p>{commandeFournisseur.fournisseur.numTel}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Adresse:</span>
                  </div>
                  <div className="text-sm space-y-1">
                    <p>{commandeFournisseur.fournisseur.adresse.adresse1}</p>
                    {commandeFournisseur.fournisseur.adresse.adresse2 && (
                      <p>{commandeFournisseur.fournisseur.adresse.adresse2}</p>
                    )}
                    <p>{commandeFournisseur.fournisseur.adresse.codePostal} {commandeFournisseur.fournisseur.adresse.ville}</p>
                    <p>{commandeFournisseur.fournisseur.adresse.pays}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Articles commandés */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Package className="h-4 w-4" />
                Articles commandés ({lignes.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {lignes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucun article dans cette commande</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {lignes.map((ligne, index) => (
                    <div key={ligne.id || index}>
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{ligne.article.codeArticle}</Badge>
                            <span className="font-medium">{ligne.article.designation}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <p>Catégorie: {ligne.article.categorie.designation}</p>
                            <p>TVA: {ligne.article.tauxTva}%</p>
                          </div>
                        </div>
                        <div className="text-right space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Quantité:</span>
                            <Badge variant="secondary">{ligne.quantite}</Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Prix unitaire:</span>
                            <span className="font-medium">{ligne.prixUnitaire.toFixed(2)}€</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Sous-total:</span>
                            <span className="font-bold text-green-600">
                              {(ligne.quantite * ligne.prixUnitaire).toFixed(2)}€
                            </span>
                          </div>
                        </div>
                      </div>
                      {index < lignes.length - 1 && <Separator className="my-2" />}
                    </div>
                  ))}
                  
                  {/* Total général */}
                  <Separator />
                  <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                    <span className="text-lg font-semibold">Total de la commande:</span>
                    <span className="text-xl font-bold text-green-600">{total.toFixed(2)}€</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
