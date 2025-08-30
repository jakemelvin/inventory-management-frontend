import { RolesTable } from "@/components/modules/dashboard/role";

export default function RolesPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-7xl">
        <RolesTable />
      </div>
    </div>
  );
}

