"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { ApiError, apiFetch } from "@/app/utils/api";
import { showToast } from "@/app/utils/toast";

interface UnreserveGiftButtonProps {
  giftId: number;
  giftName: string;
}

type Step = "closed" | "form" | "confirm";

export default function UnreserveGiftButton({
  giftId,
  giftName,
}: UnreserveGiftButtonProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("closed");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const close = () => {
    setStep("closed");
    setFirstName("");
    setLastName("");
  };

  const handleContinue = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      return;
    }
    setStep("confirm");
  };

  const handleConfirm = async () => {
    setSubmitting(true);

    try {
      await apiFetch(`/gifts/${giftId}/unreserve`, {
        method: "POST",
        body: JSON.stringify({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
        }),
      });

      showToast("Reserva anulada", { type: "success" });
      close();
      router.refresh();
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "No se pudo anular la reserva";
      showToast(message, { type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setStep("form")}
        className="w-full rounded-lg border border-slate-300 px-4 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50"
      >
        Anular reserva
      </button>

      {step !== "closed" ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => {
            if (!submitting) close();
          }}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {step === "form" ? (
              <form className="space-y-3" onSubmit={handleContinue}>
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-slate-950">
                    Anular reserva
                  </h3>
                  <p className="text-sm text-slate-600">
                    Confirma el nombre y apellido con los que reservaste «
                    {giftName}».
                  </p>
                </div>
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
                    className="flex-1 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800"
                  >
                    Continuar
                  </button>
                  <button
                    type="button"
                    onClick={close}
                    className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-3">
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-slate-950">
                    Confirmación de anulación
                  </h3>
                  <p className="text-sm text-slate-600">
                    ¿Seguro que deseas anular la reserva de «{giftName}»? Esta
                    acción no se puede deshacer.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleConfirm}
                    disabled={submitting}
                    className="flex-1 rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-rose-700 disabled:opacity-70"
                  >
                    {submitting ? "Anulando..." : "Confirmar anulación"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep("form")}
                    disabled={submitting}
                    className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-70"
                  >
                    Volver
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
