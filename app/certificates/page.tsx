import { getMyCertificates } from "@/app/actions/certificateActions";
import { CertificateList } from "./CertificateList";

export const dynamic = "force-dynamic";

export default async function CertificadosPage() {
  const { data: certificates, error } = await getMyCertificates();

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            Meus Certificados
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Gerencie e faça o download dos certificados dos eventos em que você
            participou.
          </p>
        </div>

        {error ? (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100">
            {error}
          </div>
        ) : (
          <CertificateList initialCertificates={certificates || []} />
        )}
      </div>
    </main>
  );
}
