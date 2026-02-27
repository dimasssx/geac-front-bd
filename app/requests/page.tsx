import { RoleGuard } from "@/components/auth/RoleGuard";
import RequestAccessForm from "./RequestAccessForm";
import { getOrganizers } from "@/app/actions/domainActions";
import { OrganizerResponseDTO } from "@/types/organizer";

export const dynamic = "force-dynamic";

export default async function RequestAccessPage() {
  let organizers: Array<OrganizerResponseDTO> = [];

  try {
    organizers = await getOrganizers();
  } catch (error) {
    console.error("Erro ao carregar organizações:", error);
  }

  return (
    <RoleGuard allowedRoles={["STUDENT", "PROFESSOR", "ORGANIZER"]}>
      <div className="min-h-screen bg-zinc-50 dark:bg-black py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white">
              Solicitar Acesso de Organização
            </h1>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Precisa criar e gerenciar eventos em nome de um departamento,
              laboratório ou centro acadêmico? Envie sua solicitação para a
              nossa equipe de administradores.
            </p>
          </div>

          <RequestAccessForm organizers={organizers} />
        </div>
      </div>
    </RoleGuard>
  );
}
