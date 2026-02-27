"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  registerForEventAction,
  cancelRegistrationAction,
} from "@/app/actions/registrationActions";
import Link from "next/link";
import { OrganizerResponseDTO } from "@/types/organizer";

interface EventRegistrationButtonProps {
  eventId: string;
  isRegistered: boolean;
  organizerEmail: string;
  isCanceled: boolean;
  isPast: boolean;
  isFull: boolean;
  isCompleted: boolean;
  organizers: OrganizerResponseDTO[];
}

export function EventRegistrationButton({
  eventId,
  isRegistered,
  organizerEmail,
  isCanceled,
  isPast,
  isFull,
  isCompleted,
  organizers,
}: Readonly<EventRegistrationButtonProps>) {
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const isOrganizer = organizers.some(
    (org) => org.contactEmail === organizerEmail,
  );

  // O organizador não pode se inscrever no próprio evento
  if (isAuthenticated && isOrganizer) {
    return (
      <div className="flex flex-col gap-3">
        <div className="w-full py-3 px-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 font-medium rounded-lg text-center border border-zinc-200 dark:border-zinc-700">
          Você é o organizador deste evento
        </div>

        {isCanceled ? (
          <button
            disabled
            className="w-full py-3 px-4 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-md font-medium cursor-not-allowed"
          >
            Evento Cancelado
          </button>
        ) : (
          <Link
            href={`/events/${eventId}/presence`}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-center transition-colors shadow-lg shadow-blue-600/20"
          >
            📋 Gerenciar Presenças
          </Link>
        )}
      </div>
    );
  }

  const handleAction = async () => {
    setIsLoading(true);

    try {
      if (isRegistered) {
        // Chama a Server Action de Cancelamento
        await cancelRegistrationAction(eventId);
        alert("Inscrição cancelada com sucesso! A vaga foi liberada.");
      } else {
        // Chama a Server Action de Inscrição
        await registerForEventAction(eventId);
        alert("Inscrição realizada com sucesso!");
      }
    } catch (error) {
      alert(
        (error as Error).message ||
          "Ocorreu um erro ao processar sua solicitação.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isCanceled) {
    return (
      <button
        disabled
        className="w-full py-3 px-4 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-md font-medium cursor-not-allowed"
      >
        Evento Cancelado
      </button>
    );
  }

  if (isCompleted) {
    return (
      <button
        disabled
        className="w-full py-3 px-4 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-md font-medium cursor-not-allowed"
      >
        Evento Finalizado
      </button>
    );
  }

  if (isPast) {
    return (
      <button
        disabled
        className="w-full py-3 px-4 bg-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500 rounded-md font-medium cursor-not-allowed"
      >
        Inscrições Encerradas
      </button>
    );
  }

  if (isFull && !isRegistered) {
    return (
      <button
        disabled
        className="w-full py-3 px-4 bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 rounded-md font-medium cursor-not-allowed"
      >
        Vagas Esgotadas
      </button>
    );
  }

  if (isRegistered) {
    return (
      <button
        onClick={handleAction}
        disabled={isLoading}
        className="w-full py-3 px-4 bg-white dark:bg-zinc-900 text-red-600 border border-zinc-200 dark:border-zinc-700 font-medium rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors disabled:opacity-50"
      >
        {isLoading ? "Processando..." : "Cancelar Inscrição"}
      </button>
    );
  }

  return (
    <button
      onClick={handleAction}
      disabled={isLoading}
      className="w-full py-3 px-4 bg-zinc-900 dark:bg-white text-white dark:text-black font-medium rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-lg shadow-zinc-900/10 disabled:opacity-50"
    >
      {isLoading ? "Processando..." : "Inscrever-se no Evento"}
    </button>
  );
}
