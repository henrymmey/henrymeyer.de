"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Loader2, Search } from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Button                                                             */
/* ------------------------------------------------------------------ */

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "outline";

const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    "border border-grass-deep/70 bg-grass text-night shadow-[0_3px_0_0_var(--hmt-grass-deep)] hover:brightness-110",
  secondary:
    "border border-black/50 bg-surface-3 text-foreground shadow-[0_3px_0_0_rgb(0_0_0/0.55)] hover:bg-surface-hover",
  danger:
    "border border-[#8e2a17] bg-redstone text-[#fff6f2] shadow-[0_3px_0_0_rgb(0_0_0/0.55)] hover:brightness-110",
  ghost:
    "border border-border bg-secondary-background/80 text-muted shadow-[0_2px_0_0_rgb(0_0_0/0.4)] hover:text-foreground",
  outline:
    "border border-black/50 bg-transparent text-foreground hover:bg-surface-3",
};

const buttonSizes = {
  sm: "px-3 py-1.5 text-[10px]",
  md: "px-4 py-2 text-xs",
  lg: "px-5 py-2.5 text-sm",
};

export function Button({
  variant = "secondary",
  size = "md",
  className,
  href,
  external,
  loading,
  disabled,
  children,
  ...props
}: {
  variant?: ButtonVariant;
  size?: keyof typeof buttonSizes;
  href?: string;
  external?: boolean;
  loading?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const classes = cn(
    "inline-flex select-none items-center justify-center gap-2 rounded-[2px] font-pixel uppercase tracking-[0.08em] transition-all duration-150 will-change-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald active:translate-y-px active:shadow-none disabled:pointer-events-none disabled:opacity-50",
    buttonVariants[variant],
    buttonSizes[size],
    className,
  );

  if (href) {
    const isExternal = external || href.startsWith("http");
    return (
      <Link
        href={href}
        className={classes}
        {...(isExternal ? { target: "_blank", rel: "noreferrer noopener" } : {})}
        aria-disabled={disabled}
      >
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} disabled={disabled || loading} {...props}>
      {loading && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Form primitives                                                    */
/* ------------------------------------------------------------------ */

const formFieldBase =
  "w-full rounded-base border border-black/40 bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground/35 transition-colors focus:border-emerald/60 focus:outline-none focus:ring-1 focus:ring-emerald/40 disabled:cursor-not-allowed disabled:opacity-60";

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(formFieldBase, className)} {...props} />;
}

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(formFieldBase, "min-h-24 resize-y leading-relaxed", className)}
      {...props}
    />
  );
}

export function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(formFieldBase, "appearance-none pr-8", className)} {...props}>
      {children}
    </select>
  );
}

export function Field({
  label,
  htmlFor,
  hint,
  error,
  required,
  className,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label
        htmlFor={htmlFor}
        className="text-xs font-medium uppercase tracking-[0.08em] text-muted"
      >
        {label}
        {required && (
          <span className="ml-0.5 text-redstone" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-redstone" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  description,
  disabled,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-base border border-black/40 bg-background px-3 py-2.5">
      <div className="min-w-0">
        <p className="text-sm text-foreground">{label}</p>
        {description && (
          <p className="mt-0.5 text-xs text-muted">{description}</p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald disabled:opacity-50",
          checked
            ? "border-grass-deep/70 bg-grass"
            : "border-black/50 bg-surface-2",
        )}
      >
        <span
          className={cn(
            "pointer-events-none absolute top-1/2 size-4 -translate-y-1/2 rounded-full bg-white shadow transition-[left] duration-150",
            checked ? "left-[calc(100%-1.25rem)]" : "left-0.5",
          )}
        />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Status pills / badges                                              */
/* ------------------------------------------------------------------ */

export type PillVariant =
  | "published"
  | "draft"
  | "upcoming"
  | "past"
  | "active"
  | "inactive"
  | "default"
  | "danger";

const pillStyles: Record<PillVariant, string> = {
  published: "border-grass-deep bg-grass/15 text-grass",
  draft: "border-black/50 bg-surface-2 text-muted",
  upcoming: "border-lapis-deep bg-lapis/15 text-lapis",
  past: "border-black/50 bg-surface-2 text-muted",
  active: "border-grass-deep bg-grass/15 text-grass",
  inactive: "border-[#8e2a17] bg-redstone/15 text-redstone",
  default: "border-black/50 bg-surface-3 text-foreground",
  danger: "border-[#8e2a17] bg-redstone/15 text-redstone",
};

export function Pill({
  variant = "default",
  className,
  children,
}: {
  variant?: PillVariant;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[2px] border px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.1em] md:text-[10px]",
        pillStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Loading / empty states                                             */
/* ------------------------------------------------------------------ */

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse rounded-base bg-surface-3", className)}
      aria-hidden="true"
    />
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <Loader2
      className={cn("animate-spin text-muted", className)}
      aria-hidden="true"
    />
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-block border border-dashed border-black/50 bg-surface-3/50 px-6 py-14 text-center">
      {icon && <div className="mb-4 text-muted">{icon}</div>}
      <p className="font-pixel text-sm uppercase tracking-wide text-foreground">
        {title}
      </p>
      {description && (
        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page primitives                                                    */
/* ------------------------------------------------------------------ */

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-pixel text-2xl uppercase leading-tight text-foreground md:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 text-sm leading-relaxed text-muted">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      )}
    </div>
  );
}

export function StatCard({
  label,
  value,
  icon,
  accent = "text-grass",
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  accent?: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-block border border-black/60 bg-surface-3 p-4 shadow-card">
      {icon && (
        <span
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-base border border-black/50 bg-surface-2",
            accent,
          )}
        >
          {icon}
        </span>
      )}
      <div className="min-w-0">
        <p className="truncate text-xs uppercase tracking-[0.1em] text-muted">
          {label}
        </p>
        <p className="mt-0.5 truncate text-2xl font-semibold text-main-foreground">
          {value}
        </p>
      </div>
    </div>
  );
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Suchen...",
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted"
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className={cn(formFieldBase, "pl-9")}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Modal & confirm dialog                                             */
/* ------------------------------------------------------------------ */

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    dialogRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  const sizes = {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-2xl",
  };

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <button
        type="button"
        aria-label="Schließen"
        onClick={onClose}
        className="absolute inset-0 bg-overlay backdrop-blur-[2px]"
      />
      <div
        ref={dialogRef}
        tabIndex={-1}
        className={cn(
          "relative max-h-[90vh] w-full overflow-y-auto rounded-block border border-black/60 bg-surface-3 shadow-lift animate-in fade-in zoom-in-95",
          sizes[size],
        )}
      >
        <div className="border-b border-black/40 px-5 py-4">
          <h2 className="font-pixel text-base uppercase tracking-[0.06em] text-foreground">
            {title}
          </h2>
          {description && (
            <p className="mt-1.5 text-sm leading-relaxed text-muted">
              {description}
            </p>
          )}
        </div>
        {children && <div className="px-5 py-4">{children}</div>}
        {footer && (
          <div className="flex flex-wrap justify-end gap-2 border-t border-black/40 px-5 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Löschen",
  confirmVariant = "danger",
  loading,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  confirmVariant?: ButtonVariant;
  loading?: boolean;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Abbrechen
          </Button>
          <Button
            variant={confirmVariant}
            loading={loading}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </>
      }
    />
  );
}