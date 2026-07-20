/**
 * Lightbox — visualização ampliada de imagens.
 * Clique na imagem para abrir em tela cheia; fecha com X, ESC ou clique fora.
 * Respeita prefers-reduced-motion (transições apenas de opacity/transform).
 */
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, ZoomIn } from "lucide-react";

interface LightboxImageProps {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
}

export function LightboxImage({ src, alt, caption, className }: LightboxImageProps) {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative block w-full cursor-zoom-in rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#38bdf8]"
        aria-label={`Ampliar imagem: ${alt}`}
      >
        <img src={src} alt={alt} className={className ?? "w-full rounded-lg"} />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-lg bg-black/0 opacity-0 transition-opacity duration-200 group-hover:bg-black/30 group-hover:opacity-100"
        >
          <span className="flex items-center gap-2 rounded-full border border-white/30 bg-black/60 px-4 py-2 text-xs font-semibold text-white shadow-lg">
            <ZoomIn className="h-4 w-4" />
            Ampliar
          </span>
        </span>
      </button>

      {open &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={alt}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
            onClick={close}
            style={{ animation: "lightbox-fade 180ms cubic-bezier(0.23, 1, 0.32, 1)" }}
          >
            <button
              type="button"
              onClick={close}
              aria-label="Fechar imagem ampliada"
              className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20 active:scale-95"
            >
              <X className="h-5 w-5" />
            </button>
            <figure
              className="flex max-h-full max-w-5xl flex-col items-center"
              onClick={e => e.stopPropagation()}
            >
              <img
                src={src}
                alt={alt}
                className="max-h-[85vh] w-auto max-w-full rounded-lg object-contain shadow-2xl"
                style={{ animation: "lightbox-zoom 200ms cubic-bezier(0.23, 1, 0.32, 1)" }}
              />
              {caption && (
                <figcaption className="mt-3 max-w-2xl text-center text-sm text-white/80">
                  {caption}
                </figcaption>
              )}
            </figure>
          </div>,
          document.body,
        )}
    </>
  );
}
