"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Fournisseur } from "@/types/fournisseur"

interface FournisseurDetailProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  fournisseur?: Fournisseur
}

export function FournisseurDetail({
  open,
  onOpenChange,
  fournisseur,
}: Readonly<FournisseurDetailProps>) {
  if (!fournisseur) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Détails du Fournisseur</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Informations personnelles */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Informations personnelles</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nom</p>
                <p className="text-sm">{fournisseur.nom}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Prénom</p>
                <p className="text-sm">{fournisseur.prenom}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-sm">{fournisseur.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Téléphone</p>
                <p className="text-sm">{fournisseur.numTel}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Adresse */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Adresse</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Adresse 1</p>
                <p className="text-sm">{fournisseur.adresse?.adresse1}</p>
              </div>
              {fournisseur.adresse?.adresse2 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Adresse 2</p>
                  <p className="text-sm">{fournisseur.adresse.adresse2}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ville</p>
                <p className="text-sm">{fournisseur.adresse?.ville}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Code Postal</p>
                <p className="text-sm">{fournisseur.adresse?.codePostal}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pays</p>
                <p className="text-sm">{fournisseur.adresse?.pays}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Entreprise */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Entreprise</h3>
            <div className="space-y-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nom de l'entreprise</p>
                <Badge variant="outline">{fournisseur.entreprise?.nomEntreprise}</Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Description</p>
                <p className="text-sm">{fournisseur.entreprise?.description}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email entreprise</p>
                <p className="text-sm">{fournisseur.entreprise?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}