import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { ImageUpload } from "./ImageUpload";
import { Markdown } from "@/components/shared/Markdown";

export interface FieldDef {
  key: string;
  label: string;
  type: "text" | "textarea" | "number" | "date" | "select" | "toggle" | "tags" | "checkboxes" | "image" | "markdown";
  placeholder?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
  bucket?: string;
  folder?: string;
}

interface FormModalProps {
  title: string;
  fields: FieldDef[];
  initialData?: Record<string, unknown>;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
}

export function FormModal({
  title,
  fields,
  initialData,
  isOpen,
  onClose,
  onSubmit,
}: FormModalProps) {
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      const defaults: Record<string, unknown> = {};
      fields.forEach((f) => {
        if (f.type === "toggle") defaults[f.key] = false;
        else if (f.type === "number") defaults[f.key] = 0;
        else if (f.type === "tags" || f.type === "checkboxes") defaults[f.key] = [];
        else if (f.type === "select" && f.options?.length) defaults[f.key] = f.options[0].value;
        else defaults[f.key] = "";
      });
      setFormData(defaults);
    }
  }, [initialData, isOpen, fields]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } finally {
      setLoading(false);
    }
  }

  function updateField(key: string, value: unknown) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  function addTag(key: string) {
    const trimmed = tagInput.trim();
    if (!trimmed) return;
    const current = (formData[key] as string[]) || [];
    if (!current.includes(trimmed)) {
      updateField(key, [...current, trimmed]);
    }
    setTagInput("");
  }

  function removeTag(key: string, tag: string) {
    const current = (formData[key] as string[]) || [];
    updateField(key, current.filter((t) => t !== tag));
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />
      <div className={`relative w-full max-h-[85vh] overflow-y-auto bg-bg-card border border-border-subtle rounded-xl ${fields.some(f => f.type === 'markdown') ? 'max-w-3xl' : 'max-w-lg'}`}>
        {/* Header */}
        <div className="sticky top-0 bg-bg-card flex items-center justify-between px-6 py-4 border-b border-border-subtle">
          <h2 className="text-base font-semibold text-text-primary">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 text-text-muted hover:text-text-primary"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {fields.map((field) => (
            <div key={field.key}>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">
                {field.label}
                {field.required && <span className="text-error ml-0.5">*</span>}
              </label>

              {field.type === "text" && (
                <input
                  type="text"
                  value={String(formData[field.key] || "")}
                  onChange={(e) => updateField(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  required={field.required}
                  className="w-full px-3 py-2 text-sm bg-bg border border-border-subtle rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-purple/50"
                />
              )}

              {field.type === "textarea" && (
                <textarea
                  value={String(formData[field.key] || "")}
                  onChange={(e) => updateField(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  required={field.required}
                  rows={3}
                  className="w-full px-3 py-2 text-sm bg-bg border border-border-subtle rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-purple/50 resize-y"
                />
              )}

              {field.type === "number" && (
                <input
                  type="number"
                  value={Number(formData[field.key] || 0)}
                  onChange={(e) => updateField(field.key, Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-bg border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:border-brand-purple/50"
                />
              )}

              {field.type === "date" && (
                <input
                  type="datetime-local"
                  value={
                    formData[field.key]
                      ? new Date(String(formData[field.key])).toISOString().slice(0, 16)
                      : ""
                  }
                  onChange={(e) => updateField(field.key, new Date(e.target.value).toISOString())}
                  required={field.required}
                  className="w-full px-3 py-2 text-sm bg-bg border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:border-brand-purple/50"
                />
              )}

              {field.type === "select" && (
                <select
                  value={String(formData[field.key] || "")}
                  onChange={(e) => updateField(field.key, e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-bg border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:border-brand-purple/50"
                >
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              )}

              {field.type === "toggle" && (
                <button
                  type="button"
                  onClick={() => updateField(field.key, !formData[field.key])}
                  className={`w-10 h-5 rounded-full relative transition-colors ${
                    formData[field.key] ? "bg-brand-purple" : "bg-bg-elevated"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                      formData[field.key] ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              )}

              {field.type === "tags" && (
                <div>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTag(field.key);
                        }
                      }}
                      placeholder="Type and press Enter"
                      className="flex-1 px-3 py-2 text-sm bg-bg border border-border-subtle rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-purple/50"
                    />
                    <button
                      type="button"
                      onClick={() => addTag(field.key)}
                      className="px-3 py-2 text-xs font-medium bg-bg-card-hover text-text-secondary rounded-lg hover:bg-bg-elevated"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {((formData[field.key] as string[]) || []).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-brand-purple/10 text-brand-purple-light rounded-md"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(field.key, tag)}
                          className="hover:text-error"
                        >
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {field.type === "checkboxes" && field.options && (
                <div className="flex flex-wrap gap-2">
                  {field.options.map((opt) => {
                    const selected = ((formData[field.key] as string[]) || []).includes(opt.value);
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          const current = (formData[field.key] as string[]) || [];
                          if (selected) {
                            updateField(field.key, current.filter((v) => v !== opt.value));
                          } else {
                            updateField(field.key, [...current, opt.value]);
                          }
                        }}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                          selected
                            ? "bg-brand-purple/15 border-brand-purple/40 text-brand-purple-light"
                            : "bg-bg border-border-subtle text-text-muted hover:text-text-secondary hover:border-border-default"
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              )}

              {field.type === "image" && (
                <ImageUpload
                  value={String(formData[field.key] || "")}
                  onChange={(url) => updateField(field.key, url)}
                  bucket={field.bucket || "general"}
                  folder={field.folder}
                />
              )}

              {field.type === "markdown" && (
                <div className="grid grid-cols-2 gap-3">
                  <textarea
                    value={String(formData[field.key] || "")}
                    onChange={(e) => updateField(field.key, e.target.value)}
                    placeholder={field.placeholder || "Write markdown..."}
                    required={field.required}
                    rows={6}
                    className="w-full px-3 py-2 text-sm bg-bg border border-border-subtle rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-purple/50 resize-y font-mono"
                  />
                  <div className="px-3 py-2 text-sm bg-bg border border-border-subtle rounded-lg overflow-y-auto text-text-secondary leading-relaxed">
                    {formData[field.key] ? (
                      <Markdown content={String(formData[field.key])} />
                    ) : (
                      <span className="text-text-muted text-xs">Preview</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-semibold bg-brand-purple text-white rounded-lg hover:bg-brand-purple-light disabled:opacity-50 transition-colors"
            >
              {loading ? "Saving..." : initialData ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
