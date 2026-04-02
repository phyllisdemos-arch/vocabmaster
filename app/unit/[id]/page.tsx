"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import ClayCard from "@/components/ClayCard";
import ClayButton from "@/components/ClayButton";
import { BookOpen, Volume2, Star } from "lucide-react";

export default function UnitPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [unitData, setUnitData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [words, setWords] = useState([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Load unit data
  useEffect(() => {
    fetch('/unitData.json')
      .then(res => res.json())
      .then(data => setUnitData(data))
      .catch(err => console.error('Failed to load unit data:', err))
      .finally(() => setLoading(false));
  }, []);

  // Update words when unit data loads and sync favorites
  useEffect(() => {
    const unit = unitData[id];
    if (unit) {
      const unitWords = (unit.words || []).map((w: any, index: number) => ({
        ...w,
        id: w.id || `${id}-${index}` // Generate unique ID if not exists
      }));

      // Fetch favorites from API and sync status
      fetch('/api/favorites')
        .then(res => res.json())
        .then(favorites => {
          const favoriteIds = new Set(favorites.map((f: any) => f.id));

          // Update words with favorite status
          const updatedWords = unitWords.map((w: any) => ({
            ...w,
            isFavorite: favoriteIds.has(w.id)
          }));

          setWords(updatedWords);
        })
        .catch(err => {
          console.error('Failed to fetch favorites:', err);
          setWords(unitWords);
        });
    }
  }, [unitData, id]);

  const unit = unitData[id];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">加载中...</div>
      </div>
    );
  }

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

  const toggleFavorite = async (wordId: number) => {
    const word = words.find((w: any) => w.id === wordId);
    if (!word) {
      console.error('Word not found for id:', wordId);
      return;
    }

    console.log('Toggling favorite for word:', word);
    const newFavoriteStatus = !word.isFavorite;

    try {
      if (newFavoriteStatus) {
        // Add to favorites via API
        console.log('Adding to favorites:', word);
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(word)
        });

        if (!response.ok) {
          const error = await response.json();
          console.error('Failed to add favorite:', error);
          return;
        }

        const result = await response.json();
        console.log('Add favorite response:', result);
      } else {
        // Remove from favorites via API
        console.log('Removing from favorites, id:', word.id);
        const response = await fetch(`/api/favorites?id=${wordId}`, { method: 'DELETE' });

        if (!response.ok) {
          const error = await response.json();
          console.error('Failed to remove favorite:', error);
          return;
        }

        const result = await response.json();
        console.log('Remove favorite response:', result);
      }

      // Update local state
      setWords(words.map((w: any) =>
        w.id === wordId ? { ...w, isFavorite: newFavoriteStatus } : w
      ));
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const startLearning = () => {
    // Store current unit's words in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('vocabmaster-learn-words', JSON.stringify(words));
    }
    router.push(`/learn?unit=${id}`);
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
