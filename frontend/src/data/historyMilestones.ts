export interface HistoryMilestone {
  id: number;
  title: string;
  date: string;
  description: string;
  riveInput: string;
  /**
   * Public path or URL to the milestone's hero image.
   * Local images are served from `frontend/public/assets/images/history/stack/`
   * (sourced from Wikimedia Commons, see CREDITS.md in that folder).
   * onError fallback in the component hides any broken images cleanly.
   */
  image: string;
}

export const historyMilestones: HistoryMilestone[] = [
  {
    id: 1,
    riveInput: "Hover 1",
    date: "2 Billion Y.A.",
    title: "The Submerged Microcontinent",
    description: "While the island's surface basalts are 10 million years old, microscopic zircon crystals discovered in 2012 prove Mauritius sits atop 'Mauritia', a sunken Precambrian microcontinent that fractured during the breakup of Gondwana over two billion years ago.",
    image: "/assets/images/history/stack/01-mauritia-gondwana.jpg"
  },
  {
    id: 2,
    riveInput: "Hover 2",
    date: "975 CE",
    title: "Dina Arobi",
    description: "Arab and Swahili mariners navigating the Sea of Zanj discovered the island, naming it 'Dina Arobi' (Abandoned Island). Documented on the 1502 Cantino Planisphere, their choice not to settle meant Mauritius remained devoid of an indigenous population, making it a pure laboratory of global migration.",
    image: "/assets/images/history/stack/02-dina-arobi-cantino.jpg"
  },
  {
    id: 3,
    riveInput: "Hover 3",
    date: "1598",
    title: "The Dutch & The Dodo",
    description: "Dutch colonization introduced sugarcane and invasive fauna to a pristine sanctuary. This rapid biological terraforming triggered the Anthropocene extinction of the flightless Dodo (Raphus cucullatus), statistically estimated to have vanished by 1693.",
    image: "/assets/images/history/stack/03-dutch-dodo.jpg"
  },
  {
    id: 4,
    riveInput: "Hover 4",
    date: "1715",
    title: "Isle de France",
    description: "Under Governor Mahé de La Bourdonnais, the French transformed the island into a lucrative naval base and monocrop plantation economy. This wealth was extracted entirely through the brutal, institutionalized labor of enslaved African and Malagasy populations.",
    image: "/assets/images/history/stack/04-isle-de-france.jpg"
  },
  {
    id: 5,
    riveInput: "Hover 5",
    date: "1810",
    title: "The British Cession",
    description: "Following the brutal Battle of Grand Port, overwhelming British forces captured the island. The 1814 Treaty of Paris officially transferred sovereignty, but lenient terms allowed Franco-Mauritians to retain their land, wealth, and the French civil code, engineering a complex hybrid society.",
    image: "/assets/images/history/stack/05-british-cession.jpg"
  },
  {
    id: 7,
    riveInput: "Hover 7",
    date: "1834",
    title: "The Great Experiment",
    description: "Facing a labor vacuum, the British initiated a systemic indentured labor framework. Nearly 450,000 Indian laborers passed through the stone steps of the Aapravasi Ghat, permanently altering the demographic and cultural destiny of the island.",
    image: "/assets/images/history/stack/07-great-experiment.jpg"
  },
  {
    id: 6,
    riveInput: "Hover 6",
    date: "1835",
    title: "Abolition & Resistance",
    description: "Upon the abolition of slavery, the British paid £1.2 million in 'compensation' to the plantation owners, not the 66,343 freed individuals. The sheer cliffs of Le Morne Brabant remain the ultimate geographical monument to the Maroons who sought sanctuary from bondage.",
    image: "/assets/images/history/stack/06-abolition-le-morne.jpg"
  },
  {
    id: 8,
    riveInput: "Hover 8",
    date: "1947",
    title: "The Literacy Franchise",
    description: "Dismantling the elite's absolute political monopoly, a revolutionary constitution granted the vote to any adult who could write their name in any of the island's 19 languages. This enfranchised the educated working classes and descendants of indentured laborers.",
    image: "/assets/images/history/stack/08-literacy-franchise.jpg"
  },
  {
    id: 9,
    riveInput: "Hover 9",
    date: "1959",
    title: "Universal Suffrage",
    description: "The democratic threshold of 'one man, one vote' was crossed. While validating the Mauritian capacity for massive democratic exercises, these elections also entrenched the complex, communal fault lines that influence national politics today.",
    image: "/assets/images/history/stack/09-universal-suffrage.jpg"
  },
  {
    id: 10,
    riveInput: "Hover 10",
    date: "1968",
    title: "Sovereign Independence",
    description: "Defying Malthusian predictions of economic and ethnic collapse, Sir Seewoosagur Ramgoolam led Mauritius to sovereignty. By prioritizing institutional stability, free healthcare, and education, the state engineered profound social cohesion.",
    image: "/assets/images/history/stack/10-independence-1968.jpg"
  },
  {
    id: 11,
    riveInput: "Hover 11",
    date: "1970s",
    title: "The Economic Miracle",
    description: "To survive extreme reliance on sugar monocrop agriculture, the state aggressively pioneered Export Processing Zones (EPZs) and luxury tourism. This dual strategy absorbed structural unemployment and created a vast, stable middle class.",
    image: "/assets/images/history/stack/11-economic-miracle.jpg"
  },
  {
    id: 12,
    riveInput: "Hover 12",
    date: "1992",
    title: "Rise of the Republic",
    description: "Severing final symbolic ties to the British Crown, Mauritius became a Republic. Simultaneously, it leveraged its bilingual workforce and hybrid legal system to launch an offshore financial center, rapidly becoming the premier investment gateway to Africa.",
    image: "/assets/images/history/stack/12-republic-1992.jpg"
  },
  {
    id: 13,
    riveInput: "Hover 13",
    date: "2006",
    title: "Institutionalizing Memory",
    description: "Mauritius forced global acknowledgment of subaltern histories by securing UNESCO World Heritage status for both the Aapravasi Ghat and Le Morne Brabant, cementing the immense human resilience that subsidized global capitalism.",
    image: "/assets/images/history/stack/13-unesco-memory.jpg"
  },
  {
    id: 14,
    riveInput: "Hover 14",
    date: "2010s",
    title: "The Knowledge Economy",
    description: "The 'Digital Mauritius 2030 Vision' shifted the nation away from physical exports. Massive investments in submarine fiber-optics, FinTech, and the Blue Economy effectively decoupled Mauritian wealth from its remote geographic isolation.",
    image: "/assets/images/history/stack/14-knowledge-economy.jpg"
  },
  {
    id: 15,
    riveInput: "Hover 15",
    date: "2025",
    title: "The Final Decolonization",
    description: "Concluding a relentless, highly sophisticated legal campaign at the United Nations, Mauritius reclaimed sovereignty over the Chagos Archipelago from the UK, ending the final chapter of colonial territorial partition.",
    image: "/assets/images/history/stack/15-chagos-2025.jpg"
  },
  {
    id: 16,
    riveInput: "Hover 16",
    date: "2026",
    title: "A Pluralistic Powerhouse",
    description: "Today, Mauritius is a high-income, deeply pluralistic democracy stabilizing the Indian Ocean. It stands as a profound global model of post-colonial resilience, navigating its volcanic genesis and colonial trauma to become the undisputed Star and Key of the Indian Ocean.",
    image: "/assets/images/history/stack/16-mauritius-today.jpg"
  }
];
