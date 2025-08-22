import { type UserRole, UserRoles } from "@/types"
import { Settings } from "lucide-react"

export interface NavigationItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
  roles: UserRole[]
}

export const navigationConfig: NavigationItem[] = [
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
