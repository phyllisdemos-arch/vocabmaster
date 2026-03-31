"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Volume2, CheckCircle, XCircle, Home, RotateCcw } from "lucide-react";
import ClayCard from "@/components/ClayCard";

interface Word {
  id: number;
  word: string;
  pronunciation: string;
  definition: string;
  hint: string;
}

const wordsData: Word[] = [
  {
    id: 1,
    word: "ephemeral",
    pronunciation: "/əˈfemərəl/",
    definition: "adj. 短暂的",
    hint: "e _ _ e _ e r a _",
  },
  {
    id: 2,
    word: "serendipity",
    pronunciation: "/ˌserənˈdɪpəti/",
    definition: "n. 意外发现珍奇事物的运气",
    hint: "s _ r _ n d i _ i _ y",
  },
  {
    id: 3,
    word: "eloquent",
    pronunciation: "/ˈeləkwənt/",
    definition: "adj. 雄辩的",
    hint: "e _ o _ u e n t",
  },
  {
    id: 4,
    word: "ubiquitous",
    pronunciation: "/juːˈbɪkwɪtəs/",
    definition: "adj. 无处不在的",
    hint: "u b i _ u i t o u _",
  },
  {
    id: 5,
    word: "pragmatic",
    pronunciation: "/præɡˈmætɪk/",
    definition: "adj. 务实的",
    hint: "p r a _ m a t i _",
  },
];

export default function SpellingTestPage() {
  const router = useRouter();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [results, setResults] = useState<{ word: string; correct: boolean; userAnswer: string }[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const currentWord = wordsData[currentWordIndex];
  const progress = ((currentWordIndex + 1) / wordsData.length) * 100;

  const handleSpeak = () => {
    const utterance = new SpeechSynthesisUtterance(currentWord.word);
    utterance.lang = "en-US";
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  };

  const handleSubmit = () => {
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
      setShowResult(false);

      if (currentWordIndex < wordsData.length - 1) {
        setCurrentWordIndex(currentWordIndex + 1);
      } else {
        setIsFinished(true);
      }
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !showResult && userInput.trim()) {
      handleSubmit();
    }
  };

  const handleRestart = () => {
    setCurrentWordIndex(0);
    setUserInput("");
    setResults([]);
    setShowResult(false);
    setIsFinished(false);
  };

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
              拼写测试完成！
            </h2>
            <div className="text-6xl font-bold text-accent-green mb-4">
              {correctCount}/{wordsData.length}
            </div>
            <p className="text-gray-600 mb-6">
              正确率: <span className="font-bold text-primary">{percentage}%</span>
            </p>

            <div className="bg-blue-50 rounded-2xl p-6 mb-6 text-left">
              <h3 className="font-bold text-lg mb-4">答题详情</h3>
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
      <div className="mb-8">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Word Card */}
      <ClayCard>
        <div className="text-center mb-8">
          <button
            onClick={handleSpeak}
            className="mb-6 p-6 rounded-full bg-gradient-to-br from-primary to-primary-light text-white shadow-clay-sm hover:shadow-clay transition-all"
          >
            <Volume2 size={32} />
          </button>

          <p className="text-xl text-gray-600 mb-2">点击图标听发音</p>
          <p className="text-lg text-gray-500">{currentWord.pronunciation}</p>
        </div>

        <div className="bg-blue-50 rounded-2xl p-4 mb-6">
          <p className="text-gray-700">
            <span className="font-medium">释义:</span> {currentWord.definition}
          </p>
        </div>

        <div className="bg-yellow-50 rounded-2xl p-4 mb-6">
          <p className="text-gray-700">
            <span className="font-medium">提示:</span> {currentWord.hint}
          </p>
        </div>

        {/* Input */}
        <div className="mb-6">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={showResult}
            placeholder="输入单词..."
            className="clay-input text-center text-2xl"
            autoFocus
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
              {results[currentWordIndex]?.correct ? "✅ 正确！" : `❌ 正确答案是: ${currentWord.word}`}
            </p>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!userInput.trim() || showResult}
          className="w-full clay-btn clay-btn-green disabled:opacity-50 disabled:cursor-not-allowed"
        >
          提交答案
        </button>
      </ClayCard>
    </div>
  );
}
