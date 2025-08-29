import { type UserRole, UserRoles } from "@/types"
import { Settings, Building2, Package, ShoppingCart, Truck, TrendingUp, FolderOpen } from "lucide-react"

export interface NavigationItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
  roles: UserRole[]
}

export const navigationConfig: NavigationItem[] = [
  {
    title: "Entreprises",
    href: "/dashboard/entreprises",
    icon: Building2,
    roles: [UserRoles.ADMIN, UserRoles.MANAGER],
  },
  {
    title: "Articles",
    href: "/dashboard/articles",
    icon: Package,
    roles: [UserRoles.ADMIN, UserRoles.MANAGER, UserRoles.EMPLOYEE],
  },
  {
    title: "Catégories",
    href: "/dashboard/categories",
    icon: FolderOpen,
    roles: [UserRoles.ADMIN, UserRoles.MANAGER, UserRoles.EMPLOYEE],
  },
  {
    title: "Commandes Clients",
    href: "/dashboard/commandes-clients",
    icon: ShoppingCart,
    roles: [UserRoles.ADMIN, UserRoles.MANAGER, UserRoles.EMPLOYEE],
  },
  {

    title: "Ventes",
    href: "/dashboard/ventes",
    icon: TrendingUp,
    roles: [UserRoles.ADMIN, UserRoles.MANAGER, UserRoles.EMPLOYEE],
  },

    title: "fournisseurs",
    href: "/dashboard/fournisseurs",
    icon: Truck,
    roles: [UserRoles.ADMIN, UserRoles.MANAGER, UserRoles.EMPLOYEE],
  },


  {
    title: "Paramètres",
    href: "/dashboard/settings",
    icon: Settings,
    roles: [UserRoles.ADMIN, UserRoles.MANAGER, UserRoles.EMPLOYEE],
  },
];

export function getNavigationForRole(role: UserRole): NavigationItem[] {
  return navigationConfig.filter((item) => item.roles.includes(role))
}
