"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, Home, RotateCcw, BookOpen } from "lucide-react";
import ClayCard from "@/components/ClayCard";
import { getLearnedWords, getWrongAnswers, saveTestResult, TestResult, getLearnedWordsCount } from "@/lib/testResults";

interface Question {
  id: number;
  wordId: number;
  word: string;
  pronunciation: string;
  correctAnswer: string;
  options: string[];
  isAnswered: boolean;
  selectedAnswer: string | null;
}

export default function MultipleChoiceTestPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [learnedWordsCount, setLearnedWordsCount] = useState<number>(0);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      // Get count of learned words first
      const count = await getLearnedWordsCount();
      setLearnedWordsCount(count);

      // Load learned words for testing
      const testWords = await getLearnedWords(10);
      const allWords = await fetch('/words.json').then(res => res.json());

      const questionsData: Question[] = testWords.map((word, index) => {
        const wrongAnswers = getWrongAnswers(word.definition, 3, allWords);
        const options = [word.definition, ...wrongAnswers].sort(() => Math.random() - 0.5);

        return {
          id: index + 1,
          wordId: word.id,
          word: word.word,
          pronunciation: word.pronunciation,
          correctAnswer: word.definition,
          options,
          isAnswered: false,
          selectedAnswer: null,
        };
      });

      setQuestions(questionsData);
      setStartTime(Date.now());
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load questions:', error);
      setIsLoading(false);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  const handleAnswer = (answer: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex] = {
      ...currentQuestion,
      isAnswered: true,
      selectedAnswer: answer,
    };
    setQuestions(updatedQuestions);

    // Check if correct
    if (answer === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }

    setShowResult(true);

    // Show result for 1.5 seconds then move to next
    setTimeout(() => {
      setShowResult(false); // Reset showResult before moving to next

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        finishTest();
      }
    }, 1500);
  };

  const finishTest = () => {
    setIsFinished(true);
    setShowResult(true);

    // Save test result
    const duration = Math.round((Date.now() - startTime) / 1000);
    const wordResults = questions.map(q => ({
      wordId: q.wordId,
      word: q.word,
      correct: q.selectedAnswer === q.correctAnswer,
    }));

    const result: TestResult = {
      testType: 'multiple-choice',
      date: new Date().toISOString(),
      totalQuestions: questions.length,
      correctAnswers: score,
      accuracy: Math.round((score / questions.length) * 100),
      duration,
      wordResults,
    };

    saveTestResult(result);
  };

  const handleRestart = () => {
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResult(false);
    setIsFinished(false);
    setIsLoading(true);
    loadQuestions();
  };

  const speak = (word: string) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="text-4xl mb-4">📝</div>
        <h2 className="text-2xl font-bold font-display text-primary mb-4">
          加载中...
        </h2>
        <p className="text-gray-600">正在准备测试题目</p>
      </div>
    );
  }

  if (questions.length === 0) {
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
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="max-w-2xl mx-auto">
        <ClayCard>
          <div className="text-center">
            <div className="text-6xl mb-4">
              {percentage >= 80 ? "🎉" : percentage >= 60 ? "👍" : "💪"}
            </div>
            <h2 className="text-3xl font-bold font-display text-primary mb-4">
              测试完成！
            </h2>
            <div className="text-6xl font-bold text-accent-green mb-4">
              {score}/{questions.length}
            </div>
            <p className="text-gray-600 mb-6">
              正确率: <span className="font-bold text-primary">{percentage}%</span>
            </p>

            <div className="bg-blue-50 rounded-2xl p-6 mb-6">
              <h3 className="font-bold text-lg mb-4">答题详情</h3>
              <div className="max-h-64 overflow-y-auto">
                {questions.map((q, index) => (
                  <div key={q.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <span className="text-sm">
                      {index + 1}. {q.word}
                    </span>
                    <div className="flex items-center gap-2">
                      {q.selectedAnswer === q.correctAnswer ? (
                        <CheckCircle className="text-green-500" size={20} />
                      ) : (
                        <XCircle className="text-red-500" size={20} />
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
          {currentQuestionIndex + 1} / {questions.length}
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

      {/* Question Card */}
      <ClayCard>
        <div className="text-center mb-8">
          <button
            onClick={() => speak(currentQuestion.word)}
            className="mb-4 p-3 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors"
          >
            🔊
          </button>
          <h2 className="text-4xl font-bold font-display text-primary mb-2">
            {currentQuestion.word}
          </h2>
          <p className="text-xl text-gray-500">{currentQuestion.pronunciation}</p>
        </div>

        <p className="text-center text-gray-700 mb-8">
          &quot;{currentQuestion.word}&quot; 的中文意思是？
        </p>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = currentQuestion.selectedAnswer === option;
            const isCorrect = option === currentQuestion.correctAnswer;

            let buttonClass = "w-full p-4 rounded-xl text-left font-medium transition-all ";

            if (showResult) {
              if (isCorrect) {
                buttonClass += "bg-green-100 border-2 border-green-500 text-green-700";
              } else if (isSelected && !isCorrect) {
                buttonClass += "bg-red-100 border-2 border-red-500 text-red-700";
              } else {
                buttonClass += "bg-gray-50 text-gray-400";
              }
            } else {
              buttonClass +=
                "bg-white border-2 border-gray-200 hover:border-primary hover:bg-blue-50 text-gray-700 cursor-pointer";
            }

            return (
              <button
                key={index}
                onClick={() => !showResult && handleAnswer(option)}
                disabled={showResult}
                className={buttonClass}
              >
                <span className="font-bold mr-3">{String.fromCharCode(65 + index)}.</span>
                {option}
              </button>
            );
          })}
        </div>
      </ClayCard>
    </div>
  );
}
