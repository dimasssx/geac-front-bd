import { getEventRegistrationsAction } from "@/app/actions/presenceActions";
import AttendanceTable from "./PresenceTable";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function AttendancePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let registrations = [];

  try {
    registrations = await getEventRegistrationsAction(id);
  } catch (error) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center mt-20">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Acesso Negado</h2>
        <p className="text-zinc-600 dark:text-zinc-400">
          Você não é o organizador deste evento ou o evento não existe.
        </p>
        <Link href="/events" className="text-blue-600 hover:underline mt-4 inline-block">
          Voltar para eventos
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href={`/events/${id}`}
          className="inline-flex items-center text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para os detalhes do evento
        </Link>

        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">Controle de Presença</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mb-8">
          Marque os alunos que compareceram ao evento. Alunos com presença confirmada poderão emitir certificado.
        </p>

        <AttendanceTable eventId={id} initialRegistrations={registrations} />
      </div>
    </div>
  );
}