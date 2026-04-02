"use client";

import { useState, useEffect } from "react";
import { Volume2, Star, ChevronLeft, ChevronRight } from "lucide-react";

interface Word {
  id: number;
  word: string;
  pronunciation: string;
  definition: string;
  partOfSpeech: string;
  example: string;
  isFavorite?: boolean;
}

interface FlashcardProps {
  word: Word;
  currentIndex: number;
  totalWords: number;
  isLastWord?: boolean;
  onNext: (known: boolean) => void;
  onPrevious?: () => void;
  onToggleFavorite?: (wordId: number) => void;
}

export default function Flashcard({ word, currentIndex, totalWords, isLastWord, onNext, onPrevious, onToggleFavorite }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  // Reset flip state when word changes
  useEffect(() => {
    setIsFlipped(false);
  }, [word]);

  const handleFlip = () => {
    setIsFlipped(prev => !prev);
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') {
        return;
      }

      if (e.key === ' ') {
        e.preventDefault();
        handleFlip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const speak = () => {
    const utterance = new SpeechSynthesisUtterance(word.word);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  };

  const handleNext = (known: boolean) => {
    setIsFlipped(false);
    onNext(known);
  };

  const handlePrevious = () => {
    if (!onPrevious) return;
    setIsFlipped(false);
    onPrevious();
  };

  const handleToggleFavorite = () => {
    if (onToggleFavorite) {
      onToggleFavorite(word.id);
    }
  };

  return (
    <div className="flashcard-container w-full max-w-lg mx-auto">
      {/* Flashcard */}
      <div
        className={`flashcard relative w-full cursor-pointer transition-transform duration-700 transform-style-3d ${
          isFlipped ? "rotate-y-180" : ""
        }`}
        style={{ minHeight: "400px" }}
        onClick={handleFlip}
      >
        {/* Front Face - 单词页 */}
        <div className="flashcard-face absolute inset-0 backface-hidden clay-card flex flex-col items-center justify-center p-8">
          <div className="text-6xl mb-4">📖</div>
          <h2 className="text-4xl font-bold font-display text-primary mb-2">{word.word}</h2>
          <p className="text-xl text-gray-500 mb-6">{word.pronunciation}</p>
          <div className="flex gap-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                speak();
              }}
              className="p-3 rounded-xl bg-blue-100 hover:bg-blue-200 transition-colors"
              title="发音 (S)"
            >
              <Volume2 className="text-primary" size={24} />
            </button>
            {onToggleFavorite && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleFavorite();
                }}
                className={`p-3 rounded-xl transition-colors ${
                  word.isFavorite ? "bg-yellow-100" : "bg-gray-100 hover:bg-gray-200"
                }`}
                title="收藏 (F)"
              >
                <Star
                  className={word.isFavorite ? "text-yellow-500 fill-yellow-500" : "text-gray-400"}
                  size={24}
                />
              </button>
            )}
          </div>
          <p className="mt-6 text-gray-400 text-sm">点击查看释义</p>
        </div>

        {/* Back Face - 释义页 */}
        <div className="flashcard-face absolute inset-0 backface-hidden rotate-y-180 clay-card flex flex-col items-center justify-center p-8 overflow-hidden">
          <div className="w-full">
            <div className="text-center mb-6">
              <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-primary text-sm font-medium mb-2">
                {word.partOfSpeech}
              </span>
              <p className="text-2xl font-semibold text-gray-800">{word.definition}</p>
            </div>

            <div className="bg-blue-50 rounded-2xl p-4 mb-6">
              <p className="text-sm text-gray-500 mb-1">例句</p>
              <p className="text-gray-700 italic">&quot;{word.example}&quot;</p>
            </div>

            <div className="flex justify-center gap-3">
              <ClayButton
                variant="orange"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext(false);
                }}
              >
                不认识
              </ClayButton>
              <ClayButton
                variant="green"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext(true);
                }}
              >
                认识了
              </ClayButton>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex items-center justify-center gap-3 mt-6">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
            currentIndex === 0
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 hover:shadow-clay-sm border-2 border-gray-200"
          }`}
          title="上一个 (← 或 A)"
        >
          <ChevronLeft size={20} />
          上一个
        </button>

        <button
          onClick={speak}
          className="flex-1 py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 bg-blue-100 text-primary hover:bg-blue-200"
          title="发音 (S)"
        >
          <Volume2 size={20} />
          发音
        </button>

        {onToggleFavorite && (
          <button
            onClick={handleToggleFavorite}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
              word.isFavorite
                ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            title="收藏 (F)"
          >
            <Star
              className={word.isFavorite ? "fill-yellow-500" : ""}
              size={20}
            />
            {word.isFavorite ? "已收藏" : "收藏"}
          </button>
        )}

        <button
          onClick={() => handleNext(true)}
          disabled={isLastWord}
          className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
            isLastWord
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-primary to-primary-light text-white hover:shadow-clay-sm"
          }`}
          title="下一个 (→ 或 D)"
        >
          下一个
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Keyboard Shortcuts Hint */}
      <div className="mt-4 text-center text-xs text-gray-400">
        快捷键: ← 上一个 | → 下一个 | S 发音 | F 收藏 | Space 翻转
      </div>
    </div>
  );
}

function ClayButton({ variant, onClick, children, disabled }: { variant: string; onClick: any; children: any; disabled?: boolean }) {
  const variantClass = {
    orange: "clay-btn clay-btn-orange",
    green: "clay-btn clay-btn-green",
  }[variant as keyof typeof variantClass];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${variantClass} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {children}
    </button>
  );
}
