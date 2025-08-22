import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Package, ShoppingCart, BarChart3, Users, TrendingUp, Shield } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HomeOffers() {
    const features = [
        {
            title: "Gestion des stocks",
            description: "Suivi en temps réel de vos inventaires avec alertes automatiques pour les ruptures de stock.",
            icon: Package,
        },
        {
            title: "Commandes clients",
            description: "Création, suivi et gestion complète des commandes avec workflow automatisé.",
            icon: ShoppingCart,
        },
        {
            title: "Gestion des fournisseurs",
            description: "Base de données centralisée de vos fournisseurs avec historique des commandes.",
            icon: Users,
        },
        {
            title: "Rapports et analyses",
            description: "Tableaux de bord interactifs avec statistiques de ventes et mouvements de stock.",
            icon: BarChart3,
        },
        {
            title: "Suivi des ventes",
            description: "Enregistrement et analyse des ventes avec calcul automatique des bénéfices.",
            icon: TrendingUp,
        },
        {
            title: "Sécurité et accès",
            description: "Contrôle d'accès basé sur les rôles (Admin, Manager, Employé).",
            icon: Shield,
        },
    ]

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12 animate-fade-in">
                    <h2 className="text-3xl font-bold text-foreground mb-4">Fonctionnalités principales</h2>
                    <p className="text-muted-foreground">Découvrez les atouts de StockPro pour votre entreprise</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <Card key={feature.title} className="card-hover animate-slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
                            <CardHeader>
                                <div className="flex items-center mb-2">
                                    <feature.icon className="h-6 w-6 text-primary mr-2" />
                                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                                </div>
                                <CardDescription>{feature.description}</CardDescription>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
                <div className="text-center mt-8">
                    <Link href="/dashboard">
                        <Button className="btn-animate">
                            Découvrir StockPro
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}