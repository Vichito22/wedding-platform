"use client";

import { useState } from "react";
import { showToast } from "@/app/utils/toast";

export default function DBConnectionButton() {
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);

  const handleDBCheck = async () => {
    setLoading(true);
    setChecking(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      if (!apiUrl) {
        throw new Error("API URL not configured");
      }

      const response = await fetch(`${apiUrl}/db-health`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      showToast(
        `✓ DB connection successful: ${data.message}`,
        { type: "success", duration: 4000 }
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      showToast(
        `✗ DB connection failed: ${errorMessage}`,
        { type: "error", duration: 4000 }
      );
    } finally {
      setLoading(false);
      setTimeout(() => setChecking(false), 300);
    }
  };

  return (
    <button
      onClick={handleDBCheck}
      disabled={loading}
      className={`
        px-6 py-2 rounded-lg font-semibold text-white transition-all duration-200
        ${
          loading
            ? "bg-gray-400 cursor-not-allowed opacity-75"
            : "bg-emerald-600 hover:bg-emerald-700 active:scale-95"
        }
        ${checking ? "animate-pulse" : ""}
      `}
    >
      {loading ? "Testing DB connection..." : "Test DB Connection"}
    </button>
  );
}
