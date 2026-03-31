"use client";

import ClayCard from "@/components/ClayCard";
import { BookOpen, Target, Flame, TrendingUp, Award } from "lucide-react";

export default function StatsPage() {
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
          <div className="text-3xl font-bold text-primary">347</div>
        </ClayCard>

        <ClayCard>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-green-100">
              <Target className="text-green-600" size={24} />
            </div>
            <span className="text-sm text-gray-500">已掌握</span>
          </div>
          <div className="text-3xl font-bold text-green-600">289</div>
        </ClayCard>

        <ClayCard>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-orange-100">
              <Flame className="text-orange-600" size={24} />
            </div>
            <span className="text-sm text-gray-500">连续天数</span>
          </div>
          <div className="text-3xl font-bold text-orange-600">15</div>
        </ClayCard>

        <ClayCard>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-purple-100">
              <TrendingUp className="text-purple-600" size={24} />
            </div>
            <span className="text-sm text-gray-500">总时长</span>
          </div>
          <div className="text-3xl font-bold text-purple-600">42h</div>
        </ClayCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Progress Chart */}
        <ClayCard>
          <h3 className="text-xl font-bold font-display text-gray-800 mb-6">
            本周学习曲线
          </h3>
          <div className="flex items-end justify-between h-48 px-4">
            {[
              { day: "一", value: 45 },
              { day: "二", value: 60 },
              { day: "三", value: 35 },
              { day: "四", value: 80 },
              { day: "五", value: 55 },
              { day: "六", value: 90 },
              { day: "日", value: 70 },
            ].map((item) => (
              <div key={item.day} className="flex flex-col items-center gap-2 flex-1">
                <div
                  className="w-full max-w-[40px] bg-gradient-to-t from-primary to-primary-light rounded-t-lg transition-all hover:shadow-lg"
                  style={{ height: `${item.value}%` }}
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
              <span className="font-bold text-primary">45 分钟</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-green-50">
              <div className="flex items-center gap-3">
                <Target className="text-green-600" size={20} />
                <span>新学单词</span>
              </div>
              <span className="font-bold text-green-600">23 个</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-orange-50">
              <div className="flex items-center gap-3">
                <TrendingUp className="text-orange-600" size={20} />
                <span>复习单词</span>
              </div>
              <span className="font-bold text-orange-600">15 个</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-purple-50">
              <div className="flex items-center gap-3">
                <Award className="text-purple-600" size={20} />
                <span>测试得分</span>
              </div>
              <span className="font-bold text-purple-600">85 分</span>
            </div>
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
            {[
              { icon: "🔥", name: "连续7天", unlocked: true },
              { icon: "⭐", name: "50单词", unlocked: true },
              { icon: "📚", name: "10单元", unlocked: true },
              { icon: "🎯", name: "满分测试", unlocked: true },
              { icon: "👑", name: "百日坚持", unlocked: false },
              { icon: "🏆", name: "千词达人", unlocked: false },
            ].map((achievement) => (
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
