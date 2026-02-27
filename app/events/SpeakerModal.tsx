"use client";

import { useState } from "react";
import {
  createSpeakerAction,
  CreateSpeakerDTO,
} from "@/app/actions/speakerActions";
import { X, Plus, GraduationCap, User, Mail, AlignLeft } from "lucide-react";

interface SpeakerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newSpeakerId: string, newSpeakerName: string) => void;
}

export default function SpeakerModal({
  isOpen,
  onClose,
  onSuccess,
}: Readonly<SpeakerModalProps>) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [qualifications, setQualifications] = useState([
    { title_name: "", institution: "" },
  ]);

  if (!isOpen) return null;

  const inputClassName =
    "w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-zinc-900 dark:text-white";
  const labelClassName =
    "text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 flex items-center gap-1.5";

  const handleClose = () => {
    setName("");
    setEmail("");
    setBio("");
    setQualifications([{ title_name: "", institution: "" }]);
    setError("");
    onClose();
  };

  const handleAddQualification = () =>
    setQualifications([...qualifications, { title_name: "", institution: "" }]);

  const handleRemoveQualification = (index: number) =>
    setQualifications(qualifications.filter((_, i) => i !== index));

  const handleQualificationChange = (
    index: number,
    field: "title_name" | "institution",
    value: string,
  ) => {
    const updated = [...qualifications];
    updated[index][field] = value;
    setQualifications(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (name.trim() === "") {
      setError("O nome do palestrante é obrigatório.");
      setLoading(false);
      return;
    }

    const validQualifications = qualifications.filter(
      (q) => q.title_name.trim() !== "" && q.institution.trim() !== "",
    );

    const payload: CreateSpeakerDTO = {
      name: name.trim(),
      email: email.trim() || undefined,
      bio: bio.trim(),
      qualifications: validQualifications,
    };

    const result = await createSpeakerAction(payload);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else if (result.speakerId) {
      handleClose();
      setLoading(false);
      onSuccess(result.speakerId.toString(), payload.name);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60 dark:bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div
        className="bg-white dark:bg-zinc-800 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden border border-zinc-200 dark:border-zinc-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center px-6 py-4 border-b border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Cadastrar Palestrante
          </h2>
          <button
            onClick={handleClose}
            className="p-1.5 text-zinc-500 hover:text-red-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {error && (
            <div className="text-red-600 text-sm bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 p-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className={labelClassName}>
              <User className="w-4 h-4 text-zinc-500" /> Nome Completo *
            </label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClassName}
              placeholder="Ex: Ana Silva"
            />
          </div>

          <div>
            <label className={labelClassName}>
              <Mail className="w-4 h-4 text-zinc-500" /> E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClassName}
              placeholder="ana.silva@example.com"
            />
          </div>

          <div>
            <label className={labelClassName}>
              <AlignLeft className="w-4 h-4 text-zinc-500" /> Mini-Bio
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className={`${inputClassName} resize-y`}
              placeholder="Especialista em Inteligência Artificial..."
            />
          </div>

          <div className="pt-5 border-t border-zinc-200 dark:border-zinc-700">
            <label className={`${labelClassName} mb-3`}>
              <GraduationCap className="w-4 h-4 text-zinc-500" /> Titulações /
              Qualificações
            </label>

            <div className="space-y-3">
              {qualifications.map((qual, index) => (
                <div
                  key={index}
                  className="flex gap-3 items-start bg-zinc-50 dark:bg-zinc-900/50 p-3 rounded-lg border border-zinc-200 dark:border-zinc-700"
                >
                  <div className="flex-1 space-y-2.5">
                    <input
                      placeholder="Título (Ex: Mestrado em Dados)"
                      value={qual.title_name}
                      onChange={(e) =>
                        handleQualificationChange(
                          index,
                          "title_name",
                          e.target.value,
                        )
                      }
                      className={inputClassName}
                    />
                    <input
                      placeholder="Instituição (Ex: USP)"
                      value={qual.institution}
                      onChange={(e) =>
                        handleQualificationChange(
                          index,
                          "institution",
                          e.target.value,
                        )
                      }
                      className={inputClassName}
                    />
                  </div>
                  {qualifications.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveQualification(index)}
                      className="mt-2 p-1.5 text-zinc-400 hover:text-red-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-md transition-colors"
                      title="Remover"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddQualification}
              className="mt-4 flex items-center text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline"
            >
              <Plus className="w-4 h-4 mr-1" /> Adicionar outra qualificação
            </button>
          </div>

          <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-zinc-200 dark:border-zinc-700">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-700 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 transition-colors shadow-sm"
            >
              {loading ? "Salvando..." : "Salvar Palestrante"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
