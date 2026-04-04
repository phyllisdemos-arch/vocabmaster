"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ClayCard from "@/components/ClayCard";
import { getTestStatistics, TestStatistics } from "@/lib/testResults";
import { TrendingUp, Award, Target } from "lucide-react";

const testTypes = [
  {
    id: "multiple-choice",
    name: "选择题",
    description: "从四个选项中选择正确的释义",
    icon: "📝",
    difficulty: "⭐⭐",
  },
  {
    id: "spelling",
    name: "拼写测试",
    description: "根据音标和释义拼写单词",
    icon: "✍️",
    difficulty: "⭐⭐⭐",
  },
  {
    id: "listening",
    name: "听力测试",
    description: "听音频写出单词",
    icon: "🎧",
    difficulty: "⭐⭐⭐⭐",
  },
  {
    id: "matching",
    name: "连线匹配",
    description: "将单词与释义进行配对",
    icon: "🔗",
    difficulty: "⭐⭐",
  },
];

export default function TestPage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [stats, setStats] = useState<TestStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load test statistics
    const testStats = getTestStatistics();
    setStats(testStats);
    setIsLoading(false);
  }, []);

  const handleSelectTest = (typeId: string) => {
    setSelectedType(typeId);
    // Navigate to test page
    router.push(`/test/${typeId}`);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <div className="text-4xl mb-4">📊</div>
        <h2 className="text-2xl font-bold font-display text-primary mb-4">
          加载中...
        </h2>
        <p className="text-gray-600">正在准备测试数据</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-display text-primary mb-4">
          选择测试类型
        </h1>
        <p className="text-gray-600 text-lg">
          通过不同方式检验你的学习成果
        </p>
      </div>

      {/* Test Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {testTypes.map((type) => {
          const accuracyByType = {
            'multiple-choice': stats?.accuracyByType.multipleChoice || 0,
            'spelling': stats?.accuracyByType.spelling || 0,
            'listening': stats?.accuracyByType.listening || 0,
            'matching': stats?.accuracyByType.matching || 0,
          };

          return (
            <ClayCard
              key={type.id}
              onClick={() => handleSelectTest(type.id)}
              className="h-full"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-5xl">{type.icon}</div>
                <div className="flex flex-col items-end gap-1">
                  <div className="text-sm">{type.difficulty}</div>
                  {accuracyByType[type.id as keyof typeof accuracyByType] > 0 && (
                    <div className="text-xs text-gray-500">
                      平均: {accuracyByType[type.id as keyof typeof accuracyByType]}%
                    </div>
                  )}
                </div>
              </div>

              <h3 className="text-2xl font-bold font-display text-gray-800 mb-2">
                {type.name}
              </h3>

              <p className="text-gray-600 mb-4">
                {type.description}
              </p>

              <button className="w-full py-2 rounded-xl font-medium transition-all bg-gradient-to-r from-primary to-primary-light text-white shadow-clay-sm hover:shadow-clay hover:-translate-y-0.5">
                开始测试
              </button>
            </ClayCard>
          );
        })}
      </div>

      {/* Statistics */}
      <div className="mt-12">
        <ClayCard>
          <h3 className="text-xl font-bold font-display text-gray-800 mb-6 text-center flex items-center justify-center gap-2">
            <TrendingUp size={24} />
            测试统计
          </h3>

          {stats && stats.totalTests > 0 ? (
            <>
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 text-center mb-8">
                <div className="p-4 bg-blue-50 rounded-xl">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {stats.averageAccuracy}%
                  </div>
                  <div className="text-sm text-gray-600">平均分</div>
                </div>
                <div className="p-4 bg-green-50 rounded-xl">
                  <div className="text-3xl font-bold text-accent-green mb-1">
                    {stats.totalTests}
                  </div>
                  <div className="text-sm text-gray-600">测试次数</div>
                </div>
                <div className="p-4 bg-orange-50 rounded-xl">
                  <div className="flex items-center justify-center gap-1">
                    <Award size={20} className="text-accent-orange" />
                    <div className="text-3xl font-bold text-accent-orange">
                      {stats.bestAccuracy}%
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">最高分</div>
                </div>
              </div>

              {/* Recent Tests */}
              {stats.recentTests.length > 0 && (
                <div>
                  <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Target size={20} />
                    最近测试
                  </h4>
                  <div className="space-y-3">
                    {stats.recentTests.slice(0, 5).map((test, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                      >
                        <div className="flex-1">
                          <div className="font-medium">
                            {test.testType === 'multiple-choice' && '📝 选择题'}
                            {test.testType === 'spelling' && '✍️ 拼写测试'}
                            {test.testType === 'listening' && '🎧 听力测试'}
                            {test.testType === 'matching' && '🔗 连线匹配'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(test.date).toLocaleDateString('zh-CN')}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-primary">
                            {test.correctAnswers}/{test.totalQuestions}
                          </div>
                          <div className="text-xs text-gray-500">
                            {test.accuracy}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h4 className="text-xl font-bold text-gray-700 mb-2">
                还没有测试记录
              </h4>
              <p className="text-gray-500 mb-6">
                开始第一次测试来追踪你的学习进度
              </p>
            </div>
          )}
        </ClayCard>
      </div>
    </div>
  );
}
