"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createEventAction } from "@/app/actions/eventActions";
import { EventRequestDTO, EventCategory, Campus } from "@/types/event";

// Mapeamento: Frontend (String) -> Backend (ID)
// Esses IDs (1, 2, 3...) precisam existir no banco de dados (tabela categories)
const categoryMap: Record<EventCategory, number> = {
  "palestra": 1,
  "seminario": 2,
  "workshop": 3,
  "cultural": 4,
  "feira": 5,
  "livre": 6,
  "conferencia": 7,
  "festival": 8,
  "outro": 9
};

// Mapeamento: Frontend (String) -> Backend (ID)
// IDs devem existir na tabela locations
const locationMap: Record<Campus, number> = {
  "reitoria": 1,
  "ondina": 2,
  "sao lazaro": 3,
  "canela": 4,
  "graca": 5,
  "federacao": 6
};

export default function CreateEventForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    category: "palestra" as EventCategory, // Valor padrão válido
    location: "ondina" as Campus,          // Valor padrão válido
    workloadHours: "",
    maxCapacity: "",
    onlineLink: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Convertemos a String do form para o ID do DTO
      const payload: EventRequestDTO = {
        title: formData.title,
        description: formData.description,
        startTime: formData.startTime,
        endTime: formData.endTime,
        categoryId: categoryMap[formData.category], // Pega o número correspondente (ex: "palestra" vira 1)
        locationId: locationMap[formData.location], // Pega o número correspondente
        workloadHours: Number(formData.workloadHours),
        maxCapacity: Number(formData.maxCapacity),
        onlineLink: formData.onlineLink || undefined
      };

      const result = await createEventAction(payload);

      if (result?.error) {
        throw new Error(result.error);
      }

      // Se não houve erro, a action já faz redirect para /events
      
    } catch (err: any) {
      setError(err.message || "Erro ao criar evento");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md">
      {error && <div className="text-red-500 p-2 bg-red-50 rounded">{error}</div>}

      {/* Inputs de texto (Título, Descrição...) mantêm-se iguais */}
      
      <div>
        <label className="block text-sm font-medium mb-1 dark:text-gray-200">Título</label>
        <input name="title" required value={formData.title} onChange={handleChange} className="w-full p-2 border rounded dark:bg-zinc-700" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 dark:text-gray-200">Descrição</label>
        <textarea name="description" required rows={3} value={formData.description} onChange={handleChange} className="w-full p-2 border rounded dark:bg-zinc-700" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-200">Início</label>
            <input type="datetime-local" name="startTime" required value={formData.startTime} onChange={handleChange} className="w-full p-2 border rounded dark:bg-zinc-700" />
        </div>
        <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-200">Fim</label>
            <input type="datetime-local" name="endTime" required value={formData.endTime} onChange={handleChange} className="w-full p-2 border rounded dark:bg-zinc-700" />
        </div>
      </div>

      {/* Select usando suas Categorias Reais */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-gray-200">Categoria</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 border rounded dark:bg-zinc-700"
          >
            {Object.keys(categoryMap).map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Select usando seus Locais Reais (Campus) */}
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-gray-200">Campus</label>
          <select
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-2 border rounded dark:bg-zinc-700"
          >
            {Object.keys(locationMap).map((loc) => (
              <option key={loc} value={loc}>
                {loc.charAt(0).toUpperCase() + loc.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-200">Carga Horária (h)</label>
            <input type="number" name="workloadHours" required min="1" value={formData.workloadHours} onChange={handleChange} className="w-full p-2 border rounded dark:bg-zinc-700" />
        </div>
        <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-200">Capacidade</label>
            <input type="number" name="maxCapacity" required min="1" value={formData.maxCapacity} onChange={handleChange} className="w-full p-2 border rounded dark:bg-zinc-700" />
        </div>
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded font-medium disabled:opacity-50"
      >
        {loading ? "Criando..." : "Cadastrar Evento"}
      </button>
    </form>
  );
}