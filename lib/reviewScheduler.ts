// Ebbinghaus forgetting curve intervals (in days)
export const EBBINGHAUS_INTERVALS = [1, 2, 4, 7, 15, 30, 90, 180];

export interface ReviewState {
  wordId: number;
  currentStage: number; // 0-7, representing the 8 review stages
  lastReviewDate: string; // ISO date string
  nextReviewDate: string; // ISO date string
  reviewCount: number;
  correctCount: number;
  incorrectCount: number;
}

export interface WordWithReviewState {
  id: number;
  word: string;
  pronunciation: string;
  definition: string;
  partOfSpeech: string;
  example: string;
  reviewState?: ReviewState;
  isFavorite?: boolean;
}

// Get next review date based on current stage
export function getNextReviewDate(currentStage: number): Date {
  const daysToAdd = currentStage < EBBINGHAUS_INTERVALS.length
    ? EBBINGHAUS_INTERVALS[currentStage]
    : EBBINGHAUS_INTERVALS[EBBINGHAUS_INTERVALS.length - 1];

  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + daysToAdd);
  return nextDate;
}

// Calculate next review state after a review attempt
export function calculateNextReviewState(
  currentState: ReviewState | undefined,
  isCorrect: boolean
): ReviewState {
  const now = new Date();
  const currentStage = currentState?.currentStage ?? -1;

  if (isCorrect) {
    // Move to next stage
    const nextStage = Math.min(currentStage + 1, EBBINGHAUS_INTERVALS.length - 1);
    const nextReviewDate = getNextReviewDate(nextStage);

    return {
      wordId: currentState?.wordId || 0,
      currentStage: nextStage,
      lastReviewDate: now.toISOString(),
      nextReviewDate: nextReviewDate.toISOString(),
      reviewCount: (currentState?.reviewCount || 0) + 1,
      correctCount: (currentState?.correctCount || 0) + 1,
      incorrectCount: currentState?.incorrectCount || 0,
    };
  } else {
    // Reset to stage 0
    const nextReviewDate = getNextReviewDate(0);

    return {
      wordId: currentState?.wordId || 0,
      currentStage: 0,
      lastReviewDate: now.toISOString(),
      nextReviewDate: nextReviewDate.toISOString(),
      reviewCount: (currentState?.reviewCount || 0) + 1,
      correctCount: currentState?.correctCount || 0,
      incorrectCount: (currentState?.incorrectCount || 0) + 1,
    };
  }
}

// Check if a word is due for review
export function isWordDueForReview(reviewState: ReviewState | undefined): boolean {
  if (!reviewState) return true; // New word, needs to be reviewed

  const now = new Date();
  const nextReviewDate = new Date(reviewState.nextReviewDate);
  return now >= nextReviewDate;
}

// Get words due for review
export function getWordsDueForReview(words: WordWithReviewState[]): WordWithReviewState[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return words.filter(word => {
    if (!word.reviewState) return true;
    const nextReviewDate = new Date(word.reviewState.nextReviewDate);
    nextReviewDate.setHours(0, 0, 0, 0);
    return nextReviewDate <= today;
  });
}

// Get review stage label
export function getReviewStageLabel(stage: number): string {
  if (stage === 0) return "初次学习";
  if (stage === 1) return "第1次复习";
  if (stage === 2) return "第2次复习";
  if (stage === 3) return "第3次复习";
  if (stage === 4) return "第4次复习";
  if (stage === 5) return "第5次复习";
  if (stage === 6) return "第6次复习";
  if (stage === 7) return "第7次复习";
  return "已完成";
}

// Get days until next review
export function getDaysUntilNextReview(reviewState: ReviewState | undefined): number {
  if (!reviewState) return 0;

  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const nextReviewDate = new Date(reviewState.nextReviewDate);
  nextReviewDate.setHours(0, 0, 0, 0);

  const diffTime = nextReviewDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

// Calculate mastery percentage based on correct reviews
export function calculateMasteryPercentage(reviewState: ReviewState | undefined): number {
  if (!reviewState || reviewState.reviewCount === 0) return 0;

  const correctRatio = reviewState.correctCount / reviewState.reviewCount;
  const stageBonus = reviewState.currentStage * 5; // Bonus for advancing stages

  return Math.min(100, Math.round((correctRatio * 70) + stageBonus));
}

// Get review statistics
export function getReviewStatistics(words: WordWithReviewState[]) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const stats = {
    total: words.length,
    dueToday: 0,
    mastered: 0,
    inProgress: 0,
    notStarted: 0,
    upcoming: {} as Record<number, number>,
  };

  words.forEach(word => {
    if (!word.reviewState) {
      stats.notStarted++;
    } else {
      const nextReviewDate = new Date(word.reviewState.nextReviewDate);
      nextReviewDate.setHours(0, 0, 0, 0);

      if (nextReviewDate <= today) {
        stats.dueToday++;
      } else {
        const daysUntil = Math.ceil((nextReviewDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        stats.upcoming[daysUntil] = (stats.upcoming[daysUntil] || 0) + 1;
      }

      if (word.reviewState.currentStage === EBBINGHAUS_INTERVALS.length - 1 &&
          word.reviewState.correctCount >= 7) {
        stats.mastered++;
      } else {
        stats.inProgress++;
      }
    }
  });

  return stats;
}
