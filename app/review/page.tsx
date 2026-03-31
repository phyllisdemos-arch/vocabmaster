"use client";

import { useState } from "react";
import Flashcard from "@/components/Flashcard";
import { Clock } from "lucide-react";

interface ReviewWord {
  id: number;
  word: string;
  pronunciation: string;
  definition: string;
  partOfSpeech: string;
  example: string;
  dueAt: string;
}

const reviewWords: ReviewWord[] = [
  {
    id: 1,
    word: "ephemeral",
    pronunciation: "/əˈfemərəl/",
    definition: "短暂的，转瞬即逝的",
    partOfSpeech: "adj.",
    example: "Fashion is ephemeral, changing with every season.",
    dueAt: "now",
  },
  {
    id: 2,
    word: "serendipity",
    pronunciation: "/ˌserənˈdɪpəti/",
    definition: "意外发现珍奇事物的运气",
    partOfSpeech: "n.",
    example: "Meeting my best friend was pure serendipity.",
    dueAt: "now",
  },
  {
    id: 3,
    word: "eloquent",
    pronunciation: "/ˈeləkwənt/",
    definition: "雄辩的，有说服力的",
    partOfSpeech: "adj.",
    example: "She gave an eloquent speech that moved everyone.",
    dueAt: "now",
  },
];

const SM2_INTERVALS = [1, 10, 30, 60, 120, 240]; // minutes

export default function ReviewPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showRating, setShowRating] = useState(false);
  const [completed, setCompleted] = useState<number[]>([]);

  const currentWord = reviewWords[currentIndex];
  const isCompleted = currentIndex >= reviewWords.length;

  const handleFlip = () => {
    setShowRating(true);
  };

  const handleRate = (rating: number) => {
    // Simplified SM-2 algorithm
    // rating: 1=forget, 2=hard, 3=good, 4=easy
    setCompleted([...completed, currentWord.id]);
    setShowRating(false);

    setTimeout(() => {
      if (currentIndex < reviewWords.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    }, 300);
  };

  if (isCompleted) {
    return (
      <div className="max-w-lg mx-auto text-center">
        <div className="clay-card">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold font-display text-primary mb-4">
            复习完成！
          </h2>
          <p className="text-gray-600 mb-6">
            今天已完成 {completed.length} 个单词的复习
          </p>
          <button className="clay-btn" onClick={() => window.location.reload()}>
            继续学习
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-primary mb-4">
          <Clock size={18} />
          <span className="font-medium">今日待复习: {reviewWords.length - currentIndex} 个</span>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">复习进度</span>
          <span className="text-sm font-bold text-primary">
            {currentIndex}/{reviewWords.length}
          </span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(currentIndex / reviewWords.length) * 100}%` }} />
        </div>
      </div>

      {/* Flashcard */}
      <div className="mb-8">
        <div className="flashcard-container">
          <div
            className={`flashcard relative w-full h-96 ${showRating ? "flipped" : ""}`}
            onClick={handleFlip}
          >
            {/* Front */}
            <div className="flashcard-face absolute inset-0 clay-card flex flex-col items-center justify-center p-8">
              <div className="text-6xl mb-4">🔄</div>
              <h2 className="text-4xl font-bold font-display text-primary mb-2">
                {currentWord.word}
              </h2>
              <p className="text-xl text-gray-500 mb-6">{currentWord.pronunciation}</p>
              <p className="text-gray-400 text-sm">点击卡片查看答案</p>
            </div>

            {/* Back */}
            <div className="flashcard-face flashcard-back absolute inset-0 clay-card flex flex-col items-center justify-center p-8">
              <div className="w-full">
                <div className="text-center mb-6">
                  <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-primary text-sm font-medium mb-2">
                    {currentWord.partOfSpeech}
                  </span>
                  <p className="text-2xl font-semibold text-gray-800">
                    {currentWord.definition}
                  </p>
                </div>

                <div className="bg-blue-50 rounded-2xl p-4 mb-6">
                  <p className="text-sm text-gray-500 mb-1">例句</p>
                  <p className="text-gray-700 italic">&quot;{currentWord.example}&quot;</p>
                </div>

                {/* Rating Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRate(1);
                    }}
                    className="py-3 px-4 rounded-xl bg-red-100 hover:bg-red-200 transition-colors text-red-700 font-medium"
                  >
                    😞 完全忘记
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRate(2);
                    }}
                    className="py-3 px-4 rounded-xl bg-orange-100 hover:bg-orange-200 transition-colors text-orange-700 font-medium"
                  >
                    🤔 有点印象
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRate(3);
                    }}
                    className="py-3 px-4 rounded-xl bg-green-100 hover:bg-green-200 transition-colors text-green-700 font-medium"
                  >
                    😊 记住了
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRate(4);
                    }}
                    className="py-3 px-4 rounded-xl bg-blue-100 hover:bg-blue-200 transition-colors text-blue-700 font-medium"
                  >
                    🎯 轻松掌握
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="text-center text-sm text-gray-500">
        <p>根据记忆程度选择评分，系统会自动安排下次复习时间</p>
      </div>
    </div>
  );
}
