"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Flashcard from "@/components/Flashcard";
import ProgressBar from "@/components/ProgressBar";
import { RotateCcw, Home } from "lucide-react";

export default function LearnPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [known, setKnown] = useState<number[]>([]);
  const [unknown, setUnknown] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<number>(Date.now());

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
      const unit = searchParams.get('unit');

      const session = {
        date: today,
        unitId: unit || 'all', // Track which unit was studied
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

  // Check if learning from favorites or unit
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const source = searchParams.get('source');
      const unit = searchParams.get('unit');

      if (source === 'favorites' || unit) {
        const storedWords = localStorage.getItem('vocabmaster-learn-words');
        if (storedWords) {
          const parsedWords = JSON.parse(storedWords);
          setWords(parsedWords);
          setLoading(false);
          // Clear localStorage after loading
          localStorage.removeItem('vocabmaster-learn-words');
        } else {
          setLoading(false);
        }
      } else {
        // Load words from API
        fetch('/words.json')
          .then(res => res.json())
          .then(data => setWords(data))
          .catch(err => console.error('Failed to load words:', err))
          .finally(() => setLoading(false));
      }
    }
  }, [searchParams]);

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
          if (currentIndex !== words.length - 1) {
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
          handleToggleFavorite(words[currentIndex]?.id);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, words]);

  const currentWord = words[currentIndex];
  const isLastCard = currentIndex === words.length - 1;

  const speak = () => {
    if (currentWord) {
      const utterance = new SpeechSynthesisUtterance(currentWord.word);
      utterance.lang = "en-US";
      speechSynthesis.speak(utterance);
    }
  };

  const handleNext = (isKnown: boolean) => {
    if (isKnown) {
      setKnown([...known, currentWord.id]);
    } else {
      setUnknown([...unknown, currentWord.id]);
    }

    if (isLastCard) {
      // Navigate to results
      router.push("/learn/results");
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

    const word = words.find((w: any) => w.id === wordId);
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
      setWords(words.map((w: any) =>
        w.id === wordId ? { ...w, isFavorite: newFavoriteStatus } : w
      ));
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg">加载中...</div>
        </div>
      ) : words.length === 0 ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-6xl mb-4">📚</div>
            <p className="text-gray-500">没有单词可学习</p>
          </div>
        </div>
      ) : (
        <>
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

          {/* Progress */}
          <div className="mb-8">
            <ProgressBar current={currentIndex + 1} total={words.length} />
          </div>

          {/* Flashcard */}
          <div className="mb-8">
            <Flashcard
              word={currentWord}
              currentIndex={currentIndex}
              totalWords={words.length}
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
              <div className="text-sm text-gray-500">已认识</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{unknown.length}</div>
              <div className="text-sm text-gray-500">需复习</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{words.length - currentIndex}</div>
              <div className="text-sm text-gray-500">剩余</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
