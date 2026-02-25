"use client";

import { useState } from "react";
import { RegistrationResponseDTO } from "@/types/event";
import { saveBulkAttendanceAction } from "@/app/actions/presenceActions";

interface AttendanceTableProps {
  eventId: string;
  initialRegistrations: RegistrationResponseDTO[];
}

export default function AttendanceTable({ eventId, initialRegistrations }: AttendanceTableProps) {
  const [registrations, setRegistrations] = useState(initialRegistrations);
  const [isLoading, setIsLoading] = useState(false);

  // Inicializa o estado dos selecionados apenas com os que JÁ POSSUEM presença (attended: true)
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(
    new Set(initialRegistrations.filter((r) => r.attended).map((r) => r.userId))
  );

  const toggleUser = (userId: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Pega todos os IDs que estão marcados no checkbox agora
      const currentSelectedIds = Array.from(selectedUsers);
      
      // Pega todos os IDs que NÃO estão marcados (para tirar a falta, caso o professor tenha errado)
      const currentUnselectedIds = registrations
        .map(r => r.userId)
        .filter(id => !selectedUsers.has(id));

      // 1. Salva quem ESTÁ presente (attended = true)
      if (currentSelectedIds.length > 0) {
        await saveBulkAttendanceAction(eventId, currentSelectedIds, true);
      }

      // 2. Salva quem NÃO ESTÁ presente (attended = false)
      if (currentUnselectedIds.length > 0) {
        await saveBulkAttendanceAction(eventId, currentUnselectedIds, false);
      }

      alert("Lista de presença atualizada com sucesso!");
    } catch (error: any) {
      alert(error.message || "Erro ao salvar presença");
    } finally {
      setIsLoading(false);
    }
  };

  if (registrations.length === 0) {
    return <p className="text-zinc-500">Nenhum aluno inscrito neste evento ainda.</p>;
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
            <tr>
              <th className="p-4 w-16">Presente</th>
              <th className="p-4">Nome do Aluno</th>
              <th className="p-4">E-mail</th>
              <th className="p-4">Status da Inscrição</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {registrations.map((reg) => (
              <tr key={reg.userId} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                <td className="p-4">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    checked={selectedUsers.has(reg.userId)}
                    onChange={() => toggleUser(reg.userId)}
                  />
                </td>
                <td className="p-4 font-medium text-zinc-900 dark:text-zinc-100">{reg.userName}</td>
                <td className="p-4 text-zinc-500 dark:text-zinc-400">{reg.userEmail}</td>
                <td className="p-4 text-zinc-500 dark:text-zinc-400">{reg.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 bg-zinc-50 dark:bg-zinc-800 border-t border-zinc-200 dark:border-zinc-700 flex justify-end">
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
        >
          {isLoading ? "Salvando..." : "Salvar Presenças"}
        </button>
      </div>
    </div>
  );
}