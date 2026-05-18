interface ToastOptions {
  duration?: number;
  type?: "success" | "error" | "info";
}

export function showToast(message: string, options: ToastOptions = {}) {
  const { duration = 3000, type = "info" } = options;

  // Create toast container if it doesn't exist
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
    `;
    document.body.appendChild(container);
  }

  // Create toast element
  const toast = document.createElement("div");
  const bgColor =
    type === "success"
      ? "#10b981"
      : type === "error"
        ? "#ef4444"
        : "#3b82f6";

  toast.style.cssText = `
    background-color: ${bgColor};
    color: white;
    padding: 12px 16px;
    border-radius: 6px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    font-size: 14px;
    font-weight: 500;
    animation: slideIn 0.3s ease-out;
    min-width: 250px;
  `;

  toast.textContent = message;

  // Add animation styles if not already in document
  if (!document.getElementById("toast-styles")) {
    const style = document.createElement("style");
    style.id = "toast-styles";
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(400px);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  container.appendChild(toast);

  // Remove toast after duration
  setTimeout(() => {
    toast.style.animation = "slideOut 0.3s ease-out forwards";
    setTimeout(() => {
      toast.remove();
      // Remove container if empty
      if (container && container.children.length === 0) {
        container.remove();
      }
    }, 300);
  }, duration);
}
