"use client";

export default function Events({
  params,
}: Readonly<{ params: { events: string } }>) {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black font-sans">
      <main className="flex flex-1 items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-6 text-center text-zinc-900 dark:text-white">
          Página de Eventos: {params.events}
        </h1>
      </main>
    </div>
  );
}
