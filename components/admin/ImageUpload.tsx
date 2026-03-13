import { useState, useRef, useCallback } from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import { supabase } from "@/lib/supabase";
import { Upload, X, Image as ImageIcon, Crop, Pencil } from "lucide-react";
import toast from "react-hot-toast";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  bucket: string;
  folder?: string;
  noCrop?: boolean;
}

/** Remove solid-color background from an image by sampling corners */
async function removeBackground(imageSrc: string): Promise<Blob> {
  const img = new window.Image();
  if (imageSrc.startsWith("http")) img.crossOrigin = "anonymous";
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("Image failed to load"));
    img.src = imageSrc;
  });

  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const { data, width, height } = imageData;

  // Sample corner pixels to detect background color
  const corners = [
    0,                            // top-left
    (width - 1) * 4,             // top-right
    (height - 1) * width * 4,   // bottom-left
    ((height - 1) * width + (width - 1)) * 4, // bottom-right
  ];
  let rSum = 0, gSum = 0, bSum = 0, count = 0;
  for (const idx of corners) {
    rSum += data[idx];
    gSum += data[idx + 1];
    bSum += data[idx + 2];
    count++;
  }
  const bgR = Math.round(rSum / count);
  const bgG = Math.round(gSum / count);
  const bgB = Math.round(bSum / count);

  // Tolerance for color matching (higher = more aggressive removal)
  const tolerance = 60;

  for (let i = 0; i < data.length; i += 4) {
    const dr = Math.abs(data[i] - bgR);
    const dg = Math.abs(data[i + 1] - bgG);
    const db = Math.abs(data[i + 2] - bgB);
    const dist = Math.sqrt(dr * dr + dg * dg + db * db);
    if (dist < tolerance) {
      data[i + 3] = 0; // set alpha to 0 (transparent)
    }
  }

  ctx.putImageData(imageData, 0, 0);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Canvas toBlob failed"));
    }, "image/png");
  });
}

async function getCroppedBlob(imageSrc: string, crop: Area): Promise<Blob> {
  const image = new window.Image();
  // Only set crossOrigin for remote URLs, not blob URLs
  if (imageSrc.startsWith("http")) {
    image.crossOrigin = "anonymous";
  }
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error("Image failed to load"));
    image.src = imageSrc;
  });

  const canvas = document.createElement("canvas");
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Canvas toBlob failed"));
    }, "image/png");
  });
}

export function ImageUpload({ value, onChange, bucket, folder, noCrop }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cropper state
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedArea(croppedAreaPixels);
  }, []);

  function openCropper(file: File) {
    const url = URL.createObjectURL(file);
    setCropSrc(url);
    setPendingFile(file);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedArea(null);
  }

  function closeCropper() {
    if (cropSrc && cropSrc.startsWith("blob:")) URL.revokeObjectURL(cropSrc);
    setCropSrc(null);
    setPendingFile(null);
    setCroppedArea(null);
  }

  async function handleCropConfirm() {
    if (!cropSrc || !croppedArea) {
      toast.error("No crop area selected");
      return;
    }
    try {
      const blob = await getCroppedBlob(cropSrc, croppedArea);
      if (!blob || blob.size === 0) {
        toast.error("Crop produced empty image");
        return;
      }
      const name = pendingFile?.name || `cropped-${Date.now()}.png`;
      const croppedFile = new File([blob], name, { type: "image/png" });
      closeCropper();
      await uploadFile(croppedFile);
    } catch (err) {
      console.error("Crop error:", err);
      toast.error("Failed to crop — uploading original instead");
      // Fallback: upload the original file if cropping failed
      if (pendingFile) {
        closeCropper();
        await uploadFile(pendingFile);
      }
    }
  }

  async function handleSkipCrop() {
    if (!pendingFile) return;
    closeCropper();
    await uploadFile(pendingFile);
  }

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

  function handleFileSelect(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    if (noCrop) {
      uploadFile(file);
    } else {
      openCropper(file);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
    if (inputRef.current) inputRef.current.value = "";
  }

  const [removingBg, setRemovingBg] = useState(false);

  async function handleRemoveBg() {
    if (!value) return;
    setRemovingBg(true);
    try {
      const blob = await removeBackground(value);
      const file = new File([blob], `nobg-${Date.now()}.png`, { type: "image/png" });
      await uploadFile(file);
      toast.success("Background removed");
    } catch (err) {
      console.error("BG removal error:", err);
      toast.error("Failed to remove background");
    } finally {
      setRemovingBg(false);
    }
  }

  function handleRemove() {
    onChange("");
  }

  function handleEditExisting() {
    if (!value) return;
    setCropSrc(value);
    setPendingFile(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedArea(null);
  }

  return (
    <div className="space-y-2">
      {/* Preview */}
      {value && (
        <div className="flex items-start gap-3">
          <div className="relative inline-block">
            <img
              src={value}
              alt="Preview"
              className="w-20 h-20 rounded-lg object-cover border border-border-subtle"
            />
            {!noCrop && (
              <button
                type="button"
                onClick={handleEditExisting}
                className="absolute -top-1.5 -right-7 w-5 h-5 rounded-full bg-brand-purple flex items-center justify-center text-white"
                title="Edit / Re-crop"
              >
                <Pencil size={10} />
              </button>
            )}
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-error flex items-center justify-center text-white"
            >
              <X size={10} />
            </button>
          </div>
          {noCrop && (
            <button
              type="button"
              onClick={handleRemoveBg}
              disabled={removingBg}
              className="px-3 py-1.5 text-xs font-medium bg-bg-elevated text-text-secondary rounded-lg hover:text-text-primary hover:bg-bg-card-hover transition-colors disabled:opacity-50"
            >
              {removingBg ? "Removing..." : "Remove BG"}
            </button>
          )}
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

      {/* Crop modal */}
      {cropSrc && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70" onClick={closeCropper} />
          <div className="relative w-full max-w-lg bg-bg-card border border-border-subtle rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle">
              <div className="flex items-center gap-2 text-sm font-semibold text-text-primary">
                <Crop size={16} />
                Crop Image
              </div>
              <button onClick={closeCropper} className="p-1 text-text-muted hover:text-text-primary">
                <X size={16} />
              </button>
            </div>

            <div className="relative w-full" style={{ height: 350 }}>
              <Cropper
                image={cropSrc}
                crop={crop}
                zoom={zoom}
                aspect={undefined}
                restrictPosition={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                style={{
                  containerStyle: { background: "#111" },
                }}
              />
            </div>

            <div className="px-4 py-3 border-t border-border-subtle">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs text-text-muted shrink-0">Zoom</span>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.05}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="flex-1 accent-brand-purple"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={pendingFile ? handleSkipCrop : closeCropper}
                  className="px-4 py-2 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
                >
                  {pendingFile ? "Skip Crop" : "Cancel"}
                </button>
                <button
                  onClick={handleCropConfirm}
                  className="px-4 py-2 text-xs font-semibold bg-brand-purple text-white rounded-lg hover:bg-brand-purple-light transition-colors"
                >
                  Crop & Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function extractStoragePath(publicUrl: string, bucket: string): string | null {
  const marker = `/storage/v1/object/public/${bucket}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return null;
  return publicUrl.slice(idx + marker.length);
}
