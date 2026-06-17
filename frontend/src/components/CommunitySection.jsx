import { memo } from 'react';
import { Badge } from '@/components/ui/badge';
import GalleryComments from '@/components/GalleryComments';
import {
  unityQuote,
  mauritianProverbs,
  mauritianFestivals,
} from '@/data/community';

/**
 * CommunitySection: "The Soul of Mauritius".
 *
 * Purpose: this is the section that speaks directly TO Mauritians, not about
 * them. It does three things the rest of the site does not:
 *   1. Leads in Kreol Morisien, the language Mauritians actually live in.
 *   2. Surfaces Mauritian proverbs (the everyday wisdom of the island).
 *   3. Shows the living, multi-faith festival calendar that defines the year.
 *
 * Design intent (so this can be regressed/upgraded with confidence):
 *   - Entirely data-driven from src/data/community.js. The component renders
 *     whatever the data contains; it holds no content of its own.
 *   - No timers, no JS animation, no external state. All motion is CSS hover
 *     only, so there is nothing to leak, race, or break on re-render.
 *   - Mobile-first responsive grids (1 col -> 2 -> 3) with >=44px tap areas.
 *   - Matches the lighter section rhythm of CultureSection / VoicesSection
 *     (gradient background + .section-title) so the page flows top to bottom.
 *
 * The `COMMUNITY_TONES` map turns a festival's `community` field into a colour
 * accent. It lives here (not in the data) so designers can retheme without
 * editing content. Keys must match the `community` values in the data file.
 */
const COMMUNITY_TONES = {
  hindu: {
    label: 'Hindu',
    ring: 'hover:border-orange-400/60',
    chip: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
  },
  muslim: {
    label: 'Muslim',
    ring: 'hover:border-green-400/60',
    chip: 'bg-green-500/15 text-green-300 border-green-500/30',
  },
  christian: {
    label: 'Christian',
    ring: 'hover:border-sky-400/60',
    chip: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
  },
  sino: {
    label: 'Sino-Mauritian',
    ring: 'hover:border-red-400/60',
    chip: 'bg-red-500/15 text-red-300 border-red-500/30',
  },
  national: {
    label: 'National',
    ring: 'hover:border-yellow-400/60',
    chip: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
  },
};

const FALLBACK_TONE = COMMUNITY_TONES.national;

// A stable id so every community-wall submission lands in the same bucket of
// the existing moderated comment system (admin dashboard at /admin/comments).
const GUESTBOOK_ID = 'community-guestbook';

function CommunitySection() {
  return (
    <section
      id="community"
      aria-label="The soul of Mauritius: language, proverbs and festivals"
      className="relative py-24 bg-gradient-to-b from-background to-muted/20"
    >
      {/* Atmospheric backdrop: a "rainbow nation" aurora in the four flag
          colours. Kept very faint so it sits behind the text. Purpose: make the
          pluralism theme felt, not just stated. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 bg-cover bg-center opacity-[0.18] pointer-events-none"
        style={{
          backgroundImage:
            "url('/assets/images/backgrounds/community-aurora.webp')",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 px-4 py-1.5 bg-primary/15 text-red-200 border-primary/30 hover:bg-primary/25 hover:text-white">
            Nou Lidantite / Our Identity
          </Badge>
          <h2 className="section-title mb-4">
            The Soul of <span className="text-primary">Mauritius</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Beyond the beaches lies a living culture: one people shaped by Africa,
            India, China, and Europe, speaking a language born on this island and
            sharing every faith's festivals as a single nation.
          </p>
        </div>

        {/* Kreol unity centrepiece */}
        <figure className="relative max-w-3xl mx-auto mb-20 text-center rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card/30 to-secondary/10 px-6 py-12 md:px-12 md:py-14">
          <blockquote className="font-serif italic text-3xl md:text-5xl text-white leading-tight">
            “{unityQuote.kreol}”
          </blockquote>
          <figcaption className="mt-4 text-base md:text-lg text-muted-foreground">
            {unityQuote.english}
          </figcaption>
          <p className="mt-2 text-xs uppercase tracking-[0.25em] text-muted-foreground/70">
            {unityQuote.note}
          </p>
        </figure>

        {/* Proverbs (Sazes Kreol) */}
        <div className="mb-20">
          <div className="text-center mb-8">
            <h3
              className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-white"
              style={{ fontFamily: 'Bebas Neue, sans-serif' }}
            >
              Sazes Kreol / Kreol Wisdom
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              The everyday proverbs that carry the island's wit and resilience
            </p>
          </div>

          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {mauritianProverbs.map((p) => (
              <li
                key={p.id}
                className="group rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm p-6 transition-all duration-300 hover:bg-white hover:border-white hover:-translate-y-1 hover:shadow-lg hover:shadow-black/20"
              >
                <span className="inline-block text-[10px] uppercase tracking-[0.25em] text-red-300 group-hover:text-red-600 mb-3">
                  {p.theme}
                </span>
                <p className="font-serif italic text-xl text-white group-hover:text-zinc-900 leading-snug mb-3">
                  “{p.kreol}”
                </p>
                <p className="text-sm text-muted-foreground group-hover:text-zinc-700 leading-relaxed">
                  {p.english}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Living festival calendar (Nou Fet) */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h3
              className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-white"
              style={{ fontFamily: 'Bebas Neue, sans-serif' }}
            >
              Nou Fet / The Year in Festivals
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              Every community's celebration is a public holiday for all. This is
              what pluralism looks like across one Mauritian year.
            </p>
          </div>

          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {mauritianFestivals.map((f) => {
              const tone = COMMUNITY_TONES[f.community] || FALLBACK_TONE;
              return (
                <li
                  key={f.id}
                  className="group rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm p-5 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:border-white"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="text-3xl leading-none" aria-hidden="true">
                      {f.icon}
                    </span>
                    <span
                      className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border ${tone.chip} group-hover:bg-zinc-200 group-hover:text-zinc-800 group-hover:border-zinc-300`}
                    >
                      {tone.label}
                    </span>
                  </div>
                  <h4 className="text-lg font-semibold text-white group-hover:text-zinc-900">{f.name}</h4>
                  <p className="text-xs text-red-300 group-hover:text-red-600 mb-2">{f.period}</p>
                  <p className="text-sm text-muted-foreground group-hover:text-zinc-700 leading-relaxed">
                    {f.blurb}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Community guestbook: real visitor submissions, held for moderation
            in the admin dashboard before they appear. Reuses the existing
            gallery comment pipeline under a stable guestbook id. */}
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <h3
              className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-white"
              style={{ fontFamily: 'Bebas Neue, sans-serif' }}
            >
              Liv Dor / Community Guestbook
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              This is your island's story. Add your voice. Every message is
              reviewed before it appears.
            </p>
          </div>
          <div className="rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm p-6 md:p-8">
            <GalleryComments imageId={GUESTBOOK_ID} isOpen={true} />
          </div>
        </div>
      </div>
    </section>
  );
}

// Memoized: the section is pure (no props, no state), so it never needs to
// re-render once mounted.
export default memo(CommunitySection);
