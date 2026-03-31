"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Search, Volume2 } from "lucide-react";
import ClayCard from "@/components/ClayCard";

const favoriteWords = [
  { id: 1, word: "ephemeral", pronunciation: "/əˈfemərəl/", definition: "短暂的", tags: ["难记", "高频"], isFavorite: true },
  { id: 2, word: "serendipity", pronunciation: "/ˌserənˈdɪpəti/", definition: "意外发现", tags: ["优美", "考试"], isFavorite: true },
  { id: 3, word: "ubiquitous", pronunciation: "/juːˈbɪkwɪtəs/", definition: "无处不在的", tags: ["高级"], isFavorite: true },
  { id: 4, word: "eloquent", pronunciation: "/ˈeləkwənt/", definition: "雄辩的", tags: ["写作"], isFavorite: true },
  { id: 5, word: "pragmatic", pronunciation: "/præɡˈmætɪk/", definition: "务实的", tags: ["商务"], isFavorite: true },
];

const filterOptions = ["全部", "难记", "高频", "考试", "优美"];

export default function FavoritesPage() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState("全部");
  const [searchQuery, setSearchQuery] = useState("");
  const [words, setWords] = useState(favoriteWords);

  const filteredWords = words.filter((word) => {
    const matchesFilter = selectedFilter === "全部" || word.tags.includes(selectedFilter);
    const matchesSearch = word.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         word.definition.includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  const handleToggleFavorite = (wordId: number) => {
    setWords(words.map(w =>
      w.id === wordId ? { ...w, isFavorite: !w.isFavorite } : w
    ));
  };

  const speak = (word: string) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  };

  const handleStartLearning = () => {
    // Store favorite words in localStorage
    const wordsToLearn = filteredWords.map(w => ({
      id: w.id,
      word: w.word,
      pronunciation: w.pronunciation,
      definition: w.definition,
      partOfSpeech: "n.",
      example: `${w.word} is a useful word.`,
      isFavorite: w.isFavorite,
    }));
    localStorage.setItem('vocabmaster-learn-words', JSON.stringify(wordsToLearn));
    router.push('/learn?source=favorites');
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-display text-primary mb-4">
          我的收藏
        </h1>
        <p className="text-gray-600">
          共 <span className="font-bold text-primary">{words.length}</span> 个收藏单词
        </p>
      </div>

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
                className={`p-2 rounded-lg transition-colors ${
                  word.isFavorite ? "bg-yellow-100" : "bg-gray-100"
                }`}
              >
                <Star
                  className={word.isFavorite ? "text-yellow-500 fill-yellow-500" : "text-gray-400"}
                  size={20}
                />
              </button>
            </div>

            {/* Tags */}
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
    </div>
  );
}
