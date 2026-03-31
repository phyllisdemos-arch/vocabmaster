"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Flashcard from "@/components/Flashcard";
import ProgressBar from "@/components/ProgressBar";
import { RotateCcw, Home } from "lucide-react";

// Sample words data
const sampleWords = [
  {
    id: 1,
    word: "ephemeral",
    pronunciation: "/əˈfemərəl/",
    definition: "短暂的，转瞬即逝的",
    partOfSpeech: "adj.",
    example: "Fashion is ephemeral, changing with every season.",
    isFavorite: false,
  },
  {
    id: 2,
    word: "serendipity",
    pronunciation: "/ˌserənˈdɪpəti/",
    definition: "意外发现珍奇事物的运气",
    partOfSpeech: "n.",
    example: "Meeting my best friend was pure serendipity.",
    isFavorite: true,
  },
  {
    id: 3,
    word: "eloquent",
    pronunciation: "/ˈeləkwənt/",
    definition: "雄辩的，有说服力的",
    partOfSpeech: "adj.",
    example: "She gave an eloquent speech that moved everyone.",
    isFavorite: false,
  },
  {
    id: 4,
    word: "resilient",
    pronunciation: "/rɪˈzɪliənt/",
    definition: "有弹性的，能恢复的",
    partOfSpeech: "adj.",
    example: "Children are often more resilient than adults.",
    isFavorite: false,
  },
  {
    id: 5,
    word: "ubiquitous",
    pronunciation: "/juːˈbɪkwɪtəs/",
    definition: "无处不在的",
    partOfSpeech: "adj.",
    example: "Smartphones have become ubiquitous in modern life.",
    isFavorite: false,
  },
];

export default function LearnPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [words, setWords] = useState(sampleWords);
  const [known, setKnown] = useState<number[]>([]);
  const [unknown, setUnknown] = useState<number[]>([]);

  // Check if learning from favorites
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const source = searchParams.get('source');
      if (source === 'favorites') {
        const storedWords = localStorage.getItem('vocabmaster-learn-words');
        if (storedWords) {
          const parsedWords = JSON.parse(storedWords);
          setWords(parsedWords);
          // Clear localStorage after loading
          localStorage.removeItem('vocabmaster-learn-words');
        }
      }
    }
  }, [searchParams]);

  const currentWord = words[currentIndex];
  const isLastCard = currentIndex === words.length - 1;

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

  const handleReset = () => {
    setCurrentIndex(0);
    setKnown([]);
    setUnknown([]);
  };

  const handleToggleFavorite = (wordId: number) => {
    setWords(words.map(w =>
      w.id === wordId ? { ...w, isFavorite: !w.isFavorite } : w
    ));
  };

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

      {/* Progress */}
      <div className="mb-8">
        <ProgressBar current={currentIndex + 1} total={words.length} />
      </div>

      {/* Flashcard */}
      <div className="mb-8">
        <Flashcard
          word={currentWord}
          onNext={handleNext}
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
    </div>
  );
}
