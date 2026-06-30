/**
 * community.js: data for the "Soul of Mauritius" community section.
 *
 * This is the single source of truth for the CommunitySection component. It
 * exists so the section can be regressed or upgraded purely from data, with no
 * component changes: add/remove a proverb or festival here and the UI follows.
 *
 * Three datasets:
 *   1. unityQuote: the Kreol centrepiece statement plus translation.
 *   2. mauritianProverbs: Kreol Morisien sayings with English meanings.
 *   3. mauritianFestivals: the year's major multi-faith celebrations.
 *
 * Notes for future edits:
 *   - Kreol Morisien orthography varies by source; these follow common usage.
 *     The site owner (Mauritian) can refine spellings without touching code.
 *   - Festivals use a MONTH/season, never a hard calendar date, because most
 *     are lunar and shift each year. This keeps the data from going stale.
 *   - `community` drives the colour accent (mapped to classes in the
 *     component). Allowed values: hindu | muslim | christian | sino | national.
 *   - No em-dashes anywhere in user-facing strings (house style).
 */

// The Kreol unity saying that anchors the section. "We are all in the same
// canoe" is one of the most recognised expressions of Mauritian togetherness.
export const unityQuote = {
  kreol: 'Nou tou dan mem pirog.',
  english: 'We are all in the same canoe.',
  note: 'The everyday Mauritian expression of one people across many origins.',
};

export const mauritianProverbs = [
  {
    id: 'lamain-done',
    kreol: 'Lamain ki done, limem ki gagne.',
    english: 'The hand that gives is the one that receives.',
    theme: 'Generosity',
  },
  {
    id: 'ti-lahash',
    kreol: 'Ti lahash koup gro pie.',
    english: 'A small axe fells a big tree.',
    theme: 'Perseverance',
  },
  {
    id: 'tigit-tigit',
    kreol: 'Tigit-tigit, zwazo fer so nik.',
    english: 'Little by little, the bird builds its nest.',
    theme: 'Patience',
  },
  {
    id: 'boner-larzan',
    kreol: 'Boner pa aste ar larzan.',
    english: 'Happiness cannot be bought with money.',
    theme: 'Values',
  },
  {
    id: 'zako-pie',
    kreol: 'Zako kone lor ki pie li grenpe.',
    english: 'The monkey knows which tree it climbs.',
    theme: 'Wisdom',
  },
  {
    id: 'sime-rekolte',
    kreol: 'Seki to simé, to pou rekolté.',
    english: 'What you sow, you will reap.',
    theme: 'Justice',
  },
];

export const mauritianFestivals = [
  {
    id: 'cavadee',
    name: 'Thaipoosam Cavadee',
    period: 'January / February',
    community: 'hindu',
    icon: '🪯',
    blurb: 'Tamil devotees carry the kavadi and pierce the skin in devotion to Lord Muruga.',
  },
  {
    id: 'spring-festival',
    name: 'Spring Festival',
    period: 'January / February',
    community: 'sino',
    icon: '🐉',
    blurb: 'Dragon dances and firecrackers welcome the lunar new year in Chinatown.',
  },
  {
    id: 'abolition',
    name: 'Abolition of Slavery',
    period: '1 February',
    community: 'national',
    icon: '⛓️',
    blurb: 'The nation remembers the enslaved and the maroons of Le Morne Brabant.',
  },
  {
    id: 'shivaratri',
    name: 'Maha Shivaratri',
    period: 'February / March',
    community: 'hindu',
    icon: '🕉️',
    blurb: 'Up to 500,000 pilgrims walk to Grand Bassin, the largest gathering outside India.',
  },
  {
    id: 'holi',
    name: 'Holi',
    period: 'March',
    community: 'hindu',
    icon: '🎨',
    blurb: 'The festival of colours paints streets and faces in shared joy.',
  },
  {
    id: 'independence',
    name: 'Independence & Republic Day',
    period: '12 March',
    community: 'national',
    icon: '🇲🇺',
    blurb: 'The four-band flag flies for the birth of the nation in 1968.',
  },
  {
    id: 'eid',
    name: 'Eid-ul-Fitr',
    period: 'Varies (end of Ramadan)',
    community: 'muslim',
    icon: '🌙',
    blurb: 'Families gather for prayer and feasting to mark the end of the fast.',
  },
  {
    id: 'pere-laval',
    name: 'Père Laval Pilgrimage',
    period: '9 September',
    community: 'christian',
    icon: '🕯️',
    blurb: 'People of every faith visit the shrine of the apostle of the Mauritian people.',
  },
  {
    id: 'divali',
    name: 'Divali',
    period: 'October / November',
    community: 'hindu',
    icon: '🪔',
    blurb: 'Rows of lamps light every home for the victory of light over darkness.',
  },
  {
    id: 'indentured-arrival',
    name: 'Arrival of Indentured Labourers',
    period: '2 November',
    community: 'national',
    icon: '⚓',
    blurb: 'Honouring the 450,000 who passed through the steps of the Aapravasi Ghat.',
  },
  {
    id: 'christmas',
    name: 'Christmas',
    period: '25 December',
    community: 'christian',
    icon: '🎄',
    blurb: 'A summer Christmas celebrated under the warm Mauritian sun.',
  },
];

// Approximate month (1-12) each festival falls in, used only to order them for
// the "next festival" notice. Lunar/Islamic dates shift each year, so these are
// deliberately approximate (close enough to pick what is coming up next).
const FESTIVAL_MONTH = {
  cavadee: 1,
  'spring-festival': 2,
  abolition: 2,
  shivaratri: 2,
  holi: 3,
  independence: 3,
  eid: 3,
  'pere-laval': 9,
  divali: 11,
  'indentured-arrival': 11,
  christmas: 12,
};

/**
 * Pick the next upcoming festival relative to `now` (a Date). Returns the
 * festival plus the calendar `year` it will next occur in. If every festival's
 * month has already passed this year, it wraps to the first one next year.
 */
export function getNextFestival(now) {
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const sorted = mauritianFestivals
    .map((f) => ({ ...f, monthIndex: FESTIVAL_MONTH[f.id] || 12 }))
    .sort((a, b) => a.monthIndex - b.monthIndex);
  const upcoming = sorted.find((f) => f.monthIndex >= month);
  return upcoming ? { ...upcoming, year } : { ...sorted[0], year: year + 1 };
}
