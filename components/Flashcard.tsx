"use client";

import { useState } from "react";
import { Volume2, Star } from "lucide-react";

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
  onNext: (known: boolean) => void;
  onToggleFavorite?: (wordId: number) => void;
}

export default function Flashcard({ word, onNext, onToggleFavorite }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleFlip = () => {
    if (isAnimating) return;
    setIsFlipped(!isFlipped);
  };

  const speak = () => {
    const utterance = new SpeechSynthesisUtterance(word.word);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  };

  const handleNext = (known: boolean) => {
    if (isAnimating) return;
    setIsAnimating(true);
    onNext(known);
    // Reset animation state after a short delay
    setTimeout(() => {
      setIsAnimating(false);
      setIsFlipped(false);
    }, 300);
  };

  return (
    <div className="flashcard-container w-full max-w-lg mx-auto perspective-1000">
      <div
        className={`flashcard relative w-full cursor-pointer transition-transform duration-700 transform-style-3d ${
          isFlipped ? "rotate-y-180" : ""
        } ${isAnimating ? "pointer-events-none" : ""}`}
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
            >
              <Volume2 className="text-primary" size={24} />
            </button>
            {onToggleFavorite && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(word.id);
                }}
                className={`p-3 rounded-xl transition-colors ${
                  word.isFavorite ? "bg-yellow-100" : "bg-gray-100 hover:bg-gray-200"
                }`}
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
                disabled={isAnimating}
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext(false);
                }}
              >
                不认识
              </ClayButton>
              <ClayButton
                variant="green"
                disabled={isAnimating}
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
