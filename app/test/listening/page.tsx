"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Volume2, CheckCircle, XCircle, Home, RotateCcw, BookOpen } from "lucide-react";
import ClayCard from "@/components/ClayCard";
import { getLearnedWords, saveTestResult, TestResult, getLearnedWordsCount } from "@/lib/testResults";

interface Word {
  id: number;
  word: string;
  pronunciation: string;
  definition: string;
}

export default function ListeningTestPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [wordsData, setWordsData] = useState<Word[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [hasPlayed, setHasPlayed] = useState(false);
  const [results, setResults] = useState<{ word: string; correct: boolean; userAnswer: string }[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [learnedWordsCount, setLearnedWordsCount] = useState<number>(0);

  useEffect(() => {
    loadWords();
  }, []);

  // Auto-focus input when word changes
  useEffect(() => {
    if (!isLoading && !isFinished && wordsData.length > 0 && hasPlayed && !showResult) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isLoading, currentWordIndex, hasPlayed, showResult, isFinished, wordsData.length]);

  const loadWords = async () => {
    try {
      // Get count of learned words first
      const count = await getLearnedWordsCount();
      setLearnedWordsCount(count);

      // Load learned words for testing
      const testWords = await getLearnedWords(5);

      setWordsData(testWords);
      setStartTime(Date.now());
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load words:', error);
      setIsLoading(false);
    }
  };

  const currentWord = wordsData[currentWordIndex];
  const progress = wordsData.length > 0 ? ((currentWordIndex + 1) / wordsData.length) * 100 : 0;

  const handleSpeak = () => {
    if (!currentWord) return;
    const utterance = new SpeechSynthesisUtterance(currentWord.word);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    speechSynthesis.speak(utterance);
    setHasPlayed(true);
  };

  const handleSubmit = () => {
    if (!currentWord) return;

    const isCorrect = userInput.toLowerCase().trim() === currentWord.word.toLowerCase();

    setResults([
      ...results,
      {
        word: currentWord.word,
        correct: isCorrect,
        userAnswer: userInput,
      },
    ]);

    setShowResult(true);

    setTimeout(() => {
      setUserInput("");
      setHasPlayed(false);
      setShowResult(false);

      if (currentWordIndex < wordsData.length - 1) {
        setCurrentWordIndex(currentWordIndex + 1);
      } else {
        finishTest();
      }
    }, 2500);
  };

  const finishTest = () => {
    setIsFinished(true);

    // Save test result
    const duration = Math.round((Date.now() - startTime) / 1000);
    const correctCount = results.filter(r => r.correct).length;
    const wordResults = results.map(r => ({
      wordId: wordsData.find(w => w.word === r.word)?.id || 0,
      word: r.word,
      correct: r.correct,
    }));

    const result: TestResult = {
      testType: 'listening',
      date: new Date().toISOString(),
      totalQuestions: wordsData.length,
      correctAnswers: correctCount,
      accuracy: Math.round((correctCount / wordsData.length) * 100),
      duration,
      wordResults,
    };

    saveTestResult(result);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !showResult && userInput.trim() && hasPlayed) {
      handleSubmit();
    }
  };

  const handleRestart = () => {
    setCurrentWordIndex(0);
    setUserInput("");
    setHasPlayed(false);
    setResults([]);
    setShowResult(false);
    setIsFinished(false);
    setIsLoading(true);
    loadWords();
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="text-4xl mb-4">🎧</div>
        <h2 className="text-2xl font-bold font-display text-primary mb-4">
          加载中...
        </h2>
        <p className="text-gray-600">正在准备测试题目</p>
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
          你需要先在复习页面学习一些单词，才能开始测试
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

  if (isFinished) {
    const correctCount = results.filter((r) => r.correct).length;
    const percentage = Math.round((correctCount / wordsData.length) * 100);

    return (
      <div className="max-w-2xl mx-auto">
        <ClayCard>
          <div className="text-center">
            <div className="text-6xl mb-4">
              {percentage >= 80 ? "🎉" : percentage >= 60 ? "👍" : "💪"}
            </div>
            <h2 className="text-3xl font-bold font-display text-primary mb-4">
              听力测试完成！
            </h2>
            <div className="text-6xl font-bold text-accent-green mb-4">
              {correctCount}/{wordsData.length}
            </div>
            <p className="text-gray-600 mb-6">
              正确率: <span className="font-bold text-primary">{percentage}%</span>
            </p>

            <div className="bg-blue-50 rounded-2xl p-6 mb-6 text-left">
              <h3 className="font-bold text-lg mb-4">答题详情</h3>
              <div className="max-h-64 overflow-y-auto">
                {results.map((result, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b last:border-0">
                    <div>
                      <p className="font-medium">{result.word}</p>
                      <p className="text-sm text-gray-500">你的答案: {result.userAnswer}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {result.correct ? (
                        <CheckCircle className="text-green-500" size={24} />
                      ) : (
                        <XCircle className="text-red-500" size={24} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-sm text-gray-500 mb-6">
              ✓ 测试结果已保存到复习系统
            </p>

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

  return (
    <div className="max-w-2xl mx-auto">
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
          {currentWordIndex + 1} / {wordsData.length}
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Learned Words Info */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-700">
          <BookOpen size={18} className="text-primary" />
          <span>从 <span className="font-bold">{learnedWordsCount}</span> 个已学习单词中随机选择</span>
        </div>
      </div>

      {/* Listening Card */}
      <ClayCard>
        <div className="text-center mb-8">
          <p className="text-gray-600 mb-6">点击按钮，听音频并拼写单词</p>

          <button
            onClick={handleSpeak}
            className="mb-4 p-8 rounded-full bg-gradient-to-br from-primary to-primary-light text-white shadow-clay-sm hover:shadow-clay transition-all animate-pulse"
          >
            <Volume2 size={48} />
          </button>

          {hasPlayed && (
            <p className="text-sm text-gray-500 mt-4">🔊 已播放，请拼写</p>
          )}
        </div>

        {hasPlayed && (
          <>
            <div className="bg-blue-50 rounded-2xl p-4 mb-6">
              <p className="text-gray-700 text-center">
                <span className="font-medium">释义提示:</span> {currentWord.definition}
              </p>
            </div>

            {/* Input */}
            <div className="mb-6">
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={showResult}
                placeholder="输入听到的单词..."
                className="clay-input text-center text-2xl"
              />
            </div>

            {/* Result Feedback */}
            {showResult && (
              <div className={`text-center p-4 rounded-xl mb-6 ${
                results[currentWordIndex]?.correct
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}>
                <p className="text-xl font-bold">
                  {results[currentWordIndex]?.correct
                    ? "✅ 正确！"
                    : `❌ 正确答案是: ${currentWord.word}`}
                </p>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={handleSpeak}
                className="flex-1 clay-btn bg-gradient-to-r from-blue-500 to-blue-600"
              >
                再听一遍
              </button>
              <button
                onClick={handleSubmit}
                disabled={!userInput.trim() || showResult}
                className="flex-1 clay-btn clay-btn-green disabled:opacity-50 disabled:cursor-not-allowed"
              >
                提交答案
              </button>
            </div>
          </>
        )}
      </ClayCard>
    </div>
  );
}
