"use client";

import { useState, useEffect } from "react";
import ClayCard from "@/components/ClayCard";
import { BookOpen, Target, Flame, TrendingUp, Award } from "lucide-react";

interface StudySession {
  date: string;
  wordsLearned: number;
  wordsReviewed: number;
  duration: number; // in minutes
  score?: number;
}

interface StatsData {
  totalWordsLearned: number;
  totalWordsMastered: number;
  consecutiveDays: number;
  totalDuration: number; // in minutes
  weeklyData: { day: string; value: number }[];
  todayData: {
    duration: number;
    newWords: number;
    reviewedWords: number;
    testScore: number;
  };
  achievements: {
    icon: string;
    name: string;
    unlocked: boolean;
  }[];
}

export default function StatsPage() {
  const [stats, setStats] = useState<StatsData>({
    totalWordsLearned: 0,
    totalWordsMastered: 0,
    consecutiveDays: 0,
    totalDuration: 0,
    weeklyData: [],
    todayData: {
      duration: 0,
      newWords: 0,
      reviewedWords: 0,
      testScore: 0,
    },
    achievements: [
      { icon: "🔥", name: "连续7天", unlocked: false },
      { icon: "⭐", name: "50单词", unlocked: false },
      { icon: "📚", name: "10单元", unlocked: false },
      { icon: "🎯", name: "满分测试", unlocked: false },
      { icon: "👑", name: "百日坚持", unlocked: false },
      { icon: "🏆", name: "千词达人", unlocked: false },
    ],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatsData();
  }, []);

  const loadStatsData = async () => {
    try {
      // Load study history from localStorage
      const historyJson = localStorage.getItem("vocabmaster-study-history");
      const history: StudySession[] = historyJson ? JSON.parse(historyJson) : [];

      // Load unit data
      const unitResponse = await fetch("/unitData.json");
      const unitData = await unitResponse.json();

      // Calculate learned words for each unit (same logic as home page)
      let totalWordsLearned = 0;
      Object.keys(unitData).forEach((key) => {
        const unit = unitData[key];
        const words = unit.words || [];
        const totalWordsCount = words.length;

        // Count learned words from history for this specific unit
        const learnedCount = history
          .filter((session: any) => session.unitId === key || session.unitId === 'all')
          .reduce((sum: number, session: any) => {
            if (session.unitId === 'all') {
              return sum + Math.min(session.wordsLearned || 0, totalWordsCount);
            }
            return sum + (session.wordsLearned || 0);
          }, 0);

        totalWordsLearned += Math.min(learnedCount, totalWordsCount);
      });

      // Calculate mastered words (words marked as "known" in learning sessions)
      const totalWordsMastered = history.reduce((sum, session) => {
        // Only count "known" words, not reviewed words
        return sum + (session.wordsLearned || 0);
      }, 0);

      // But cap it at total words learned to avoid overcounting
      const adjustedMastered = Math.min(totalWordsMastered, totalWordsLearned);

      const totalDuration = history.reduce((sum, session) => sum + session.duration, 0);

      // Calculate consecutive days
      const consecutiveDays = calculateConsecutiveDays(history);

      // Calculate weekly data
      const weeklyData = calculateWeeklyData(history);

      // Calculate today's data
      const todayData = calculateTodayData(history);

      // Calculate achievements
      const achievements = calculateAchievements(
        totalWordsLearned,
        consecutiveDays,
        Object.keys(unitData).length,
        history
      );

      setStats({
        totalWordsLearned,
        totalWordsMastered: adjustedMastered,
        consecutiveDays,
        totalDuration,
        weeklyData,
        todayData,
        achievements,
      });
    } catch (error) {
      console.error("Failed to load stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateConsecutiveDays = (history: StudySession[]): number => {
    if (history.length === 0) return 0;

    const dates = [...new Set(history.map((session) => session.date))].sort().reverse();
    let consecutive = 0;
    let currentDate = new Date();

    for (const dateStr of dates) {
      const sessionDate = new Date(dateStr);
      const diffDays = Math.floor(
        (currentDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === consecutive || (consecutive === 0 && diffDays <= 1)) {
        consecutive++;
        currentDate = sessionDate;
      } else {
        break;
      }
    }

    return consecutive;
  };

  const calculateWeeklyData = (history: StudySession[]): { day: string; value: number }[] => {
    const days = ["日", "一", "二", "三", "四", "五", "六"];
    const today = new Date();
    const weekData: { day: string; value: number }[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      const daySessions = history.filter((session) => session.date === dateStr);
      const totalWords = daySessions.reduce((sum, session) => sum + session.wordsLearned + session.wordsReviewed, 0);

      weekData.push({
        day: days[date.getDay()],
        value: totalWords,
      });
    }

    return weekData;
  };

  const calculateTodayData = (history: StudySession): {
    duration: number;
    newWords: number;
    reviewedWords: number;
    testScore: number;
  } => {
    const today = new Date().toISOString().split("T")[0];
    const todaySessions = history.filter((session: StudySession) => session.date === today);

    return {
      duration: todaySessions.reduce((sum, session) => sum + session.duration, 0),
      newWords: todaySessions.reduce((sum, session) => sum + session.wordsLearned, 0),
      reviewedWords: todaySessions.reduce((sum, session) => sum + session.wordsReviewed, 0),
      testScore: todaySessions.length > 0 && todaySessions[todaySessions.length - 1].score
        ? todaySessions[todaySessions.length - 1].score
        : 0,
    };
  };

  const calculateAchievements = (
    totalWords: number,
    consecutiveDays: number,
    unitsCompleted: number,
    history: StudySession[]
  ) => {
    const perfectScore = history.some((session) => session.score === 100);

    return [
      {
        icon: "🔥",
        name: "连续7天",
        unlocked: consecutiveDays >= 7,
      },
      {
        icon: "⭐",
        name: "50单词",
        unlocked: totalWords >= 50,
      },
      {
        icon: "📚",
        name: "10单元",
        unlocked: unitsCompleted >= 10,
      },
      {
        icon: "🎯",
        name: "满分测试",
        unlocked: perfectScore,
      },
      {
        icon: "👑",
        name: "百日坚持",
        unlocked: consecutiveDays >= 100,
      },
      {
        icon: "🏆",
        name: "千词达人",
        unlocked: totalWords >= 1000,
      },
    ];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">加载中...</div>
      </div>
    );
  }

  const formatDuration = (minutes: number): string => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const maxValue = Math.max(...stats.weeklyData.map((d) => d.value), 1);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-display text-primary mb-4">
          学习统计
        </h1>
        <p className="text-gray-600 text-lg">
          追踪你的学习进度和成就
        </p>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <ClayCard>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-blue-100">
              <BookOpen className="text-primary" size={24} />
            </div>
            <span className="text-sm text-gray-500">已学单词</span>
          </div>
          <div className="text-3xl font-bold text-primary">{stats.totalWordsLearned}</div>
        </ClayCard>

        <ClayCard>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-green-100">
              <Target className="text-green-600" size={24} />
            </div>
            <span className="text-sm text-gray-500">已掌握</span>
          </div>
          <div className="text-3xl font-bold text-green-600">{stats.totalWordsMastered}</div>
        </ClayCard>

        <ClayCard>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-orange-100">
              <Flame className="text-orange-600" size={24} />
            </div>
            <span className="text-sm text-gray-500">连续天数</span>
          </div>
          <div className="text-3xl font-bold text-orange-600">{stats.consecutiveDays}</div>
        </ClayCard>

        <ClayCard>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-purple-100">
              <TrendingUp className="text-purple-600" size={24} />
            </div>
            <span className="text-sm text-gray-500">总时长</span>
          </div>
          <div className="text-3xl font-bold text-purple-600">{formatDuration(stats.totalDuration)}</div>
        </ClayCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Progress Chart */}
        <ClayCard>
          <h3 className="text-xl font-bold font-display text-gray-800 mb-6">
            本周学习曲线
          </h3>
          <div className="flex items-end justify-between h-48 px-4">
            {stats.weeklyData.map((item) => (
              <div key={item.day} className="flex flex-col items-center gap-2 flex-1">
                <div
                  className="w-full max-w-[40px] bg-gradient-to-t from-primary to-primary-light rounded-t-lg transition-all hover:shadow-lg"
                  style={{ height: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%` }}
                />
                <span className="text-sm text-gray-500">{item.day}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center text-sm text-gray-500">
            每日学习单词数
          </div>
        </ClayCard>

        {/* Today's Summary */}
        <ClayCard>
          <h3 className="text-xl font-bold font-display text-gray-800 mb-6">
            今日总结
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50">
              <div className="flex items-center gap-3">
                <BookOpen className="text-primary" size={20} />
                <span>今日学习</span>
              </div>
              <span className="font-bold text-primary">{formatDuration(stats.todayData.duration)}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-green-50">
              <div className="flex items-center gap-3">
                <Target className="text-green-600" size={20} />
                <span>新学单词</span>
              </div>
              <span className="font-bold text-green-600">{stats.todayData.newWords} 个</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-orange-50">
              <div className="flex items-center gap-3">
                <TrendingUp className="text-orange-600" size={20} />
                <span>复习单词</span>
              </div>
              <span className="font-bold text-orange-600">{stats.todayData.reviewedWords} 个</span>
            </div>

            {stats.todayData.testScore > 0 && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-purple-50">
                <div className="flex items-center gap-3">
                  <Award className="text-purple-600" size={20} />
                  <span>测试得分</span>
                </div>
                <span className="font-bold text-purple-600">{stats.todayData.testScore} 分</span>
              </div>
            )}
          </div>
        </ClayCard>
      </div>

      {/* Achievements */}
      <div className="mt-6">
        <ClayCard>
          <h3 className="text-xl font-bold font-display text-gray-800 mb-6 text-center">
            成就徽章
          </h3>
          <div className="flex flex-wrap justify-center gap-6">
            {stats.achievements.map((achievement) => (
              <div
                key={achievement.name}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl ${
                  achievement.unlocked ? "bg-gradient-to-br from-yellow-50 to-orange-50" : "bg-gray-100 opacity-50"
                }`}
              >
                <div className="text-4xl">{achievement.icon}</div>
                <span className={`text-sm font-medium ${achievement.unlocked ? "text-gray-800" : "text-gray-500"}`}>
                  {achievement.name}
                </span>
                {achievement.unlocked && (
                  <span className="text-xs text-green-600 font-medium">已解锁</span>
                )}
              </div>
            ))}
          </div>
        </ClayCard>
      </div>
    </div>
  );
}
