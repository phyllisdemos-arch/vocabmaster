"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ClayCard from "@/components/ClayCard";

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

  const handleSelectTest = (typeId: string) => {
    setSelectedType(typeId);
    // Navigate to test page
    router.push(`/test/${typeId}`);
  };

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testTypes.map((type) => (
          <ClayCard
            key={type.id}
            onClick={() => handleSelectTest(type.id)}
            className="h-full"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="text-5xl">{type.icon}</div>
              <div className="text-sm">{type.difficulty}</div>
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
        ))}
      </div>

      {/* Quick Stats */}
      <div className="mt-12">
        <ClayCard>
          <h3 className="text-xl font-bold font-display text-gray-800 mb-6 text-center">
            最近测试记录
          </h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-primary">85</div>
              <div className="text-sm text-gray-500">平均分</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent-green">12</div>
              <div className="text-sm text-gray-500">测试次数</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent-orange">67%</div>
              <div className="text-sm text-gray-500">正确率</div>
            </div>
          </div>
        </ClayCard>
      </div>
    </div>
  );
}
