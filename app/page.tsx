"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import ClayCard from "@/components/ClayCard";

interface Unit {
  id: string;
  name: string;
  totalWords: number;
  learnedWords: number;
  icon: string;
}

export default function Home() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalWords, setTotalWords] = useState(0);
  const [learnedWords, setLearnedWords] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load unit data from unitData.json
      const unitResponse = await fetch("/unitData.json");
      const unitData = await unitResponse.json();

      // Load study history from localStorage
      const historyJson = localStorage.getItem("vocabmaster-study-history");
      const history = historyJson ? JSON.parse(historyJson) : [];

      // Calculate learned words for each unit
      const unitList: Unit[] = Object.keys(unitData).map((key) => {
        const unit = unitData[key];
        const words = unit.words || [];
        const totalWordsCount = words.length;

        // Count learned words from history for this specific unit
        const learnedCount = history
          .filter((session: any) => session.unitId === key || session.unitId === 'all')
          .reduce((sum: number, session: any) => {
            // For 'all' sessions, distribute proportionally or take max
            if (session.unitId === 'all') {
              return sum + Math.min(session.wordsLearned || 0, totalWordsCount);
            }
            return sum + (session.wordsLearned || 0);
          }, 0);

        return {
          id: key,
          name: unit.name || `Unit ${key}`,
          totalWords: totalWordsCount,
          learnedWords: Math.min(learnedCount, totalWordsCount), // Don't exceed total
          icon: unit.icon || "📚",
        };
      });

      // Calculate overall stats
      const overallTotalWords = unitList.reduce((sum, unit) => sum + unit.totalWords, 0);
      const overallLearnedWords = unitList.reduce((sum, unit) => sum + unit.learnedWords, 0);

      setUnits(unitList);
      setTotalWords(overallTotalWords);
      setLearnedWords(overallLearnedWords);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">加载中...</div>
      </div>
    );
  }

  const progress = totalWords > 0 ? Math.round((learnedWords / totalWords) * 100) : 0;

  return (
    <div>
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-display text-primary mb-4">
          选择学习单元
        </h1>
        <p className="text-gray-600 text-lg">
          已完成 <span className="font-bold text-accent-green">{learnedWords}</span> / <span className="font-bold">{totalWords}</span> 个单词
        </p>
        <div className="mt-4 max-w-md mx-auto">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {/* Units Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {units.map((unit) => {
          const unitProgress = unit.totalWords > 0 ? Math.round((unit.learnedWords / unit.totalWords) * 100) : 0;
          const isStarted = unitProgress > 0;

          return (
            <Link key={unit.id} href={`/unit/${unit.id}`}>
              <ClayCard className="h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{unit.icon}</div>
                  {isStarted && (
                    <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                      进行中
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold font-display text-gray-800 mb-2">
                  {unit.name}
                </h3>

                <p className="text-gray-500 text-sm mb-4">
                  {unit.learnedWords}/{unit.totalWords} 个单词
                </p>

                <div className="mb-4">
                  <div className="progress-bar h-2">
                    <div className="progress-fill" style={{ width: `${unitProgress}%` }} />
                  </div>
                </div>

                <button className="w-full py-2 rounded-xl font-medium transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary-light text-white shadow-clay-sm hover:shadow-clay hover:-translate-y-0.5">
                  <BookOpen size={18} />
                  {isStarted ? "继续学习" : "开始学习"}
                </button>
              </ClayCard>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
