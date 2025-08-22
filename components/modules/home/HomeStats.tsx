import { Package, ShoppingCart, TrendingUp, Users } from "lucide-react"

const stats = [
    { label: "Articles gérés", value: "15,000+", icon: Package, color: "text-primary" },
    { label: "Commandes traitées", value: "45,000+", icon: ShoppingCart, color: "text-primary" },
    { label: "Chiffre d'affaires (€)", value: "2.5M+", icon: TrendingUp, color: "text-primary" },
    { label: "Entreprises clientes", value: "350+", icon: Users, color: "text-primary" },
]

export function HomeStats() {
    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center animate-slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
                            <div
                                className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-background shadow-sm mb-4`}
                            >
                                <stat.icon className={`h-6 w-6 ${stat.color}`} />
                            </div>
                            <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                            <div className="text-sm text-muted-foreground">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}