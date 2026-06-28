"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { ApiError, apiFetch } from "@/app/utils/api";
import { getAdminSession, logoutAdmin } from "@/app/utils/auth";
import { showToast } from "@/app/utils/toast";

interface Gift {
  id: number;
  name: string;
  description: string | null;
  image_url: string | null;
  price_reference: string | null;
  category: string | null;
  is_reserved: boolean;
  reserved_by: string | null;
  reserved_at: string | null;
  position_order: number;
  created_at: string;
}

interface GiftListResponse {
  gifts: Gift[];
}

interface GiftCreateRequest {
  name: string;
  description?: string;
  image_url?: string;
  price_reference?: number;
  category?: string;
  position_order: number;
}

interface GiftUpdateRequest {
  name: string;
  description: string | null;
  image_url: string | null;
  price_reference: number | null;
  category: string | null;
  position_order: number;
}

export default function AdminPage() {
  const router = useRouter();
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [priceReference, setPriceReference] = useState("");
  const [category, setCategory] = useState("");
  const [positionOrder, setPositionOrder] = useState("0");

  const [editingGift, setEditingGift] = useState<Gift | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editPriceReference, setEditPriceReference] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editPositionOrder, setEditPositionOrder] = useState("0");
  const [updating, setUpdating] = useState(false);

  const hasGifts = useMemo(() => gifts.length > 0, [gifts.length]);

  const loadData = useCallback(async () => {
    try {
      const [session, giftResponse] = await Promise.all([
        getAdminSession(),
        apiFetch<GiftListResponse>("/admin/gifts", { method: "GET" }),
      ]);

      setSessionEmail(session.email);
      setGifts(giftResponse.gifts);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        router.push("/login");
        return;
      }
      showToast("No se pudo cargar el panel admin", { type: "error" });
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    // Deferred to a microtask so loadData's setState calls don't run
    // synchronously inside the effect (avoids cascading renders).
    void Promise.resolve().then(loadData);
  }, [loadData]);

  const resetForm = () => {
    setName("");
    setDescription("");
    setImageUrl("");
    setPriceReference("");
    setCategory("");
    setPositionOrder("0");
  };

  const handleCreateGift = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);

    const payload: GiftCreateRequest = {
      name: name.trim(),
      position_order: Number(positionOrder) || 0,
    };

    if (description.trim()) payload.description = description.trim();
    if (imageUrl.trim()) payload.image_url = imageUrl.trim();
    if (category.trim()) payload.category = category.trim();
    if (priceReference.trim()) payload.price_reference = Number(priceReference);

    try {
      await apiFetch<Gift>("/admin/gifts", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      showToast("Regalo creado", { type: "success" });
      resetForm();
      await loadData();
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "No se pudo crear el regalo";
      showToast(message, { type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (gift: Gift) => {
    setEditingGift(gift);
    setEditName(gift.name);
    setEditDescription(gift.description ?? "");
    setEditImageUrl(gift.image_url ?? "");
    setEditPriceReference(gift.price_reference ?? "");
    setEditCategory(gift.category ?? "");
    setEditPositionOrder(String(gift.position_order));
  };

  const closeEditModal = () => {
    setEditingGift(null);
  };

  const handleUpdateGift = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingGift) return;
    setUpdating(true);

    const payload: GiftUpdateRequest = {
      name: editName.trim(),
      description: editDescription.trim() || null,
      image_url: editImageUrl.trim() || null,
      price_reference: editPriceReference.trim()
        ? Number(editPriceReference)
        : null,
      category: editCategory.trim() || null,
      position_order: Number(editPositionOrder) || 0,
    };

    try {
      await apiFetch<Gift>(`/admin/gifts/${editingGift.id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      showToast("Regalo actualizado", { type: "success" });
      closeEditModal();
      await loadData();
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "No se pudo actualizar el regalo";
      showToast(message, { type: "error" });
    } finally {
      setUpdating(false);
    }
  };

  const handleReleaseGift = async (giftId: number) => {
    try {
      await apiFetch<Gift>(`/admin/gifts/${giftId}/release`, {
        method: "POST",
      });
      showToast("Reserva liberada", { type: "success" });
      await loadData();
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "No se pudo liberar la reserva";
      showToast(message, { type: "error" });
    }
  };

  const handleLogout = async () => {
    try {
      await logoutAdmin();
      router.push("/login");
    } catch {
      showToast("No se pudo cerrar sesion", { type: "error" });
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Admin Panel</h1>
            <p className="text-sm text-slate-600">
              Sesion: {sessionEmail ?? "cargando..."}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            Cerrar sesion
          </button>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <article className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-5">
            <h2 className="text-lg font-semibold text-slate-900">Nuevo regalo</h2>
            <form className="mt-4 space-y-3" onSubmit={handleCreateGift}>
              <input
                placeholder="Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
              />
              <textarea
                placeholder="Descripcion"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 min-h-24"
              />
              <input
                placeholder="URL de imagen"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
              />
              <input
                placeholder="Precio referencia"
                inputMode="decimal"
                value={priceReference}
                onChange={(e) => setPriceReference(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
              />
              <input
                placeholder="Categoria"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
              />
              <input
                placeholder="Posicion"
                inputMode="numeric"
                value={positionOrder}
                onChange={(e) => setPositionOrder(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
              />
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-slate-900 text-white rounded-lg py-2.5 font-medium hover:bg-slate-800 disabled:opacity-70"
              >
                {submitting ? "Guardando..." : "Crear regalo"}
              </button>
            </form>
          </article>

          <article className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Regalos</h2>
              <button
                onClick={loadData}
                className="text-sm border border-slate-300 rounded-lg px-3 py-1.5 hover:bg-slate-50"
              >
                Refrescar
              </button>
            </div>

            {loading ? (
              <p className="text-slate-600 mt-4">Cargando regalos...</p>
            ) : !hasGifts ? (
              <p className="text-slate-600 mt-4">No hay regalos registrados aun.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {gifts.map((gift) => (
                  <li
                    key={gift.id}
                    className="rounded-xl border border-slate-200 p-4 bg-slate-50"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-medium text-slate-900">{gift.name}</h3>
                        {gift.description ? (
                          <p className="text-sm text-slate-600 mt-1">{gift.description}</p>
                        ) : null}
                        <p className="text-sm text-slate-500 mt-2">
                          Categoria: {gift.category ?? "sin categoria"} | Orden: {gift.position_order}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {gift.price_reference ? (
                          <span className="text-sm font-semibold text-slate-700">
                            ${gift.price_reference}
                          </span>
                        ) : null}
                        <button
                          onClick={() => openEditModal(gift)}
                          className="text-sm border border-slate-300 rounded-lg px-3 py-1.5 hover:bg-slate-50"
                        >
                          Editar
                        </button>
                      </div>
                    </div>

                    {gift.is_reserved ? (
                      <div className="mt-3 flex flex-col gap-2 border-t border-slate-200 pt-3 sm:flex-row sm:items-center sm:justify-between">
                        <span className="inline-flex w-fit items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                          Reservado por {gift.reserved_by ?? "un invitado"}
                        </span>
                        <button
                          onClick={() => handleReleaseGift(gift.id)}
                          className="text-sm border border-slate-300 rounded-lg px-3 py-1.5 hover:bg-slate-50"
                        >
                          Liberar reserva
                        </button>
                      </div>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </article>
        </section>
      </div>

      {editingGift ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
          onClick={closeEditModal}
        >
          <div
            className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-5 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-slate-900">
              Editar regalo
            </h2>
            <form className="mt-4 space-y-3" onSubmit={handleUpdateGift}>
              <input
                placeholder="Nombre"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
              />
              <textarea
                placeholder="Descripcion"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 min-h-24"
              />
              <input
                placeholder="URL de imagen"
                value={editImageUrl}
                onChange={(e) => setEditImageUrl(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
              />
              <input
                placeholder="Precio referencia"
                inputMode="decimal"
                value={editPriceReference}
                onChange={(e) => setEditPriceReference(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
              />
              <input
                placeholder="Categoria"
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
              />
              <input
                placeholder="Posicion"
                inputMode="numeric"
                value={editPositionOrder}
                onChange={(e) => setEditPositionOrder(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
              />
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="flex-1 rounded-lg py-2.5 font-medium border border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 bg-slate-900 text-white rounded-lg py-2.5 font-medium hover:bg-slate-800 disabled:opacity-70"
                >
                  {updating ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </main>
  );
}
