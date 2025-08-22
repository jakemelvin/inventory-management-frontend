import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"

export function AdminUsers() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Gestion des utilisateurs
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-center py-8">
                    <p className="text-muted-foreground">
                        Module de gestion des utilisateurs à implémenter
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                        Connexion avec le backend inventory-management en cours...
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}