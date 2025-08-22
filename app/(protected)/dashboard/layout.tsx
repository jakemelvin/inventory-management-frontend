import type React from "react"
import { getAuthenticatedUser } from "@/lib/serverAuth"
import { UserRoles } from "@/types"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar, Navbar } from "@/components/layout"

export default async function DashboardLayout({children, admin, manager, employee}: Readonly<{
    children: React.ReactNode
    admin: React.ReactNode
    manager: React.ReactNode
    employee: React.ReactNode
}>) {
    const { session } = await getAuthenticatedUser({
        allowedRoles: [UserRoles.ADMIN, UserRoles.MANAGER, UserRoles.EMPLOYEE],
        authRedirect: "/login",
        authzRedirect: "/unauthorized",
    })

    // Render role-specific content using slots
    const renderRoleContent = () => {
        switch (session?.user?.role) {
            case UserRoles.ADMIN:
                return admin        
            case UserRoles.MANAGER:
                return manager            
            case UserRoles.EMPLOYEE:
                return employee
            default:
                return children
        }
    }

    return (
        <SidebarProvider>
            <AppSidebar session={session} />
            <SidebarInset>
                <Navbar session={session} />
                <main className="flex-1 space-y-4 p-4 md:p-8">{renderRoleContent()}</main>
            </SidebarInset>
        </SidebarProvider>
    )
}