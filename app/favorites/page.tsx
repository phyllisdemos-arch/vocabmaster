"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Star, Search, Volume2, Home } from "lucide-react";
import ClayCard from "@/components/ClayCard";
import ClayButton from "@/components/ClayButton";

const filterOptions = ["全部", "难记", "高频", "考试", "优美"];

interface Word {
  id: number;
  word: string;
  pronunciation: string;
  definition: string;
  partOfSpeech: string;
  example: string;
  tags?: string[];
  isFavorite?: boolean;
}

export default function FavoritesPage() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState("全部");
  const [searchQuery, setSearchQuery] = useState("");
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);

  // Load favorites from API on mount
  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await fetch('/api/favorites');
      const favorites = await response.json();
      setWords(favorites);
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredWords = words.filter((word) => {
    const matchesFilter = selectedFilter === "全部" || (word.tags && word.tags.includes(selectedFilter));
    const matchesSearch = word.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         word.definition.includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  const handleToggleFavorite = async (wordId: number) => {
    try {
      await fetch(`/api/favorites?id=${wordId}`, { method: 'DELETE' });
      // Update local state
      setWords(words.filter(w => w.id !== wordId));
    } catch (error) {
      console.error('Failed to remove favorite:', error);
    }
  };

  const speak = (word: string) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  };

  const handleStartLearning = async () => {
    // Store favorite words for learning
    try {
      const response = await fetch('/api/favorites');
      const favorites = await response.json();

      if (typeof window !== 'undefined') {
        localStorage.setItem('vocabmaster-learn-words', JSON.stringify(filteredWords));
      }
      router.push('/learn?source=favorites');
    } catch (error) {
      console.error('Failed to start learning:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.push("/")}
          className="text-gray-600 hover:text-primary transition-colors mb-4 inline-flex items-center gap-2"
        >
          <Home size={18} />
          返回首页
        </button>

        <div className="text-center">
          <h1 className="text-4xl font-bold font-display text-primary mb-4">
            我的收藏
          </h1>
          <p className="text-gray-600">
            共 <span className="font-bold text-primary">{words.length}</span> 个收藏单词
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg">加载中...</div>
        </div>
      ) : words.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⭐</div>
          <p className="text-gray-500 mb-4">还没有收藏的单词</p>
          <ClayButton onClick={() => router.push("/")}>
            去添加收藏
          </ClayButton>
        </div>
      ) : (
        <>
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="搜索单词或释义..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="clay-input pl-12"
              />
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {filterOptions.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
                  selectedFilter === filter
                    ? "bg-gradient-to-r from-primary to-primary-light text-white shadow-clay-sm"
                    : "bg-white text-gray-600 hover:shadow-clay-sm"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Words Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWords.map((word) => (
              <ClayCard key={word.id} className="h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold font-display text-primary mb-1">
                      {word.word}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">{word.pronunciation}</p>
                    <p className="text-gray-700">{word.definition}</p>
                  </div>
                  <button
                    onClick={() => handleToggleFavorite(word.id)}
                    className="p-2 rounded-lg bg-yellow-100 hover:bg-yellow-200 transition-colors"
                    title="取消收藏"
                  >
                    <Star className="text-yellow-500 fill-yellow-500" size={20} />
                  </button>
                </div>

                {/* Tags */}
                {word.tags && word.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {word.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 rounded-full bg-blue-100 text-primary text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => speak(word.word)}
                    className="flex-1 py-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors text-primary text-sm font-medium flex items-center justify-center gap-1"
                  >
                    <Volume2 size={16} />
                    发音
                  </button>
                  <button
                    onClick={handleStartLearning}
                    className="flex-1 py-2 rounded-lg bg-gradient-to-r from-primary to-primary-light text-white text-sm font-medium hover:shadow-clay-sm transition-all"
                  >
                    开始学习
                  </button>
                </div>
              </ClayCard>
            ))}
          </div>

          {filteredWords.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-500">没有找到匹配的单词</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
