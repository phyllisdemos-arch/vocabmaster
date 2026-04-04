"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Flashcard from "@/components/Flashcard";
import ProgressBar from "@/components/ProgressBar";
import { RotateCcw, Home, Calendar, TrendingUp, CheckCircle2, Clock } from "lucide-react";
import {
  WordWithReviewState,
  ReviewState,
  getWordsDueForReview,
  calculateNextReviewState,
  getReviewStageLabel,
  getDaysUntilNextReview,
  calculateMasteryPercentage,
  getReviewStatistics,
  EBBINGHAUS_INTERVALS,
} from "@/lib/reviewScheduler";

interface ReviewWord extends WordWithReviewState {
  dueAt?: string;
}

export default function ReviewPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [allWords, setAllWords] = useState<WordWithReviewState[]>([]);
  const [reviewWords, setReviewWords] = useState<ReviewWord[]>([]);
  const [known, setKnown] = useState<number[]>([]);
  const [unknown, setUnknown] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [isLoading, setIsLoading] = useState(true);
  const [showStatistics, setShowStatistics] = useState(false);

  // Load words and review states on mount
  useEffect(() => {
    loadWordsAndReviewStates();
  }, []);

  const loadWordsAndReviewStates = async () => {
    try {
      // Load all words
      const wordsResponse = await fetch('/words.json');
      const allWordsData: WordWithReviewState[] = await wordsResponse.json();

      // Load review states from localStorage
      const reviewStatesJson = localStorage.getItem('vocabmaster-review-states');
      const reviewStates: Record<number, ReviewState> = reviewStatesJson
        ? JSON.parse(reviewStatesJson)
        : {};

      // Attach review states to words
      const wordsWithStates = allWordsData.map(word => ({
        ...word,
        reviewState: reviewStates[word.id],
      }));

      setAllWords(wordsWithStates);

      // Get words due for review
      const dueWords = getWordsDueForReview(wordsWithStates);
      setReviewWords(dueWords.length > 0 ? dueWords : wordsWithStates.slice(0, 10));
    } catch (error) {
      console.error('Failed to load words:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveReviewState = (wordId: number, reviewState: ReviewState) => {
    try {
      const reviewStatesJson = localStorage.getItem('vocabmaster-review-states');
      const reviewStates: Record<number, ReviewState> = reviewStatesJson
        ? JSON.parse(reviewStatesJson)
        : {};

      reviewStates[wordId] = reviewState;
      localStorage.setItem('vocabmaster-review-states', JSON.stringify(reviewStates));
    } catch (error) {
      console.error('Failed to save review state:', error);
    }
  };

  const currentWord = reviewWords[currentIndex];
  const isLastCard = currentIndex === reviewWords.length - 1;
  const isCompleted = currentIndex >= reviewWords.length;

  // Calculate statistics
  const statistics = getReviewStatistics(allWords);

  // Save study session on unmount
  useEffect(() => {
    return () => {
      saveStudySession();
    };
  }, [known, unknown, currentIndex]);

  const saveStudySession = () => {
    if (typeof window === 'undefined' || known.length + unknown.length === 0) return;

    try {
      const historyJson = localStorage.getItem('vocabmaster-study-history');
      const history = historyJson ? JSON.parse(historyJson) : [];

      const duration = Math.round((Date.now() - startTime) / 1000 / 60); // in minutes
      const today = new Date().toISOString().split('T')[0];

      const session = {
        date: today,
        wordsLearned: known.length,
        wordsReviewed: unknown.length,
        duration: duration,
      };

      history.push(session);
      localStorage.setItem('vocabmaster-study-history', JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save study session:', error);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') {
        return;
      }

      switch(e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          handlePrevious();
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          // Don't allow next if on last card
          if (currentIndex !== reviewWords.length - 1) {
            e.preventDefault();
            handleNext(true);
          }
          break;
        case 's':
        case 'S':
          e.preventDefault();
          speak();
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          handleToggleFavorite(reviewWords[currentIndex]?.id);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, reviewWords]);

  const speak = () => {
    if (currentWord) {
      const utterance = new SpeechSynthesisUtterance(currentWord.word);
      utterance.lang = "en-US";
      speechSynthesis.speak(utterance);
    }
  };

  const handleNext = (isKnown: boolean) => {
    if (!currentWord) return;

    // Calculate next review state based on performance
    const nextReviewState = calculateNextReviewState(currentWord.reviewState, isKnown);
    saveReviewState(currentWord.id, nextReviewState);

    // Update local state
    setAllWords(prevWords =>
      prevWords.map(word =>
        word.id === currentWord.id
          ? { ...word, reviewState: nextReviewState }
          : word
      )
    );
    setReviewWords(prevWords =>
      prevWords.map(word =>
        word.id === currentWord.id
          ? { ...word, reviewState: nextReviewState }
          : word
      )
    );

    if (isKnown) {
      setKnown([...known, currentWord.id]);
    } else {
      setUnknown([...unknown, currentWord.id]);
    }

    if (isLastCard) {
      // Show statistics instead of navigating away
      setShowStatistics(true);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setKnown([]);
    setUnknown([]);
  };

  const handleToggleFavorite = async (wordId: number) => {
    if (!wordId) return;

    const word = reviewWords.find((w: ReviewWord) => w.id === wordId);
    if (!word) return;

    const newFavoriteStatus = !word.isFavorite;

    try {
      if (newFavoriteStatus) {
        // Add to favorites via API
        await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(word)
        });
      } else {
        // Remove from favorites via API
        await fetch(`/api/favorites?id=${wordId}`, { method: 'DELETE' });
      }

      // Update local state
      setReviewWords(reviewWords.map((w: ReviewWord) =>
        w.id === wordId ? { ...w, isFavorite: newFavoriteStatus } : w
      ));
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-lg mx-auto text-center py-20">
        <div className="text-4xl mb-4">📚</div>
        <h2 className="text-2xl font-bold font-display text-primary mb-4">
          加载中...
        </h2>
        <p className="text-gray-600">正在准备复习内容</p>
      </div>
    );
  }

  if (showStatistics) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="clay-card">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold font-display text-primary mb-4">
              复习完成！
            </h2>
            <p className="text-gray-600">
              今天已完成 {known.length + unknown.length} 个单词的复习
            </p>
          </div>

          {/* Session Results */}
          <div className="flex justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{known.length}</div>
              <div className="text-sm text-gray-500">已掌握</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{unknown.length}</div>
              <div className="text-sm text-gray-500">需加强</div>
            </div>
          </div>

          {/* Overall Statistics */}
          <div className="border-t pt-8">
            <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
              <TrendingUp size={24} />
              学习统计
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{statistics.total}</div>
                <div className="text-sm text-gray-600">总词汇</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{statistics.mastered}</div>
                <div className="text-sm text-gray-600">已掌握</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{statistics.inProgress}</div>
                <div className="text-sm text-gray-600">学习中</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{statistics.dueToday}</div>
                <div className="text-sm text-gray-600">今日待复习</div>
              </div>
            </div>

            {/* Ebbinghaus Curve */}
            <div className="mb-8">
              <h4 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
                <Calendar size={20} />
                艾宾浩斯遗忘曲线
              </h4>
              <div className="grid grid-cols-4 gap-2 text-sm">
                {EBBINGHAUS_INTERVALS.map((interval, index) => (
                  <div
                    key={index}
                    className="text-center p-3 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg"
                  >
                    <div className="font-bold text-primary">
                      {interval === 1 ? "1天" :
                       interval === 30 ? "1个月" :
                       interval === 90 ? "3个月" :
                       interval === 180 ? "6个月" :
                       `${interval}天`}
                    </div>
                    <div className="text-xs text-gray-500">
                      第{index + 1}次复习
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Reviews */}
            {Object.keys(statistics.upcoming).length > 0 && (
              <div className="mb-8">
                <h4 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
                  <Clock size={20} />
                  即将到来的复习
                </h4>
                <div className="space-y-2">
                  {Object.entries(statistics.upcoming)
                    .sort(([a], [b]) => parseInt(a) - parseInt(b))
                    .slice(0, 7)
                    .map(([days, count]) => (
                      <div
                        key={days}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                      >
                        <span className="text-gray-700">
                          {days === "1" ? "明天" : `${days}天后`}
                        </span>
                        <span className="font-bold text-primary">{count} 个单词</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              className="clay-btn"
              onClick={() => {
                setShowStatistics(false);
                setCurrentIndex(0);
                setKnown([]);
                setUnknown([]);
                loadWordsAndReviewStates();
              }}
            >
              继续复习
            </button>
            <button
              className="clay-btn-secondary"
              onClick={() => router.push("/")}
            >
              返回首页
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
        >
          <Home size={20} />
          返回首页
        </button>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
        >
          <RotateCcw size={20} />
          重新开始
        </button>
      </div>

      {/* Statistics Summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-lg font-bold text-blue-600">{statistics.dueToday}</div>
          <div className="text-xs text-gray-600">今日待复习</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-lg font-bold text-green-600">{statistics.mastered}</div>
          <div className="text-xs text-gray-600">已掌握</div>
        </div>
        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <div className="text-lg font-bold text-orange-600">{statistics.inProgress}</div>
          <div className="text-xs text-gray-600">学习中</div>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <ProgressBar current={currentIndex + 1} total={reviewWords.length} />
      </div>

      {/* Current Word Review Stage */}
      {currentWord && currentWord.reviewState && (
        <div className="mb-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={20} className="text-primary" />
              <span className="text-sm font-medium text-gray-700">
                {getReviewStageLabel(currentWord.reviewState.currentStage)}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              掌握度: {calculateMasteryPercentage(currentWord.reviewState)}%
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            已复习 {currentWord.reviewState.reviewCount} 次 |
            正确率: {currentWord.reviewState.reviewCount > 0 ? Math.round((currentWord.reviewState.correctCount / currentWord.reviewState.reviewCount) * 100) : 0}%
          </div>
        </div>
      )}

      {/* Flashcard */}
      <div className="mb-6">
        <Flashcard
          word={currentWord}
          currentIndex={currentIndex}
          totalWords={reviewWords.length}
          isLastWord={isLastCard}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onToggleFavorite={handleToggleFavorite}
        />
      </div>

      {/* Stats */}
      <div className="flex justify-center gap-8">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{known.length}</div>
          <div className="text-sm text-gray-500">已掌握</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">{unknown.length}</div>
          <div className="text-sm text-gray-500">需加强</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{reviewWords.length - currentIndex}</div>
          <div className="text-sm text-gray-500">剩余</div>
        </div>
      </div>
    </div>
  );
}
