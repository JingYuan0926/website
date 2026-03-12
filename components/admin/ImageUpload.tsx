import { useState, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  bucket: string;
  folder?: string;
}

export function ImageUpload({ value, onChange, bucket, folder }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(
    async (file: File) => {
      if (!supabase) {
        toast.error("Supabase not configured");
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File must be under 5MB");
        return;
      }

      setUploading(true);
      try {
        const ext = file.name.split(".").pop() || "png";
        const fileName = `${folder ? folder + "/" : ""}${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

        // Delete old file if replacing
        if (value) {
          const oldPath = extractStoragePath(value, bucket);
          if (oldPath) {
            await supabase.storage.from(bucket).remove([oldPath]);
          }
        }

        const { error } = await supabase.storage.from(bucket).upload(fileName, file);
        if (error) {
          toast.error(error.message);
          return;
        }

        const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(fileName);
        onChange(urlData.publicUrl);
        toast.success("Image uploaded");
      } catch {
        toast.error("Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [bucket, folder, value, onChange]
  );

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleRemove() {
    onChange("");
  }

  return (
    <div className="space-y-2">
      {/* Preview */}
      {value && (
        <div className="relative inline-block">
          <img
            src={value}
            alt="Preview"
            className="w-20 h-20 rounded-lg object-cover border border-border-subtle"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-error flex items-center justify-center text-white"
          >
            <X size={10} />
          </button>
        </div>
      )}

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg border border-dashed cursor-pointer transition-colors ${
          dragOver
            ? "border-brand-purple bg-brand-purple/5"
            : "border-border-subtle hover:border-brand-purple/50"
        }`}
      >
        {uploading ? (
          <div className="w-5 h-5 border-2 border-brand-purple border-t-transparent rounded-full animate-spin" />
        ) : value ? (
          <ImageIcon size={16} className="text-brand-purple-light shrink-0" />
        ) : (
          <Upload size={16} className="text-text-muted shrink-0" />
        )}
        <span className="text-xs text-text-secondary">
          {uploading
            ? "Uploading..."
            : value
            ? "Click or drag to replace"
            : "Click or drag to upload"}
        </span>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Manual URL input */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Or paste image URL..."
        className="w-full px-3 py-2 text-xs bg-bg border border-border-subtle rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-purple/50"
      />
    </div>
  );
}

function extractStoragePath(publicUrl: string, bucket: string): string | null {
  const marker = `/storage/v1/object/public/${bucket}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return null;
  return publicUrl.slice(idx + marker.length);
}
