export interface HistoryMilestone {
  id: number;
  title: string;
  date: string;
  description: string;
  riveInput: string;
  /**
   * Public path or URL to the milestone's hero image. Local images are
   * served from `frontend/public/assets/images/history/`. ID 1 uses an
   * Unsplash CDN URL (volcanic landscape) because the shipped local
   * placeholder is only 10 KB and renders blurry at tooltip resolution.
   * The remaining 9 cards point to local Wikimedia-sourced files.
   * onError fallback in the component hides any broken images cleanly.
   */
  image: string;
}

export const historyMilestones: HistoryMilestone[] = [
  {
    id: 1,
    title: "The Mascarene Forge",
    date: "8-10M Years Ago",
    description: "Born from the Réunion Hotspot, Mauritius emerged as a volcanic island on the Mascarene Plateau. It remained a biological sanctuary for millions of years, isolated from the world.",
    riveInput: "Hover 1",
    image: "https://images.unsplash.com/photo-1462332420958-a05d1e002413?w=800&q=80"
  },
  {
    id: 2,
    title: "Dina Arobi & Cirne",
    date: "1502-1507",
    description: "First mapped by Arab sailors as 'Dina Arobi', it was later sighted by Portuguese captain Diogo Fernandes Pereira. They used the island for fresh water but never established a permanent presence.",
    riveInput: "Hover 2",
    image: "/assets/images/history/2-dina-arobi.jpg"
  },
  {
    id: 3,
    title: "The Nassau Claim",
    date: "1598",
    description: "Admiral Wybrand Van Warwyck claimed the island for the Dutch, naming it after Prince Maurice of Nassau. This era introduced sugarcane and the Java deer to the landscape.",
    riveInput: "Hover 3",
    image: "/assets/images/history/3-nassau-claim.jpg"
  },
  {
    id: 4,
    title: "The Silent Extinction",
    date: "1662",
    description: "Following the Dutch arrival, the Dodo (Raphus cucullatus) vanished. The last eyewitness account was recorded by shipwrecked sailor Volquard Iversen in 1662.",
    riveInput: "Hover 4",
    image: "/assets/images/gettyimages-143069965-1024x1024.jpg"
  },
  {
    id: 5,
    title: "The Star & Key Era",
    date: "1735",
    description: "Governor Mahé de Labourdonnais transformed 'Isle de France' into a naval hub. He built the Government House and Port Louis, turning the island into the 'Star and Key of the Indian Ocean'.",
    riveInput: "Hover 5",
    image: "/assets/images/history/5-star-and-key.jpg"
  },
  {
    id: 6,
    title: "The British Capitulation",
    date: "1810",
    description: "Though the French won the naval Battle of Grand Port in August, a British invasion force landed at Cap Malheureux that December and seized the island. The Treaty of Paris (1814) ceded it to Britain but preserved French laws, customs, and language.",
    riveInput: "Hover 6",
    image: "/assets/images/history/6-british-capitulation.jpg"
  },
  {
    id: 7,
    title: "The Great Experiment",
    date: "1835",
    description: "Slavery was abolished on February 1st. To replace labor, the British initiated the 'Great Experiment' at Aapravasi Ghat, proving the viability of indentured labor.",
    riveInput: "Hover 7",
    image: "/assets/images/history/7-great-experiment.jpg"
  },
  {
    id: 8,
    title: "The Aapravasi Spirit",
    date: "1834-1920",
    description: "Over 450,000 Indian laborers climbed the 16 steps of Aapravasi Ghat. This mass migration fundamentally redefined the island's demographic and cultural identity.",
    riveInput: "Hover 8",
    image: "/assets/images/history/8-aapravasi-ghat.jpg"
  },
  {
    id: 9,
    title: "The Quadricolour",
    date: "1968",
    description: "March 12: Independence was declared. Sir Seewoosagur Ramgoolam raised the Red, Blue, Yellow, and Green flag, marking the end of 158 years of British rule.",
    riveInput: "Hover 9",
    image: "/assets/images/history/9-quadricolour.jpg"
  },
  {
    id: 10,
    title: "The Modern Republic",
    date: "1992",
    description: "On March 12 — the 24th anniversary of independence — Mauritius became a Republic within the Commonwealth, replacing the British monarch with a Mauritian President and cementing its status as one of Africa's most stable democracies.",
    riveInput: "Hover 10",
    image: "/assets/images/history/10-modern-republic.jpg"
  }
];
