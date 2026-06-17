import React, { useState, useEffect, useCallback, useRef } from "react";
import { Twitter, Facebook, Linkedin, Link as LinkIcon, Check, X } from "lucide-react";

/**
 * WhatsApp brand glyph. Lucide ships no WhatsApp icon, so we inline the
 * official mark. WhatsApp is the dominant sharing channel across the
 * Mauritian diaspora, so it earns a dedicated, recognisable button.
 */
const WhatsAppIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-1.207zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
  </svg>
);

/**
 * ShareDialog: a milestone-aware share sheet.
 *
 * Each of the five targets has a distinct job:
 *   X / Twitter: public reach and virality
 *   Facebook:    community and diaspora groups
 *   WhatsApp:    direct person-to-person (huge in Mauritius)
 *   LinkedIn:    educational and professional audiences
 *   Copy link:   paste anywhere (Instagram bio, email, SMS)
 *
 * The pre-filled message is written to inspire a click from whoever
 * receives it, so the share has a purpose rather than a bare URL. The text
 * is milestone-specific and deliberately contains no em-dashes.
 */
export default function ShareDialog({ milestone, onClose }) {
  const [copied, setCopied] = useState(false);
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const previousFocusRef = useRef(null);
  // onClose is often an inline arrow from the parent (new identity every
  // render). Reading it through a ref keeps the effect below dependent on
  // `open` ONLY, so it does not re-run every render. That re-running was what
  // caused an infinite focus-restore -> card.onFocus -> setState loop
  // ("Maximum update depth exceeded").
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const open = !!milestone;

  // Close on Escape, trap Tab focus inside the dialog while it is open, and
  // restore focus to whatever opened it on close (true modal behaviour).
  useEffect(() => {
    if (!open) return undefined;
    previousFocusRef.current = document.activeElement;
    const onKey = (e) => {
      if (e.key === "Escape") {
        onCloseRef.current?.();
        return;
      }
      if (e.key === "Tab") {
        const focusables = dialogRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      const prev = previousFocusRef.current;
      if (prev && typeof prev.focus === "function") prev.focus();
    };
  }, [open]);

  const share = useCallback(
    (platform) => {
      if (!milestone) return;
      const year = milestone.date.split("-")[0];
      const url = "https://dodolegacy.com/#history-stack";
      // Inspiring, click-worthy copy. No em-dashes by design.
      const message = `${milestone.title} (${year}) is one of the moments that shaped Mauritius. Discover the island's incredible history and vibrant culture at Dodo Legacy:`;
      const enc = encodeURIComponent;

      let target;
      switch (platform) {
        case "twitter":
          target = `https://twitter.com/intent/tweet?text=${enc(message)}&url=${enc(url)}`;
          break;
        case "facebook":
          target = `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}&quote=${enc(message)}`;
          break;
        case "whatsapp":
          target = `https://wa.me/?text=${enc(message + " " + url)}`;
          break;
        case "linkedin":
          target = `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`;
          break;
        case "copy":
          navigator.clipboard
            ?.writeText(`${message} ${url}`)
            .then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 2200);
            })
            .catch(() => {});
          return;
        default:
          return;
      }
      window.open(target, "_blank", "noopener,noreferrer");
    },
    [milestone],
  );

  if (!open) return null;

  const year = milestone.date.split("-")[0];

  const targets = [
    { key: "twitter", label: "X", Icon: Twitter, ring: "hover:border-sky-400/70 hover:text-sky-300" },
    { key: "facebook", label: "Facebook", Icon: Facebook, ring: "hover:border-blue-500/70 hover:text-blue-400" },
    { key: "whatsapp", label: "WhatsApp", Icon: WhatsAppIcon, ring: "hover:border-green-500/70 hover:text-green-400" },
    { key: "linkedin", label: "LinkedIn", Icon: Linkedin, ring: "hover:border-sky-600/70 hover:text-sky-400" },
    {
      key: "copy",
      label: copied ? "Copied!" : "Copy link",
      Icon: copied ? Check : LinkIcon,
      ring: copied
        ? "border-green-500/70 text-green-400"
        : "hover:border-white/60 hover:text-white",
    },
  ];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label={`Share ${milestone.title}`}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Sheet */}
      <div
        ref={dialogRef}
        className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0c0710] p-6 md:p-8 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close share dialog"
          className="absolute top-3 right-3 h-11 w-11 flex items-center justify-center rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <p className="text-xs uppercase tracking-[0.35em] text-zinc-500 mb-1">
          Share this moment
        </p>
        <h3 className="text-2xl font-serif italic text-white leading-tight pr-8">
          {milestone.title}
        </h3>
        <p className="text-sm text-zinc-500 mt-1 mb-5">{year}</p>

        {/* Message preview: what the recipient will see. */}
        <div className="rounded-xl bg-white/5 border border-white/10 p-4 mb-6">
          <p className="text-sm text-zinc-300 leading-relaxed">
            “{milestone.title} ({year}) is one of the moments that shaped
            Mauritius. Discover the island's incredible history and vibrant
            culture at Dodo Legacy.”
          </p>
        </div>

        {/* Five purposeful targets. */}
        <div className="grid grid-cols-5 gap-2 md:gap-3">
          {targets.map(({ key, label, Icon, ring }) => (
            <button
              key={key}
              type="button"
              onClick={() => share(key)}
              aria-label={`Share on ${label}`}
              className={`group flex flex-col items-center gap-2 rounded-xl py-3 text-zinc-400 transition-colors ${ring}`}
            >
              <span className="h-12 w-12 flex items-center justify-center rounded-full border border-white/15 transition-colors">
                <Icon className="w-5 h-5" />
              </span>
              <span className="text-[10px] md:text-xs font-medium tracking-wide text-zinc-400 group-hover:text-current">
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
