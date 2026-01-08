// Interactive Mauritius History & Culture Quiz
// All questions based on real historical facts from the site

export const mauritiusQuiz = {
  title: 'Test Your Mauritius Knowledge',
  description: 'How well do you know the Island of the Dodo? Take this quiz to discover the rich history and culture of Mauritius.',
  questions: [
    {
      id: 1,
      question: 'When did the dodo bird become extinct?',
      options: [
        { id: 'a', text: 'Around 1500, shortly after Portuguese discovery', correct: false },
        { id: 'b', text: 'Approximately 1662-1690, during Dutch colonization', correct: true },
        { id: 'c', text: 'In 1810, when the British took control', correct: false },
        { id: 'd', text: 'After 1835, when slavery was abolished', correct: false },
      ],
      explanation: 'The dodo went extinct approximately 60-80 years after Dutch arrival (1638), between 1662-1690. Habitat destruction, invasive species (rats, pigs), and hunting led to its rapid extinction.',
      difficulty: 'easy',
      category: 'natural history',
    },
    {
      id: 2,
      question: 'How many Indian indentured laborers arrived in Mauritius between 1834-1920?',
      options: [
        { id: 'a', text: 'Approximately 50,000', correct: false },
        { id: 'b', text: 'Approximately 150,000', correct: false },
        { id: 'c', text: 'Nearly 450,000', correct: true },
        { id: 'd', text: 'Over 1 million', correct: false },
      ],
      explanation: 'Nearly 450,000 Indian indentured laborers arrived in Mauritius after slavery abolition (1835), fundamentally transforming the island\'s demographics, culture, and identity. They came primarily from Bihar, Uttar Pradesh, and Tamil Nadu.',
      difficulty: 'medium',
      category: 'history',
    },
    {
      id: 3,
      question: 'Which language is spoken by approximately 90% of Mauritians in daily life?',
      options: [
        { id: 'a', text: 'English (official language)', correct: false },
        { id: 'b', text: 'French', correct: false },
        { id: 'c', text: 'Mauritian Creole (Morisyen)', correct: true },
        { id: 'd', text: 'Hindi', correct: false },
      ],
      explanation: 'Mauritian Creole (Morisyen) is the lingua franca, spoken by 90% of the population. It evolved from 18th-century French with influences from Malagasy, African Bantu languages, and Indian languages, becoming a symbol of national unity.',
      difficulty: 'easy',
      category: 'culture',
    },
    {
      id: 4,
      question: 'What is the only French naval victory inscribed on the Arc de Triomphe in Paris?',
      options: [
        { id: 'a', text: 'Battle of Port Louis (1735)', correct: false },
        { id: 'b', text: 'Battle of Grand Port (1810)', correct: true },
        { id: 'c', text: 'Battle of Le Morne (1815)', correct: false },
        { id: 'd', text: 'Battle of Mahebourg (1808)', correct: false },
      ],
      explanation: 'The Battle of Grand Port (August 1810) was a French naval victory over the British during the Napoleonic Wars. It is the only French naval victory inscribed on the Arc de Triomphe. However, Britain conquered Mauritius three months later in December 1810.',
      difficulty: 'hard',
      category: 'history',
    },
    {
      id: 5,
      question: 'Which Hindu festival in Mauritius is the largest pilgrimage outside India?',
      options: [
        { id: 'a', text: 'Divali (Festival of Lights)', correct: false },
        { id: 'b', text: 'Holi (Festival of Colors)', correct: false },
        { id: 'c', text: 'Maha Shivaratri', correct: true },
        { id: 'd', text: 'Cavadee (Thaipoosam)', correct: false },
      ],
      explanation: 'Maha Shivaratri sees up to 500,000 pilgrims walk to Grand Bassin (Ganga Talao) crater lake, making it the largest Hindu pilgrimage outside India. Devotees dressed in white carry kanwars (decorated structures) and pour holy water into Shiva lingams.',
      difficulty: 'medium',
      category: 'culture',
    },
    {
      id: 6,
      question: 'When did Mauritius gain independence from Britain?',
      options: [
        { id: 'a', text: 'March 12, 1968', correct: true },
        { id: 'b', text: 'August 15, 1947', correct: false },
        { id: 'c', text: 'July 4, 1776', correct: false },
        { id: 'd', text: 'January 1, 1992', correct: false },
      ],
      explanation: 'Mauritius gained independence from Britain on March 12, 1968, with Sir Seewoosagur Ramgoolam as first Prime Minister. The country became a republic within the Commonwealth in 1992, replacing Queen Elizabeth II with an elected president.',
      difficulty: 'easy',
      category: 'history',
    },
    {
      id: 7,
      question: 'What is the national street food of Mauritius?',
      options: [
        { id: 'a', text: 'Gateaux piments (chili cakes)', correct: false },
        { id: 'b', text: 'Dholl puri (split pea flatbread)', correct: true },
        { id: 'c', text: 'Samosas', correct: false },
        { id: 'd', text: 'Bol renversé', correct: false },
      ],
      explanation: 'Dholl puri—yellow split pea flatbread served with butter bean curry, chutney, and rougaille—is the unofficial national street food. It originated with Indian indentured laborers and evolved with Creole, Chinese, and French influences, becoming the ultimate symbol of Mauritian fusion cuisine.',
      difficulty: 'easy',
      category: 'culture',
    },
    {
      id: 8,
      question: 'Which UNESCO-recognized music and dance originated among enslaved Africans in Mauritius?',
      options: [
        { id: 'a', text: 'Bhojpuri folk songs', correct: false },
        { id: 'b', text: 'Seggae (sega-reggae fusion)', correct: false },
        { id: 'c', text: 'Sega', correct: true },
        { id: 'd', text: 'Ravanne drumming', correct: false },
      ],
      explanation: 'Sega music and dance, recognized by UNESCO as Intangible Cultural Heritage (2014), originated among enslaved Africans during French colonial rule. Performed traditionally with the ravanne (goat-skin drum), it was a form of expression, resistance, and community bonding.',
      difficulty: 'medium',
      category: 'culture',
    },
    {
      id: 9,
      question: 'Le Morne Brabant mountain (UNESCO World Heritage Site) symbolizes:',
      options: [
        { id: 'a', text: 'British naval victory', correct: false },
        { id: 'b', text: 'Resistance to slavery and freedom', correct: true },
        { id: 'c', text: 'Dutch settlement', correct: false },
        { id: 'd', text: 'Indian indentured labor', correct: false },
      ],
      explanation: 'Le Morne Brabant (556m) served as refuge for maroons (escaped slaves) during French and early British colonial periods. It symbolizes resistance to slavery and the quest for freedom. Legend says maroons jumped to their deaths in 1835, misunderstanding that slavery had been abolished.',
      difficulty: 'medium',
      category: 'history',
    },
    {
      id: 10,
      question: 'What percentage of Mauritius\' original native forests remain today?',
      options: [
        { id: 'a', text: 'About 50%', correct: false },
        { id: 'b', text: 'About 25%', correct: false },
        { id: 'c', text: 'About 10%', correct: false },
        { id: 'd', text: 'Only about 2%', correct: true },
      ],
      explanation: 'Only about 2% of Mauritius\' native forests remain today. Most was cleared during colonial sugar plantation expansion. Black River Gorges National Park (established 1994) protects the largest remaining endemic forest, where species like the Mauritius kestrel were saved from extinction.',
      difficulty: 'hard',
      category: 'natural history',
    },
  ],
};

// Calculate quiz score and level
export const calculateQuizResult = (correctAnswers, totalQuestions) => {
  const percentage = (correctAnswers / totalQuestions) * 100;
  
  if (percentage >= 90) {
    return {
      level: 'Mauritius Expert',
      message: 'Exceptional! You have deep knowledge of Mauritian history and culture.',
      emoji: '🏆',
    };
  } else if (percentage >= 70) {
    return {
      level: 'Cultural Explorer',
      message: 'Great job! You understand the key aspects of Mauritius.',
      emoji: '🌟',
    };
  } else if (percentage >= 50) {
    return {
      level: 'Island Learner',
      message: 'Good start! Keep exploring to learn more about Mauritius.',
      emoji: '📚',
    };
  } else {
    return {
      level: 'Curious Visitor',
      message: 'There\'s so much to discover! Explore the site to learn more.',
      emoji: '🧐',
    };
  }
};
