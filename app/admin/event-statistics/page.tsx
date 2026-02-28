import { RoleGuard } from "@/components/auth/RoleGuard";
import { getAllEventStatistics } from "@/app/actions/eventStatisticsActions";
import EventStatisticsContent from "./EventStatisticsContent";

export const dynamic = "force-dynamic";

export default async function EventStatisticsPage() {
  const statistics = await getAllEventStatistics();

  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <div className="min-h-screen bg-zinc-50 dark:bg-black py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white">
              Estatísticas de Eventos
            </h1>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Painel analítico com métricas de participação, presença e
              avaliação de todos os eventos cadastrados.
            </p>
          </div>

          <EventStatisticsContent initialData={statistics} />
        </div>
      </div>
    </RoleGuard>
  );
}
