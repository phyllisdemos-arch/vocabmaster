import { ReviewState, calculateNextReviewState } from './reviewScheduler';

export interface TestResult {
  testType: 'multiple-choice' | 'spelling' | 'listening' | 'matching';
  date: string;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  duration: number; // in seconds
  wordResults: Array<{
    wordId: number;
    word: string;
    correct: boolean;
  }>;
}

export interface TestStatistics {
  totalTests: number;
  averageAccuracy: number;
  bestAccuracy: number;
  recentTests: TestResult[];
  accuracyByType: {
    multipleChoice: number;
    spelling: number;
    listening: number;
    matching: number;
  };
}

// Save test result to localStorage
export function saveTestResult(result: TestResult): void {
  try {
    const resultsJson = localStorage.getItem('vocabmaster-test-results');
    const results: TestResult[] = resultsJson ? JSON.parse(resultsJson) : [];
    results.push(result);
    localStorage.setItem('vocabmaster-test-results', JSON.stringify(results));

    // Update review states based on test performance
    updateReviewStatesFromTest(result);
  } catch (error) {
    console.error('Failed to save test result:', error);
  }
}

// Get test statistics
export function getTestStatistics(): TestStatistics {
  try {
    const resultsJson = localStorage.getItem('vocabmaster-test-results');
    const results: TestResult[] = resultsJson ? JSON.parse(resultsJson) : [];

    if (results.length === 0) {
      return {
        totalTests: 0,
        averageAccuracy: 0,
        bestAccuracy: 0,
        recentTests: [],
        accuracyByType: {
          multipleChoice: 0,
          spelling: 0,
          listening: 0,
          matching: 0,
        },
      };
    }

    const totalTests = results.length;
    const averageAccuracy = Math.round(
      results.reduce((sum, r) => sum + r.accuracy, 0) / totalTests
    );
    const bestAccuracy = Math.max(...results.map(r => r.accuracy));
    const recentTests = results.slice(-10).reverse();

    // Calculate accuracy by type
    const accuracyByType = {
      multipleChoice: calculateAverageAccuracy(results, 'multiple-choice'),
      spelling: calculateAverageAccuracy(results, 'spelling'),
      listening: calculateAverageAccuracy(results, 'listening'),
      matching: calculateAverageAccuracy(results, 'matching'),
    };

    return {
      totalTests,
      averageAccuracy,
      bestAccuracy,
      recentTests,
      accuracyByType,
    };
  } catch (error) {
    console.error('Failed to get test statistics:', error);
    return {
      totalTests: 0,
      averageAccuracy: 0,
      bestAccuracy: 0,
      recentTests: [],
      accuracyByType: {
        multipleChoice: 0,
        spelling: 0,
        listening: 0,
        matching: 0,
      },
    };
  }
}

function calculateAverageAccuracy(results: TestResult[], type: TestResult['testType']): number {
  const typeResults = results.filter(r => r.testType === type);
  if (typeResults.length === 0) return 0;
  return Math.round(
    typeResults.reduce((sum, r) => sum + r.accuracy, 0) / typeResults.length
  );
}

// Update review states based on test performance
function updateReviewStatesFromTest(result: TestResult): void {
  try {
    const reviewStatesJson = localStorage.getItem('vocabmaster-review-states');
    const reviewStates: Record<number, ReviewState> = reviewStatesJson
      ? JSON.parse(reviewStatesJson)
      : {};

    result.wordResults.forEach(wordResult => {
      const currentState = reviewStates[wordResult.wordId];
      const nextState = calculateNextReviewState(currentState, wordResult.correct);
      reviewStates[wordResult.wordId] = nextState;
    });

    localStorage.setItem('vocabmaster-review-states', JSON.stringify(reviewStates));
  } catch (error) {
    console.error('Failed to update review states:', error);
  }
}

// Get random words for test
export async function getRandomWords(count: number): Promise<any[]> {
  try {
    const response = await fetch('/words.json');
    const allWords = await response.json();

    // Shuffle and take first N
    const shuffled = [...allWords].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  } catch (error) {
    console.error('Failed to load words:', error);
    return [];
  }
}

// Get learned words (words with review history)
export async function getLearnedWords(count: number): Promise<any[]> {
  try {
    if (typeof window === 'undefined') return [];

    // Load all words
    const response = await fetch('/words.json');
    const allWords = await response.json();

    // Load review states
    const reviewStatesJson = localStorage.getItem('vocabmaster-review-states');
    const reviewStates: Record<number, ReviewState> = reviewStatesJson
      ? JSON.parse(reviewStatesJson)
      : {};

    // Filter words that have review history (have been studied at least once)
    const learnedWords = allWords.filter((word: any) => {
      const state = reviewStates[word.id];
      // Word is considered "learned" if it has a review state with at least 1 review
      return state && state.reviewCount > 0;
    });

    // If not enough learned words, use all words that have any review state
    const wordsToUse = learnedWords.length >= count
      ? learnedWords
      : allWords.filter((word: any) => reviewStates[word.id]);

    // If still not enough, use all words
    const finalWords = wordsToUse.length >= count
      ? wordsToUse
      : allWords;

    // Shuffle and take first N
    const shuffled = [...finalWords].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  } catch (error) {
    console.error('Failed to load learned words:', error);
    return [];
  }
}

// Get count of learned words
export async function getLearnedWordsCount(): Promise<number> {
  try {
    if (typeof window === 'undefined') return 0;

    // Load all words
    const response = await fetch('/words.json');
    const allWords = await response.json();

    // Load review states
    const reviewStatesJson = localStorage.getItem('vocabmaster-review-states');
    const reviewStates: Record<number, ReviewState> = reviewStatesJson
      ? JSON.parse(reviewStatesJson)
      : {};

    // Count words with review history
    return allWords.filter((word: any) => {
      const state = reviewStates[word.id];
      return state && state.reviewCount > 0;
    }).length;
  } catch (error) {
    console.error('Failed to get learned words count:', error);
    return 0;
  }
}

// Get wrong answers for multiple choice
export function getWrongAnswers(correctAnswer: string, count: number, allWords: any[]): string[] {
  const wrongAnswers = allWords
    .filter(w => w.definition !== correctAnswer)
    .map(w => w.definition)
    .sort(() => Math.random() - 0.5)
    .slice(0, count);

  return wrongAnswers;
}
