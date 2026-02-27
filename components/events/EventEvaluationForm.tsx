"use client";

import { useState } from "react";
import { Star, Send, CheckCircle } from "lucide-react";
import { submitEvaluationAction } from "@/app/actions/evaluationActions";

interface EventEvaluationFormProps {
  eventId: string;
}

export function EventEvaluationForm({
  eventId,
}: Readonly<EventEvaluationFormProps>) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Por favor, selecione uma nota de 1 a 5 estrelas.");
      return;
    }
    if (comment.trim().length < 5) {
      setError("Por favor, escreva uma avaliação com pelo menos 5 caracteres.");
      return;
    }

    setLoading(true);
    setError("");

    const result = await submitEvaluationAction(
      eventId,
      rating,
      comment.trim(),
    );

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 text-center animate-in fade-in duration-300">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-green-800 dark:text-green-400 mb-1">
          Avaliação Enviada!
        </h3>
        <p className="text-sm text-green-700 dark:text-green-500">
          Muito obrigado pelo seu feedback. Ele ajuda os organizadores a
          melhorarem os próximos eventos!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-6 md:p-8">
      <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
        Avalie este Evento
      </h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
        Como você participou deste evento, sua opinião é fundamental. Conte-nos
        como foi a sua experiência!
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-lg text-sm border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Sua Nota
          </label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="focus:outline-none transition-transform hover:scale-110"
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= (hoveredRating || rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-zinc-300 dark:text-zinc-600"
                  } transition-colors`}
                />
              </button>
            ))}
            <span className="ml-3 text-sm font-medium text-zinc-500">
              {rating > 0 ? `${rating} de 5 estrelas` : "Selecione uma nota"}
            </span>
          </div>
        </div>

        <div>
          <label
            htmlFor="comment"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
          >
            Comentário sobre o evento
          </label>
          <textarea
            id="comment"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="O que você achou dos palestrantes, do local e do conteúdo?"
            className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-zinc-900 dark:text-white resize-y"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {loading ? (
            "Enviando..."
          ) : (
            <>
              <Send className="w-4 h-4" /> Enviar Avaliação
            </>
          )}
        </button>
      </form>
    </div>
  );
}
