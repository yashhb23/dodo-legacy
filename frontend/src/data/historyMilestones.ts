export interface HistoryMilestone {
  id: number;
  title: string;
  date: string;
  description: string;
  riveInput: string;
  /**
   * Public path or URL to the milestone's hero image.
   * Local images are served from `frontend/public/assets/images/history/`.
   * onError fallback in the component hides any broken images cleanly.
   */
  image: string;
}

export const historyMilestones: HistoryMilestone[] = [
  {
    id: 1,
    riveInput: "Hover 1",
    date: "10th Century",
    title: "Dina Arobi",
    description:
      "Arab sailors are the first recorded humans to discover the uninhabited volcanic island, naming it 'Dina Arobi' (Abandoned Island). Though they did not settle, their discovery marked the island's entry into global maritime records.",
    image: "/assets/images/history/2-dina-arobi.jpg",
  },
  {
    id: 2,
    riveInput: "Hover 2",
    date: "1598",
    title: "The Dutch Landing",
    description:
      "Admiral Wybrand van Warwyck lands at Grand Port, naming the island 'Mauritius' after Prince Maurice of Nassau. This era saw the introduction of sugar cane, the exploitation of ebony, and tragically, the extinction of the Dodo.",
    image: "/assets/images/history/3-nassau-claim.jpg",
  },
  {
    id: 3,
    riveInput: "Hover 3",
    date: "1715",
    title: "Isle de France",
    description:
      "Guillaume Dufresne d'Arsel claims the island for France. Under the visionary governance of Mahé de Labourdonnais, Port Louis is established as a major naval base and the island transforms into a prosperous trading hub.",
    image: "/assets/images/history/5-star-and-key.jpg",
  },
  {
    id: 4,
    riveInput: "Hover 4",
    date: "1810",
    title: "Battle of Grand Port",
    description:
      "The island becomes a strategic flashpoint. In August 1810, the French inflict the only naval defeat the British Royal Navy suffered during the Napoleonic Wars. However, the British return in overwhelming force months later.",
    image: "/assets/images/history/6-british-capitulation.jpg",
  },
  {
    id: 5,
    riveInput: "Hover 5",
    date: "1814",
    title: "The British Cession",
    description:
      "Following the British capture at Cap Malheureux, the Treaty of Paris officially cedes the island to Britain. The name reverts to Mauritius, but the British strategically allow the inhabitants to retain their French language, laws, and customs.",
    image: "/assets/images/history/6-british-capitulation.jpg",
  },
  {
    id: 6,
    riveInput: "Hover 6",
    date: "1835",
    title: "Abolition & Sanctuary",
    description:
      "Slavery is officially abolished. Le Morne Brabant, a rugged basaltic monolith, becomes a profound symbol of resistance as it serves as a sanctuary for runaway slaves (Maroons) fighting for freedom.",
    image: "/assets/images/history/7-great-experiment.jpg",
  },
  {
    id: 7,
    riveInput: "Hover 7",
    date: "1834",
    title: "The Great Experiment",
    description:
      "To replace enslaved labor, the British initiate the 'Great Experiment', bringing nearly half a million indentured laborers from India through Aapravasi Ghat, forever altering the island's demographic and cultural destiny.",
    image: "/assets/images/history/8-aapravasi-ghat.jpg",
  },
  {
    id: 8,
    riveInput: "Hover 8",
    date: "1968",
    title: "Independence",
    description:
      "On March 12, 1968, following years of political campaigning, Sir Seewoosagur Ramgoolam leads Mauritius to independence. The iconic Quadricolour flag is raised for the first time, marking the birth of a sovereign nation.",
    image: "/assets/images/history/9-quadricolour.jpg",
  },
  {
    id: 9,
    riveInput: "Hover 9",
    date: "1992",
    title: "The Republic",
    description:
      "Exactly 24 years after independence, on March 12, 1992, Mauritius officially becomes a Republic within the Commonwealth. This solidifies its democratic institutions and completes its transition to full political maturity.",
    image: "/assets/images/history/10-modern-republic.jpg",
  },
  {
    id: 10,
    riveInput: "Hover 10",
    date: "2026",
    title: "The Cyber Island",
    description:
      "Mauritius transitions from an agriculture-dependent economy to a powerhouse of ICT, finance, and oceanic sustainability. The modern era is defined by the Metro Express, smart cities, and the preservation of its fragile blue economy.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
  },
];
