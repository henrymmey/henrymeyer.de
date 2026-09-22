"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bold,
  Code,
  Eye,
  Heading1,
  Heading2,
  Italic,
  Link as LinkIcon,
  List,
  PencilLine,
  Quote,
  Strikethrough,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { adminApi } from "@/lib/admin/client";
import EventBody from "@/components/event-body";
import { Button } from "@/components/admin/ui";
import { useToast } from "@/components/admin/toast";

interface ToolbarAction {
  label: string;
  icon: typeof Bold;
  prefix: string;
  suffix: string;
  placeholder?: string;
}

const TOOLBAR: ToolbarAction[] = [
  {
    label: "Fett",
    icon: Bold,
    prefix: "**",
    suffix: "**",
    placeholder: "Fetter Text",
  },
  {
    label: "Kursiv",
    icon: Italic,
    prefix: "*",
    suffix: "*",
    placeholder: "Kursiver Text",
  },
  {
    label: "Durchgestrichen",
    icon: Strikethrough,
    prefix: "~~",
    suffix: "~~",
    placeholder: "Durchgestrichener Text",
  },
  {
    label: "Überschrift 1",
    icon: Heading1,
    prefix: "# ",
    suffix: "",
    placeholder: "Überschrift",
  },
  {
    label: "Überschrift 2",
    icon: Heading2,
    prefix: "## ",
    suffix: "",
    placeholder: "Überschrift",
  },
  {
    label: "Link",
    icon: LinkIcon,
    prefix: "[",
    suffix: "](https://)",
    placeholder: "Linktext",
  },
  {
    label: "Liste",
    icon: List,
    prefix: "- ",
    suffix: "",
    placeholder: "Listenpunkt",
  },
  {
    label: "Zitat",
    icon: Quote,
    prefix: "> ",
    suffix: "",
    placeholder: "Zitat",
  },
  {
    label: "Code",
    icon: Code,
    prefix: "```\n",
    suffix: "\n```",
    placeholder: "Code",
  },
];

export default function MarkdownEditor({
  slug,
  initialMarkdown,
  onSaved,
}: {
  slug: string;
  initialMarkdown: string | null;
  onSaved?: (markdown: string) => void;
}) {
  const [value, setValue] = useState(initialMarkdown ?? "");
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { error, success } = useToast();

  useEffect(() => {
    if (!dirty) return;
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  function insertAction(action: ToolbarAction) {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const { selectionStart: start, selectionEnd: end } = textarea;
    const selected = value.slice(start, end) || action.placeholder || "";
    const next =
      value.slice(0, start) +
      action.prefix +
      selected +
      action.suffix +
      value.slice(end);

    setValue(next);
    setDirty(true);

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + action.prefix.length,
        start + action.prefix.length + selected.length,
      );
    });
  }

  async function handleSave() {
    setSaving(true);
    try {
      await adminApi.putMarkdown(slug, value);
      setDirty(false);
      success("Gespeichert", "Das Markdown wurde auf GitHub committed.");
      onSaved?.(value);
    } catch (cause) {
      error(
        "Speichern fehlgeschlagen",
        cause instanceof Error ? cause.message : "Unbekannter Fehler.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex rounded-base border border-black/50 bg-surface-2 p-1">
          <button
            type="button"
            onClick={() => setPreview(false)}
            aria-pressed={!preview}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-[3px] px-3 py-1.5 text-xs transition-colors",
              !preview
                ? "bg-surface-3 text-foreground"
                : "text-muted hover:text-foreground",
            )}
          >
            <PencilLine className="size-3.5" aria-hidden="true" />
            Editor
          </button>
          <button
            type="button"
            onClick={() => setPreview(true)}
            aria-pressed={preview}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-[3px] px-3 py-1.5 text-xs transition-colors",
              preview
                ? "bg-surface-3 text-foreground"
                : "text-muted hover:text-foreground",
            )}
          >
            <Eye className="size-3.5" aria-hidden="true" />
            Preview
          </button>
        </div>

        <div className="flex items-center gap-2">
          {dirty && (
            <span className="text-xs text-muted">
              Ungespeicherte Änderungen
            </span>
          )}
          <Button
            variant="primary"
            loading={saving}
            disabled={!dirty}
            onClick={handleSave}
          >
            Speichern
          </Button>
        </div>
      </div>

      {preview ? (
        <div className="min-h-[24rem] rounded-block border border-black/60 bg-surface-3 p-6 shadow-card md:p-8">
          <EventBody body={value || null} />
        </div>
      ) : (
        <div className="overflow-hidden rounded-block border border-black/60 bg-surface-3 shadow-card">
          <div className="flex flex-wrap items-center gap-0.5 border-b border-black/40 bg-surface-2 p-1.5">
            {TOOLBAR.map((action) => (
              <button
                key={action.label}
                type="button"
                title={action.label}
                aria-label={action.label}
                onClick={() => insertAction(action)}
                className="rounded-base p-1.5 text-muted transition-colors hover:bg-surface-3 hover:text-foreground focus-visible:outline-2 focus-visible:outline-emerald"
              >
                <action.icon className="size-4" aria-hidden="true" />
              </button>
            ))}
          </div>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
              setDirty(true);
            }}
            spellCheck={false}
            aria-label="Markdown"
            className="min-h-[24rem] w-full resize-y bg-transparent px-5 py-4 font-mono text-sm leading-relaxed text-foreground placeholder:text-foreground/35 focus:outline-none"
            placeholder={"## Dein Event\n\nSchreibe hier den Inhalt ..."}
          />
          <div className="flex items-center justify-between border-t border-black/40 bg-surface-2 px-4 py-2 text-xs text-muted">
            <span>{value.length.toLocaleString("de-DE")} Zeichen</span>
            <span>GitHub Flavored Markdown</span>
          </div>
        </div>
      )}
    </div>
  );
}