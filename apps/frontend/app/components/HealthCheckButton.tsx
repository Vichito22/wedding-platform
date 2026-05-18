"use client";

import { useState } from "react";
import { showToast } from "@/app/utils/toast";

export default function HealthCheckButton() {
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);

  const handleHealthCheck = async () => {
    setLoading(true);
    setChecking(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      if (!apiUrl) {
        throw new Error("API URL not configured");
      }

      const response = await fetch(`${apiUrl}/health`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      showToast(
        `✓ Connection successful: ${data.message}`,
        { type: "success", duration: 4000 }
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      showToast(
        `✗ Connection failed: ${errorMessage}`,
        { type: "error", duration: 4000 }
      );
    } finally {
      setLoading(false);
      setTimeout(() => setChecking(false), 300);
    }
  };

  return (
    <button
      onClick={handleHealthCheck}
      disabled={loading}
      className={`
        px-6 py-2 rounded-lg font-semibold text-white transition-all duration-200
        ${
          loading
            ? "bg-gray-400 cursor-not-allowed opacity-75"
            : "bg-blue-600 hover:bg-blue-700 active:scale-95"
        }
        ${checking ? "animate-pulse" : ""}
      `}
    >
      {loading ? "Testing connection..." : "Test Connection"}
    </button>
  );
}
