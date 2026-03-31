"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, Home, RotateCcw } from "lucide-react";
import ClayCard from "@/components/ClayCard";

interface Question {
  id: number;
  word: string;
  pronunciation: string;
  correctAnswer: string;
  options: string[];
  isAnswered: boolean;
  selectedAnswer: string | null;
}

const questionsData: Question[] = [
  {
    id: 1,
    word: "ephemeral",
    pronunciation: "/əˈfemərəl/",
    correctAnswer: "短暂的",
    options: ["短暂的", "永恒的", "美丽的", "神秘的"],
    isAnswered: false,
    selectedAnswer: null,
  },
  {
    id: 2,
    word: "serendipity",
    pronunciation: "/ˌserənˈdɪpəti/",
    correctAnswer: "意外发现珍奇事物的运气",
    options: ["悲伤", "意外发现珍奇事物的运气", "愤怒", "快乐"],
    isAnswered: false,
    selectedAnswer: null,
  },
  {
    id: 3,
    word: "eloquent",
    pronunciation: "/ˈeləkwənt/",
    correctAnswer: "雄辩的",
    options: ["沉默的", "雄辩的", "害羞的", "傲慢的"],
    isAnswered: false,
    selectedAnswer: null,
  },
  {
    id: 4,
    word: "ubiquitous",
    pronunciation: "/juːˈbɪkwɪtəs/",
    correctAnswer: "无处不在的",
    options: ["稀有的", "遥远的", "无处不在的", "古老的"],
    isAnswered: false,
    selectedAnswer: null,
  },
  {
    id: 5,
    word: "pragmatic",
    pronunciation: "/præɡˈmætɪk/",
    correctAnswer: "务实的",
    options: ["理想主义的", "务实的", "浪漫的", "保守的"],
    isAnswered: false,
    selectedAnswer: null,
  },
];

export default function MultipleChoiceTestPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>(questionsData);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

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

    // Show result for 1.5 seconds then move to next
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setIsFinished(true);
        setShowResult(true);
      }
    }, 1500);

    setShowResult(true);
  };

  const handleRestart = () => {
    setQuestions(questionsData);
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResult(false);
    setIsFinished(false);
  };

  const speak = (word: string) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  };

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
      <div className="mb-8">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
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
