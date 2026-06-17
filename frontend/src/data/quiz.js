// Interactive Mauritius History & Culture Quiz
// Fun, memorable questions for all visitors

export const mauritiusQuiz = {
  title: 'Test Your Mauritius Knowledge',
  subtitle: 'Take this short quiz to upgrade your Mauritius knowledge.',
  questions: [
    {
      id: 1,
      question: 'What is the famous extinct bird that became a symbol of Mauritius?',
      options: [
        { id: 'a', text: 'The Parrot', correct: false },
        { id: 'b', text: 'The Dodo', correct: true },
        { id: 'c', text: 'The Penguin', correct: false },
        { id: 'd', text: 'The Eagle', correct: false },
      ],
      explanation: 'The dodo was a flightless bird unique to Mauritius. It became extinct around 1662-1690 and is now a beloved symbol of the island, appearing on the national coat of arms.',
      difficulty: 'easy',
      category: 'wildlife',
    },
    {
      id: 2,
      question: 'What is the capital city of Mauritius?',
      options: [
        { id: 'a', text: 'Curepipe', correct: false },
        { id: 'b', text: 'Grand Baie', correct: false },
        { id: 'c', text: 'Port Louis', correct: true },
        { id: 'd', text: 'Mahebourg', correct: false },
      ],
      explanation: 'Port Louis is the capital and largest city of Mauritius. It was founded in 1735 by the French and named after King Louis XV of France.',
      difficulty: 'easy',
      category: 'geography',
    },
    {
      id: 3,
      question: 'Which ocean surrounds the island of Mauritius?',
      options: [
        { id: 'a', text: 'Atlantic Ocean', correct: false },
        { id: 'b', text: 'Pacific Ocean', correct: false },
        { id: 'c', text: 'Indian Ocean', correct: true },
        { id: 'd', text: 'Arctic Ocean', correct: false },
      ],
      explanation: 'Mauritius is located in the Indian Ocean, about 2,000 kilometers off the southeast coast of Africa, east of Madagascar.',
      difficulty: 'easy',
      category: 'geography',
    },
    {
      id: 4,
      question: 'What popular music style originated among enslaved Africans in Mauritius?',
      options: [
        { id: 'a', text: 'Jazz', correct: false },
        { id: 'b', text: 'Sega', correct: true },
        { id: 'c', text: 'Reggae', correct: false },
        { id: 'd', text: 'Salsa', correct: false },
      ],
      explanation: 'Sega music and dance originated among enslaved Africans during French colonial rule. It was recognized by UNESCO as Intangible Cultural Heritage in 2014.',
      difficulty: 'easy',
      category: 'culture',
    },
    {
      id: 5,
      question: 'What is the unofficial national street food of Mauritius?',
      options: [
        { id: 'a', text: 'Pizza', correct: false },
        { id: 'b', text: 'Tacos', correct: false },
        { id: 'c', text: 'Dholl Puri', correct: true },
        { id: 'd', text: 'Burgers', correct: false },
      ],
      explanation: 'Dholl puri is a beloved street food: yellow split pea flatbread served with butter bean curry, chutney, and rougaille. You can find vendors at nearly every street corner!',
      difficulty: 'easy',
      category: 'food',
    },
    {
      id: 6,
      question: 'How many colors are on the Mauritius flag?',
      options: [
        { id: 'a', text: 'Two', correct: false },
        { id: 'b', text: 'Three', correct: false },
        { id: 'c', text: 'Four', correct: true },
        { id: 'd', text: 'Five', correct: false },
      ],
      explanation: 'The Mauritius flag has four horizontal stripes: red (struggle for freedom), blue (Indian Ocean), yellow (bright future), and green (lush vegetation).',
      difficulty: 'easy',
      category: 'culture',
    },
    {
      id: 7,
      question: 'Which European nation first settled permanently in Mauritius?',
      options: [
        { id: 'a', text: 'British', correct: false },
        { id: 'b', text: 'French', correct: false },
        { id: 'c', text: 'Dutch', correct: true },
        { id: 'd', text: 'Portuguese', correct: false },
      ],
      explanation: 'The Dutch established the first permanent settlement in 1638. They named the island after Prince Maurice of Nassau. The French and British came later.',
      difficulty: 'medium',
      category: 'history',
    },
    {
      id: 8,
      question: 'What famous botanical garden in Mauritius is one of the oldest in the world?',
      options: [
        { id: 'a', text: 'Royal Garden', correct: false },
        { id: 'b', text: 'Pamplemousses Botanical Garden', correct: true },
        { id: 'c', text: 'Victoria Garden', correct: false },
        { id: 'd', text: 'Paradise Garden', correct: false },
      ],
      explanation: 'The Sir Seewoosagur Ramgoolam Botanical Garden in Pamplemousses, established in 1770, is one of the oldest botanical gardens in the Southern Hemisphere. Its giant water lilies are world-famous!',
      difficulty: 'medium',
      category: 'nature',
    },
    {
      id: 9,
      question: 'What UNESCO World Heritage mountain in Mauritius was a refuge for escaped slaves?',
      options: [
        { id: 'a', text: 'Mount Everest', correct: false },
        { id: 'b', text: 'Le Morne Brabant', correct: true },
        { id: 'c', text: 'Black Mountain', correct: false },
        { id: 'd', text: 'Signal Mountain', correct: false },
      ],
      explanation: 'Le Morne Brabant served as a hideout for escaped slaves (maroons) during the 18th and 19th centuries. It symbolizes resistance to slavery and is now a UNESCO World Heritage Site.',
      difficulty: 'medium',
      category: 'heritage',
    },
    {
      id: 10,
      question: 'What year did Mauritius gain independence from Britain?',
      options: [
        { id: 'a', text: '1947', correct: false },
        { id: 'b', text: '1968', correct: true },
        { id: 'c', text: '1992', correct: false },
        { id: 'd', text: '1810', correct: false },
      ],
      explanation: 'Mauritius gained independence on March 12, 1968, with Sir Seewoosagur Ramgoolam as the first Prime Minister. The country became a republic in 1992.',
      difficulty: 'medium',
      category: 'history',
    },
  ],
};

// Calculate quiz score and level
export const calculateQuizResult = (correctAnswers, totalQuestions) => {
  const percentage = (correctAnswers / totalQuestions) * 100;
  
  if (percentage >= 90) {
    return {
      level: 'Mauritius Expert',
      message: 'Amazing! You really know your Mauritius facts!',
      emoji: '🏆',
    };
  } else if (percentage >= 70) {
    return {
      level: 'Island Explorer',
      message: 'Great job! You have solid knowledge of Mauritius.',
      emoji: '🌟',
    };
  } else if (percentage >= 50) {
    return {
      level: 'Curious Traveler',
      message: 'Good start! Keep exploring to learn more.',
      emoji: '🌴',
    };
  } else {
    return {
      level: 'New Discoverer',
      message: 'Welcome! There\'s so much to discover about Mauritius.',
      emoji: '🦤',
    };
  }
};
