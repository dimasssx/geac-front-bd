import { RoleGuard } from "@/components/auth/RoleGuard";
import { getAllOrganizationEngagement } from "@/app/actions/organizationEngagementActions";
import OrganizationEngagementContent from "./OrganizationEngagementContent";

export const dynamic = "force-dynamic";

export default async function OrganizationEngagementPage() {
  const engagement = await getAllOrganizationEngagement();

  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <div className="min-h-screen bg-zinc-50 dark:bg-black py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white">
              Engajamento de Organizações
            </h1>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Painel analítico com métricas de engajamento das organizações:
              eventos realizados e participantes ativos.
            </p>
          </div>

          <OrganizationEngagementContent initialData={engagement} />
        </div>
      </div>
    </RoleGuard>
  );
}
