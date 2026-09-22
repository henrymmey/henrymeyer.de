"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { AlertTriangle, CheckCircle2, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastKind = "success" | "error" | "info";

export interface ToastInput {
  kind: ToastKind;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

interface ToastItem extends ToastInput {
  id: string;
}

interface ToastContextValue {
  push: (toast: ToastInput) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const AUTO_DISMISS: Record<ToastKind, number | null> = {
  success: 5000,
  info: 6000,
  error: 12000,
};

const KIND_ICONS: Record<ToastKind, typeof Info> = {
  success: CheckCircle2,
  error: AlertTriangle,
  info: Info,
};

const KIND_STYLES: Record<ToastKind, string> = {
  success: "text-emerald",
  error: "text-redstone",
  info: "text-lapis",
};

function ToastCard({
  toast,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: () => void;
}) {
  const Icon = KIND_ICONS[toast.kind];

  return (
    <div
      role="status"
      className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-block border border-black/60 bg-surface-3 p-4 shadow-lift animate-in slide-in-from-bottom-4 fade-in"
    >
      <Icon className={cn("mt-0.5 size-5 shrink-0", KIND_STYLES[toast.kind])} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-main-foreground">
          {toast.title}
        </p>
        {toast.description && (
          <p className="mt-1 text-sm leading-relaxed text-muted">
            {toast.description}
          </p>
        )}
        {toast.actionLabel && (
          <button
            type="button"
            onClick={() => {
              toast.onAction?.();
              onDismiss();
            }}
            className="mt-2 inline-flex items-center gap-1 rounded-base border border-black/50 bg-background px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:border-border hover:text-grass"
          >
            {toast.actionLabel}
          </button>
        )}
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Benachrichtigung schließen"
        className="shrink-0 rounded-base p-1 text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback(
    (toast: ToastInput) => {
      const id = String(++idRef.current);
      setToasts((current) => [...current, { ...toast, id }]);

      const ttl = AUTO_DISMISS[toast.kind];
      if (ttl) {
        window.setTimeout(() => dismiss(id), ttl);
      }
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={{ push, dismiss }}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col items-end gap-3 px-4 sm:px-0"
      >
        {toasts.map((toast) => (
          <ToastCard
            key={toast.id}
            toast={toast}
            onDismiss={() => dismiss(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): {
  push: (toast: ToastInput) => void;
  dismiss: (id: string) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
} {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return {
    push: context.push,
    dismiss: context.dismiss,
    success: (title, description) => context.push({ kind: "success", title, description }),
    error: (title, description) => context.push({ kind: "error", title, description }),
    info: (title, description) => context.push({ kind: "info", title, description }),
  };
}