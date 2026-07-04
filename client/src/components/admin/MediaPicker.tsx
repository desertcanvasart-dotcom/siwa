import { useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Image as ImageIcon, Video, UploadCloud, X, Check, Search, Plus, ArrowLeft, ArrowRight } from "lucide-react";

/**
 * MediaPicker — a popup gallery of everything uploaded to the dashboard
 * (the uploadedImages library), plus an "Upload from device" button.
 *
 * - Click a tile → onSelect(url) with the media's public path.
 * - Upload a file → it's saved to the library, the grid refreshes, and
 *   the newly-uploaded file is auto-selected.
 * - Handles both images and videos (mimeType drives the preview).
 */

interface MediaItem {
  id: number;
  filename: string;
  originalName: string;
  path: string;
  mimeType: string;
  category?: string;
}

export function MediaPicker({
  open,
  onClose,
  onSelect,
  accept = "all",
  closeOnSelect = true,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  /** Restrict the grid + upload to one kind of media. */
  accept?: "all" | "image" | "video";
  /** When false, picking a tile keeps the library open so several
   *  images can be added in a row (used by the gallery field). */
  closeOnSelect?: boolean;
}) {
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const { data: items = [], isLoading } = useQuery<MediaItem[]>({
    queryKey: ["/api/admin/images", "picker"],
    queryFn: async () => {
      const res = await fetch("/api/admin/images", {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      });
      if (!res.ok) return [];
      const json = await res.json();
      return Array.isArray(json) ? json : [];
    },
    enabled: open,
    staleTime: 10_000,
  });

  const isVideo = (m: MediaItem) =>
    m.mimeType?.startsWith("video") || /\.(mp4|webm|mov)$/i.test(m.path);

  const filtered = items.filter((m) => {
    if (accept === "image" && isVideo(m)) return false;
    if (accept === "video" && !isVideo(m)) return false;
    if (query && !(`${m.originalName} ${m.filename}`.toLowerCase().includes(query.toLowerCase())))
      return false;
    return true;
  });

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadError(null);
    setUploading(true);
    try {
      const fd = new FormData();
      Array.from(files).forEach((f) => fd.append("images", f));
      fd.append("category", "library");
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
        body: fd,
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.message || "Upload failed");
      await queryClient.invalidateQueries({ queryKey: ["/api/admin/images"] });
      // Select newly-uploaded file(s). In multi-add (gallery) mode add
      // every uploaded file and keep the library open.
      const uploadedList: any[] = Array.isArray(json?.images) ? json.images : [];
      if (closeOnSelect) {
        const first = uploadedList[0];
        if (first?.path) {
          onSelect(first.path);
          onClose();
        }
      } else {
        uploadedList.forEach((u) => u?.path && onSelect(u.path));
      }
    } catch (err: any) {
      setUploadError(err?.message || "Could not upload that file.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  if (!open) return null;

  const acceptAttr =
    accept === "image" ? "image/*" : accept === "video" ? "video/*" : "image/*,video/*";

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center bg-navy-deep/70 backdrop-blur-sm px-4">
      <div className="bg-cream w-full max-w-3xl max-h-[88vh] flex flex-col border border-sand shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-sand bg-white">
          <div>
            <p className="text-[0.55rem] tracking-[0.3em] uppercase text-gold mb-0.5">Media library</p>
            <h3 className="font-display text-[1.2rem] text-navy">Select media</h3>
          </div>
          <button type="button" onClick={onClose} className="text-ink-soft hover:text-navy p-1" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-6 py-3 border-b border-sand-light bg-white flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-soft/50" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search filename…"
              className="w-full pl-8 pr-3 py-2 bg-cream/50 border border-sand text-[0.82rem] text-navy focus:border-gold outline-none"
            />
          </div>
          <div>
            <input
              ref={fileRef}
              type="file"
              accept={acceptAttr}
              multiple
              className="hidden"
              onChange={(e) => handleUpload(e.target.files)}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-2 bg-navy text-cream text-[0.6rem] tracking-[0.2em] uppercase px-4 py-2.5 hover:bg-navy-deep transition-colors disabled:opacity-50"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              {uploading ? "Uploading…" : "Upload from device"}
            </button>
          </div>
        </div>

        {uploadError && (
          <div className="px-6 py-2 bg-rose-50 border-b border-rose-200 text-[0.78rem] text-rose-700">
            {uploadError}
          </div>
        )}

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <p className="text-center text-[0.8rem] text-ink-soft/60 py-12">Loading…</p>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <ImageIcon className="w-8 h-8 mx-auto mb-3 text-ink-soft/30" />
              <p className="text-[0.82rem] text-ink-soft/65">
                {query ? "Nothing matches that search." : "No media uploaded yet — upload one above."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filtered.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => { onSelect(m.path); if (closeOnSelect) onClose(); }}
                  className="group relative aspect-square bg-white border border-sand hover:border-gold overflow-hidden transition-colors"
                  title={m.originalName}
                >
                  {isVideo(m) ? (
                    <>
                      <video src={m.path} className="w-full h-full object-cover" muted preload="metadata" />
                      <span className="absolute top-1.5 left-1.5 bg-navy-deep/70 text-cream rounded-full p-1">
                        <Video className="w-3 h-3" />
                      </span>
                    </>
                  ) : (
                    <img src={m.path} alt={m.originalName} loading="lazy" className="w-full h-full object-cover" />
                  )}
                  <span className="absolute inset-0 bg-navy-deep/0 group-hover:bg-navy-deep/30 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-gold text-navy rounded-full p-1.5">
                      <Check className="w-4 h-4" />
                    </span>
                  </span>
                  <span className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-navy-deep/80 to-transparent px-2 py-1.5 text-[0.6rem] text-cream/90 truncate text-left">
                    {m.originalName}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * MediaField — a labelled URL input with a "Select media" button + a
 * small live preview. Power users can still type/paste a URL; everyone
 * else just clicks to pick from the library or upload a new file.
 */
export function MediaField({
  value,
  onChange,
  accept = "all",
  placeholder,
}: {
  value: string;
  onChange: (url: string) => void;
  accept?: "all" | "image" | "video";
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const looksVideo = /\.(mp4|webm|mov)$/i.test(value || "");

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || "Pick from library, or paste a URL"}
          className="flex-1 px-3 py-2 bg-white border border-sand text-[0.84rem] text-navy font-body focus:border-gold outline-none"
        />
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1.5 bg-gold text-navy text-[0.58rem] tracking-[0.18em] uppercase px-3 hover:bg-gold-light transition-colors whitespace-nowrap"
        >
          <ImageIcon className="w-3.5 h-3.5" />
          Select
        </button>
      </div>

      {value && (
        <div className="border border-sand-light bg-white p-1.5 inline-block">
          {looksVideo ? (
            <video src={value} className="h-20 w-auto object-cover" muted preload="metadata" />
          ) : (
            <img src={value} alt="preview" className="h-20 w-auto object-cover" />
          )}
        </div>
      )}

      <MediaPicker open={open} onClose={() => setOpen(false)} onSelect={onChange} accept={accept} />
    </div>
  );
}

/**
 * MediaGalleryField — manage an ordered list of images for a hotel/tour
 * gallery. Add from the library or upload new ones (several in a row),
 * remove, and reorder. Values are public media paths.
 */
export function MediaGalleryField({
  value,
  onChange,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
}) {
  const [open, setOpen] = useState(false);

  const add = (url: string) => {
    if (!url) return;
    // Ignore duplicates so the same photo can't be added twice.
    if (value.includes(url)) return;
    onChange([...value, url]);
  };
  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {value.length === 0 ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-full border border-dashed border-sand-light hover:border-gold hover:text-navy text-ink-soft/70 transition-colors py-8 flex flex-col items-center gap-2"
        >
          <ImageIcon className="w-6 h-6 opacity-50" />
          <span className="text-[0.6rem] tracking-[0.18em] uppercase">Add gallery photos</span>
        </button>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {value.map((url, i) => (
              <div
                key={url}
                className="group relative aspect-square bg-white border border-sand overflow-hidden"
              >
                <img src={url} alt={`Gallery ${i + 1}`} loading="lazy" className="w-full h-full object-cover" />
                {/* Order badge */}
                <span className="absolute top-1 left-1 bg-navy-deep/70 text-cream text-[0.55rem] font-body px-1.5 py-0.5">
                  {i + 1}
                </span>
                {/* Controls */}
                <div className="absolute inset-0 bg-navy-deep/0 group-hover:bg-navy-deep/45 transition-colors flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    className="bg-white/90 text-navy p-1 hover:bg-gold disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Move left"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    className="bg-white/90 text-rose-600 p-1 hover:bg-rose-500 hover:text-white"
                    aria-label="Remove"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    disabled={i === value.length - 1}
                    className="bg-white/90 text-navy p-1 hover:bg-gold disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Move right"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
            {/* Add tile */}
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="aspect-square border border-dashed border-sand-light hover:border-gold hover:text-navy text-ink-soft/60 transition-colors flex flex-col items-center justify-center gap-1.5"
            >
              <Plus className="w-5 h-5" />
              <span className="text-[0.55rem] tracking-[0.18em] uppercase">Add</span>
            </button>
          </div>
          <p className="text-[0.65rem] text-ink-soft/55 leading-[1.5]">
            {value.length} photo{value.length === 1 ? "" : "s"} · hover a photo to reorder or remove. The first photo shows first in the lightbox.
          </p>
        </>
      )}

      {/* Multi-add: picking a tile keeps the library open so several
          photos can be added in a row. Close with the X when done. */}
      <MediaPicker
        open={open}
        onClose={() => setOpen(false)}
        onSelect={add}
        accept="image"
        closeOnSelect={false}
      />
    </div>
  );
}

export default MediaPicker;
