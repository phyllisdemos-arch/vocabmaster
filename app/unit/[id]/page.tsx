"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ClayCard from "@/components/ClayCard";
import ClayButton from "@/components/ClayButton";
import { BookOpen, Volume2, Star } from "lucide-react";

// Sample unit data
const unitData: Record<string, any> = {
  "1": {
    id: 1,
    name: "Unit 1: 日常问候",
    icon: "👋",
    totalWords: 30,
    learnedWords: 25,
    words: [
      { id: 1, word: "hello", pronunciation: "/həˈloʊ/", definition: "问候", partOfSpeech: "n.", example: "Hello, how are you?", isLearned: true, isFavorite: false },
      { id: 2, word: "goodbye", pronunciation: "/ɡʊdˈbaɪ/", definition: "再见", partOfSpeech: "n.", example: "Goodbye, see you tomorrow.", isLearned: true, isFavorite: false },
      { id: 3, word: "welcome", pronunciation: "/ˈwelkəm/", definition: "欢迎", partOfSpeech: "v.", example: "Welcome to our home!", isLearned: true, isFavorite: true },
      { id: 4, word: "morning", pronunciation: "/ˈmɔːrnɪŋ/", definition: "早晨", partOfSpeech: "n.", example: "Good morning!", isLearned: false, isFavorite: false },
      { id: 5, word: "evening", pronunciation: "/ˈiːvnɪŋ/", definition: "傍晚", partOfSpeech: "n.", example: "Good evening!", isLearned: false, isFavorite: false },
    ],
  },
};

export default function UnitPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const unit = unitData[params.id];

  const [words, setWords] = useState(unit?.words || []);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  if (!unit) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">单元不存在</h2>
        <ClayButton onClick={() => router.push("/")}>返回首页</ClayButton>
      </div>
    );
  }

  const speak = (word: string) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  };

  const toggleFavorite = (wordId: number) => {
    setWords(words.map(w =>
      w.id === wordId ? { ...w, isFavorite: !w.isFavorite } : w
    ));
  };

  const startLearning = () => {
    router.push("/learn");
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.push("/")}
          className="text-gray-600 hover:text-primary transition-colors mb-4 inline-flex items-center gap-2"
        >
          ← 返回单元列表
        </button>

        <ClayCard>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-5xl">{unit.icon}</div>
              <div>
                <h1 className="text-3xl font-bold font-display text-gray-800 mb-2">
                  {unit.name}
                </h1>
                <p className="text-gray-600">
                  {unit.learnedWords}/{unit.totalWords} 个单词
                </p>
              </div>
            </div>

            <ClayButton onClick={startLearning}>
              <BookOpen size={20} className="inline mr-2" />
              开始学习
            </ClayButton>
          </div>

          {/* Progress */}
          <div className="mt-6">
            <div className="progress-bar h-3">
              <div
                className="progress-fill"
                style={{ width: `${(unit.learnedWords / unit.totalWords) * 100}%` }}
              />
            </div>
          </div>
        </ClayCard>
      </div>

      {/* Words Grid */}
      <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
        {words.map((word: any) => (
          <ClayCard key={word.id} className={viewMode === "list" ? "flex items-center justify-between" : ""}>
            <div className={viewMode === "list" ? "flex items-center gap-4 flex-1" : ""}>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold font-display text-primary">
                    {word.word}
                  </h3>
                  {word.isLearned && (
                    <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs">
                      已掌握
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mb-1">{word.pronunciation}</p>
                <p className="text-gray-700">
                  <span className="text-blue-600 font-medium">{word.partOfSpeech}</span> {word.definition}
                </p>
                <p className="text-sm text-gray-500 italic mt-2">&quot;{word.example}&quot;</p>
              </div>
            </div>

            <div className={`flex gap-2 mt-4 ${viewMode === "list" ? "mt-0" : ""}`}>
              <button
                onClick={() => speak(word.word)}
                className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors"
              >
                <Volume2 className="text-primary" size={18} />
              </button>
              <button
                onClick={() => toggleFavorite(word.id)}
                className={`p-2 rounded-lg transition-colors ${
                  word.isFavorite ? "bg-yellow-100" : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                <Star
                  className={word.isFavorite ? "text-yellow-500 fill-yellow-500" : "text-gray-400"}
                  size={18}
                />
              </button>
            </div>
          </ClayCard>
        ))}
      </div>

      {/* Empty State */}
      {words.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <p className="text-gray-500">暂无单词</p>
        </div>
      )}
    </div>
  );
}
