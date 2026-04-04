"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, Home, RotateCcw, BookOpen } from "lucide-react";
import ClayCard from "@/components/ClayCard";
import { getLearnedWords, saveTestResult, TestResult, getLearnedWordsCount } from "@/lib/testResults";

interface Word {
  id: number;
  word: string;
  definition: string;
}

export default function MatchingTestPage() {
  const router = useRouter();
  const [wordsData, setWordsData] = useState<Word[]>([]);
  const [shuffledWords, setShuffledWords] = useState<{
    words: Word[];
    definitions: Array<{ id: number; definition: string }>;
  }>({ words: [], definitions: [] });
  const [selectedWord, setSelectedWord] = useState<number | null>(null);
  const [selectedDefinition, setSelectedDefinition] = useState<number | null>(null);
  const [matches, setMatches] = useState<Array<{ wordId: number; definitionId: number }>>([]);
  const [attempts, setAttempts] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [learnedWordsCount, setLearnedWordsCount] = useState<number>(0);

  useEffect(() => {
    loadWords();
  }, []);

  const loadWords = async () => {
    try {
      // Get count of learned words first
      const count = await getLearnedWordsCount();
      setLearnedWordsCount(count);

      // Load 5 learned words for matching test
      const testWords = await getLearnedWords(5);
      setWordsData(testWords);

      // Shuffle words and definitions
      const words = [...testWords];
      const definitions = testWords.map((w) => ({ id: w.id, definition: w.definition }));
      setShuffledWords({
        words: words.sort(() => Math.random() - 0.5),
        definitions: definitions.sort(() => Math.random() - 0.5),
      });

      setStartTime(Date.now());
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load words:', error);
      setIsLoading(false);
    }
  };

  const handleWordClick = (id: number) => {
    if (matches.some((m) => m.wordId === id)) return;
    setSelectedWord(id);
    checkMatch(id, selectedDefinition);
  };

  const handleDefinitionClick = (id: number) => {
    if (matches.some((m) => m.definitionId === id)) return;
    setSelectedDefinition(id);
    checkMatch(selectedWord, id);
  };

  const checkMatch = (wordId: number | null, definitionId: number | null) => {
    if (wordId === null || definitionId === null) return;

    setAttempts(attempts + 1);

    if (wordId === definitionId) {
      // Correct match
      const newMatches = [...matches, { wordId, definitionId }];
      setMatches(newMatches);
      setSelectedWord(null);
      setSelectedDefinition(null);

      // Check if all matched
      if (newMatches.length === wordsData.length) {
        setTimeout(() => {
          setIsFinished(true);
          saveTestResultForMatching(newMatches);
        }, 500);
      }
    } else {
      // Wrong match - reset after delay
      setTimeout(() => {
        setSelectedWord(null);
        setSelectedDefinition(null);
      }, 1000);
    }
  };

  const saveTestResultForMatching = (finalMatches: Array<{ wordId: number; definitionId: number }>) => {
    const correctMatches = finalMatches.length;
    const duration = Math.round((Date.now() - startTime) / 1000);
    const wordResults = wordsData.map(word => ({
      wordId: word.id,
      word: word.word,
      correct: finalMatches.some(m => m.wordId === word.id),
    }));

    const result: TestResult = {
      testType: 'matching',
      date: new Date().toISOString(),
      totalQuestions: wordsData.length,
      correctAnswers: correctMatches,
      accuracy: Math.round((correctMatches / wordsData.length) * 100),
      duration,
      wordResults,
    };

    saveTestResult(result);
  };

  const handleRestart = () => {
    setIsLoading(true);
    loadWords();
    setSelectedWord(null);
    setSelectedDefinition(null);
    setMatches([]);
    setAttempts(0);
    setIsFinished(false);
  };

  if (isFinished) {
    const correctMatches = matches.length;
    const accuracy = Math.round((correctMatches / wordsData.length) * 100);

    return (
      <div className="max-w-4xl mx-auto">
        <ClayCard>
          <div className="text-center">
            <div className="text-6xl mb-4">
              {accuracy === 100 ? "🎉" : accuracy >= 80 ? "👍" : "💪"}
            </div>
            <h2 className="text-3xl font-bold font-display text-primary mb-4">
              连线匹配完成！
            </h2>
            <div className="text-6xl font-bold text-accent-green mb-4">
              {correctMatches}/{wordsData.length}
            </div>
            <p className="text-gray-600 mb-6">
              准确率: <span className="font-bold text-primary">{accuracy}%</span>
            </p>

            <p className="text-sm text-gray-500 mb-6">
              ✓ 测试结果已保存到复习系统
            </p>

            <div className="bg-blue-50 rounded-2xl p-6 mb-6 text-left">
              <h3 className="font-bold text-lg mb-4">配对结果</h3>
              {wordsData.map((word) => {
                const match = matches.find((m) => m.wordId === word.id);
                const isCorrect = match !== undefined;
                return (
                  <div key={word.id} className="flex items-center justify-between py-3 border-b last:border-0">
                    <div className="flex-1">
                      <p className="font-medium">{word.word}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {isCorrect ? (
                        <>
                          <span className="text-gray-400">→</span>
                          <p className="text-gray-600">{word.definition}</p>
                          <CheckCircle className="text-green-500" size={20} />
                        </>
                      ) : (
                        <XCircle className="text-red-500" size={20} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={handleRestart}
                className="clay-btn clay-btn-orange flex items-center gap-2"
              >
                <RotateCcw size={20} />
                重新测试
              </button>
              <button
                onClick={() => router.push("/test")}
                className="clay-btn flex items-center gap-2"
              >
                <Home size={20} />
                返回测试选择
              </button>
            </div>
          </div>
        </ClayCard>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="text-4xl mb-4">📝</div>
        <h2 className="text-2xl font-bold font-display text-primary mb-4">
          加载中...
        </h2>
        <p className="text-gray-600">正在准备匹配测试</p>
      </div>
    );
  }

  if (wordsData.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="text-6xl mb-4">📚</div>
        <h2 className="text-2xl font-bold font-display text-primary mb-4">
          还没有学习记录
        </h2>
        <p className="text-gray-600 mb-6">
          你需要先在复习页面学习一些单词，才能开始匹配测试
        </p>
        <div className="bg-blue-50 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-700">
            <BookOpen size={18} />
            <span>已学习单词: {learnedWordsCount} 个</span>
          </div>
        </div>
        <button
          onClick={() => router.push("/review")}
          className="clay-btn"
        >
          去学习单词
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.push("/test")}
          className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
        >
          <Home size={20} />
          返回
        </button>
        <div className="text-sm text-gray-500">
          已配对: {matches.length} / {wordsData.length} | 尝试: {attempts}
        </div>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${(matches.length / wordsData.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Learned Words Info */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-700">
          <BookOpen size={18} className="text-primary" />
          <span>从 <span className="font-bold">{learnedWordsCount}</span> 个已学习单词中随机选择</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Words Column */}
        <ClayCard>
          <h3 className="text-xl font-bold font-display text-gray-800 mb-4 text-center">
            英文单词
          </h3>
          <div className="space-y-3">
            {shuffledWords.words.map((item) => {
              const isMatched = matches.some((m) => m.wordId === item.id);
              const isSelected = selectedWord === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleWordClick(item.id)}
                  disabled={isMatched}
                  className={`w-full p-4 rounded-xl text-left font-medium transition-all ${
                    isMatched
                      ? "bg-green-100 text-green-700 cursor-not-allowed opacity-60"
                      : isSelected
                      ? "bg-blue-100 border-2 border-primary"
                      : "bg-white border-2 border-gray-200 hover:border-primary hover:bg-blue-50"
                  }`}
                >
                  {item.word}
                </button>
              );
            })}
          </div>
        </ClayCard>

        {/* Definitions Column */}
        <ClayCard>
          <h3 className="text-xl font-bold font-display text-gray-800 mb-4 text-center">
            中文释义
          </h3>
          <div className="space-y-3">
            {shuffledWords.definitions.map((item) => {
              const isMatched = matches.some((m) => m.definitionId === item.id);
              const isSelected = selectedDefinition === item.id;
              const isWrongMatch =
                selectedWord !== null &&
                selectedDefinition === item.id &&
                selectedWord !== item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleDefinitionClick(item.id)}
                  disabled={isMatched}
                  className={`w-full p-4 rounded-xl text-left font-medium transition-all ${
                    isMatched
                      ? "bg-green-100 text-green-700 cursor-not-allowed opacity-60"
                      : isWrongMatch
                      ? "bg-red-100 border-2 border-red-500"
                      : isSelected
                      ? "bg-blue-100 border-2 border-primary"
                      : "bg-white border-2 border-gray-200 hover:border-primary hover:bg-blue-50"
                  }`}
                >
                  {item.definition}
                </button>
              );
            })}
          </div>
        </ClayCard>
      </div>

      {/* Instructions */}
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>点击左侧单词，再点击右侧对应的释义进行配对</p>
      </div>
    </div>
  );
}
