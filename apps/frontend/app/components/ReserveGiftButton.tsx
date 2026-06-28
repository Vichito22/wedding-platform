"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { ApiError, apiFetch } from "@/app/utils/api";
import { showToast } from "@/app/utils/toast";

interface ReserveGiftButtonProps {
  giftId: number;
}

export default function ReserveGiftButton({ giftId }: ReserveGiftButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setFirstName("");
    setLastName("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      await apiFetch(`/gifts/${giftId}/reserve`, {
        method: "POST",
        body: JSON.stringify({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
        }),
      });

      showToast("Regalo reservado", { type: "success" });
      resetForm();
      setOpen(false);
      router.refresh();
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "No se pudo reservar el regalo";
      showToast(message, { type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800"
      >
        Reservar regalo
      </button>
    );
  }

  return (
    <form className="space-y-2" onSubmit={handleSubmit}>
      <input
        placeholder="Nombre"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        required
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
      />
      <input
        placeholder="Apellido"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        required
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:opacity-70"
        >
          {submitting ? "Reservando..." : "Confirmar"}
        </button>
        <button
          type="button"
          onClick={() => {
            resetForm();
            setOpen(false);
          }}
          disabled={submitting}
          className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-70"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
