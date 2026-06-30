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

// One source of truth for BOTH the 3D HistoryStack and the TimelineModal.
// The cards read as a single, flowing story: from the island's deep-time birth,
// through discovery and colonial chapters, the human heart of slavery and
// indenture, the long road to freedom, the modern nation, and a warm finish on
// the island as it is loved today. Tone is respectful to all Mauritians.
export const historyMilestones: HistoryMilestone[] = [
  {
    id: 1,
    riveInput: "Hover 1",
    date: "2 Billion Y.A.",
    title: "Where It Began",
    description: "Long before the island rose from the sea, there was Mauritia. Ancient zircon crystals found in Mauritian rock, some up to three billion years old, reveal that the island rests on a lost fragment of continental crust. As the supercontinent Gondwana broke apart, this sliver of land slipped beneath the Indian Ocean around 84 million years ago, waiting in the deep until volcanoes built the Mauritius we know today.",
    image: "/assets/images/history/stack/01-mauritia-gondwana.jpg"
  },
  {
    id: 2,
    riveInput: "Hover 2",
    date: "975 CE",
    title: "Dina Arobi",
    description: "Centuries before Europe arrived, Arab and Swahili mariners crossing the Indian Ocean knew this island and called it Dina Arobi. Later drawn on the 1502 Cantino Planisphere, they chose not to settle. So Mauritius remained one of the very few places on Earth with no original human population, a blank page on which a remarkable mix of peoples would one day be written.",
    image: "/assets/images/history/stack/02-dina-arobi-cantino.jpg"
  },
  {
    id: 3,
    riveInput: "Hover 3",
    date: "1598",
    title: "The Dutch and the Dodo",
    description: "The Dutch landed and named the island after Prince Maurice of Nassau. In barely a century, the animals and plants they brought transformed a pristine sanctuary, and the flightless dodo, found nowhere else on Earth, was gone by the late 1600s. The dodo became a lasting reminder of how easily a unique world can be lost, and of why Mauritius now treasures all that remains.",
    image: "/assets/images/history/stack/03-dutch-dodo.jpg"
  },
  {
    id: 4,
    riveInput: "Hover 4",
    date: "1715",
    title: "Isle de France",
    description: "France claimed the island as Isle de France and, under Governor Mahé de La Bourdonnais, built it into a thriving port and plantation colony. That prosperity rested on the forced labour of enslaved African and Malagasy men, women and children, whose suffering and resilience are woven into the very foundations of the island.",
    image: "/assets/images/history/stack/04-isle-de-france.jpg"
  },
  {
    id: 5,
    riveInput: "Hover 5",
    date: "1810",
    title: "The British Cession",
    description: "After the fierce Battle of Grand Port, the only French naval victory honoured on the Arc de Triomphe in Paris, Britain took the island in 1810. The 1814 Treaty of Paris confirmed British rule, yet allowed the French language, laws and landholdings to remain. From that blend grew the layered, multilingual society Mauritius still is today.",
    image: "/assets/images/history/stack/05-british-cession.jpg"
  },
  {
    id: 7,
    riveInput: "Hover 7",
    date: "1834",
    title: "The Great Experiment",
    description: "As slavery drew to a close, the British turned to indentured labour, and Mauritius became the first stop of a vast movement of people across the seas. Nearly half a million workers, most of them from India, climbed the stone steps of the Aapravasi Ghat to begin new lives far from home. Their courage and culture reshaped the island forever, and their arrival is now honoured by the world as a UNESCO World Heritage site.",
    image: "/assets/images/history/stack/07-great-experiment.jpg"
  },
  {
    id: 6,
    riveInput: "Hover 6",
    date: "1835",
    title: "Abolition and Resistance",
    description: "On 1 February 1835, slavery was abolished in Mauritius. In a bitter injustice, the British paid compensation to the plantation owners, not to the roughly sixty-six thousand people they had freed. High above the south-west coast, the sheer cliffs of Le Morne Brabant stand as a monument to the maroons who found freedom in the mountains, and to all who refused to be held in bondage.",
    image: "/assets/images/history/stack/06-abolition-le-morne.jpg"
  },
  {
    id: 8,
    riveInput: "Hover 8",
    date: "1947",
    title: "The Literacy Franchise",
    description: "A new constitution began to loosen the old elite's grip on power, granting the vote to any adult who could write their name in any of the island's many languages. For the first time, working people and the descendants of the indentured gained a real voice in shaping their own future.",
    image: "/assets/images/history/stack/08-literacy-franchise.jpg"
  },
  {
    id: 9,
    riveInput: "Hover 9",
    date: "1959",
    title: "Universal Suffrage",
    description: "The principle of one person, one vote arrived, and Mauritians turned out in extraordinary numbers. These first truly democratic elections revealed the island's deep appetite for self-government and set the stage for nationhood.",
    image: "/assets/images/history/stack/09-universal-suffrage.jpg"
  },
  {
    id: 10,
    riveInput: "Hover 10",
    date: "1968",
    title: "Independence",
    description: "On 12 March 1968, led by Sir Seewoosagur Ramgoolam, Mauritius became an independent nation. Many predicted that a small, crowded island with few resources would falter. Instead its founders bet on education, healthcare and unity, and began, year by year, to prove the doubters wrong.",
    image: "/assets/images/history/stack/10-independence-1968.jpg"
  },
  {
    id: 11,
    riveInput: "Hover 11",
    date: "1970s",
    title: "The Economic Miracle",
    description: "To break free of its dependence on sugar, Mauritius opened export zones and welcomed the world's travellers to its shores. Textiles and tourism created jobs and a broad middle class, and the island began its remarkable rise from hardship toward prosperity.",
    image: "/assets/images/history/stack/11-economic-miracle.jpg"
  },
  {
    id: 12,
    riveInput: "Hover 12",
    date: "1992",
    title: "The Republic",
    description: "Mauritius became a Republic, completing its journey from colony to fully sovereign nation. Drawing on its bilingual talent and trusted institutions, it also grew into a respected financial bridge between Asia and Africa.",
    image: "/assets/images/history/stack/12-republic-1992.jpg"
  },
  {
    id: 13,
    riveInput: "Hover 13",
    date: "2006",
    title: "Honouring the Ancestors",
    description: "Mauritius asked the world to remember the people whose labour built it. The Aapravasi Ghat, and soon after the cliffs of Le Morne Brabant, were inscribed as UNESCO World Heritage sites, honouring the indentured and the enslaved and the resilience that lies at the heart of the nation.",
    image: "/assets/images/history/stack/13-unesco-memory.jpg"
  },
  {
    id: 14,
    riveInput: "Hover 14",
    date: "2010s",
    title: "The Knowledge Economy",
    description: "The island looked firmly to the future with its Digital Mauritius vision, laying submarine fibre-optic cables and growing finance, technology and the blue economy. Once limited by its remoteness, Mauritius turned its place in the ocean into an advantage.",
    image: "/assets/images/history/stack/14-knowledge-economy.jpg"
  },
  {
    id: 15,
    riveInput: "Hover 15",
    date: "2025",
    title: "The Last Chapter of Empire",
    description: "In 2025, after a long and patient campaign, the United Kingdom agreed to recognise Mauritian sovereignty over the Chagos Archipelago, the final piece of the island's colonial map. It was a proud moment of completion, even as Mauritius continues to stand for the Chagossians and their right to return home.",
    image: "/assets/images/history/stack/15-chagos-2025.jpg"
  },
  {
    id: 16,
    riveInput: "Hover 16",
    date: "2026",
    title: "Star and Key of the Indian Ocean",
    description: "Today, Mauritius shines as the Star and Key of the Indian Ocean. Turquoise lagoons and soft white beaches draw visitors from every corner of the world, while sega rhythms, the warm scent of street food, and temples, churches and mosques standing side by side tell the story of one people made of many. From a lost sliver of continent to a proud, peaceful, multicultural home, this small island holds a love for itself that everyone who visits can feel. This is Mauritius: beautiful, welcoming, and truly home.",
    image: "/assets/images/history/stack/16-mauritius-today.jpg"
  }
];
