"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";
import ClayCard from "@/components/ClayCard";

/*const units = [
  { id: 1, name: "Unit 1: 日常问候", totalWords: 30, learnedWords: 25, icon: "👋" },
  { id: 2, name: "Unit 2: 家庭成员", totalWords: 35, learnedWords: 18, icon: "👨‍👩‍👧‍👦" },
  { id: 3, name: "Unit 3: 食物饮料", totalWords: 40, learnedWords: 0, icon: "🍔" },
  { id: 4, name: "Unit 4: 学校教育", totalWords: 45, learnedWords: 0, icon: "📚" },
  { id: 5, name: "Unit 5: 工作职业", totalWords: 38, learnedWords: 0, icon: "💼" },
  { id: 6, name: "Unit 6: 交通出行", totalWords: 32, learnedWords: 0, icon: "🚗" },
];*/
const units = [
  { id: 1, name: "Unit 1: Countries and nationalities", totalWords: 53, learnedWords: 0, icon: "📚" },
  { id: 2, name: "Unit 2: Numbers", totalWords: 55, learnedWords: 0, icon: "📚" },
  { id: 3, name: "Unit 3: Time expressions", totalWords: 38, learnedWords: 0, icon: "📚" },
  { id: 4, name: "Unit 4: Daily routines", totalWords: 69, learnedWords: 0, icon: "📚" },
  { id: 5, name: "Unit 5: Describing things: facts", totalWords: 52, learnedWords: 0, icon: "📚" },
  { id: 6, name: "Unit 6: Describing things: opinions", totalWords: 45, learnedWords: 0, icon: "📚" },
  { id: 7, name: "Unit 7: Sharing information", totalWords: 41, learnedWords: 0, icon: "📚" },
  { id: 8, name: "Unit 8: Common English idioms", totalWords: 24, learnedWords: 0, icon: "📚" },
  { id: 9, name: "Unit 9: Around the house", totalWords: 47, learnedWords: 0, icon: "📚" },
  { id: 10, name: "Unit 10: Kitchen implements and toiletries", totalWords: 51, learnedWords: 0, icon: "📚" },
  { id: 11, name: "Unit 11: Chores and cleaning", totalWords: 60, learnedWords: 0, icon: "📚" },
  { id: 12, name: "Unit 12: Tools and gardening", totalWords: 54, learnedWords: 0, icon: "📚" },
  { id: 13, name: "Unit 13: Moving and renting", totalWords: 43, learnedWords: 0, icon: "📚" },
  { id: 14, name: "Unit 14: The body", totalWords: 53, learnedWords: 0, icon: "📚" },
  { id: 15, name: "Unit 15: Clothes", totalWords: 58, learnedWords: 0, icon: "📚" },
  { id: 16, name: "Unit 16: Accessories and beauty products", totalWords: 48, learnedWords: 0, icon: "📚" },
  { id: 17, name: "Unit 17: Appearance", totalWords: 53, learnedWords: 0, icon: "📚" },
  { id: 18, name: "Unit 18: Personality traits", totalWords: 43, learnedWords: 0, icon: "📚" },
  { id: 19, name: "Unit 19: Feelings and moods", totalWords: 44, learnedWords: 0, icon: "📚" },
  { id: 20, name: "Unit 20: Family tree", totalWords: 40, learnedWords: 0, icon: "📚" },
  { id: 21, name: "Unit 21: Family and relationships", totalWords: 23, learnedWords: 0, icon: "📚" },
  { id: 22, name: "Unit 22: Baby equipment and toys", totalWords: 47, learnedWords: 0, icon: "📚" },
  { id: 23, name: "Unit 23: Education", totalWords: 51, learnedWords: 0, icon: "📚" },
  { id: 24, name: "Unit 24: Studying", totalWords: 22, learnedWords: 0, icon: "📚" },
  { id: 25, name: "Unit 25: Speaking a foreign language", totalWords: 20, learnedWords: 0, icon: "📚" },
  { id: 26, name: "Unit 26: Communication and beliefs", totalWords: 27, learnedWords: 0, icon: "📚" },
  { id: 27, name: "Unit 27: Crime and the law", totalWords: 37, learnedWords: 0, icon: "📚" },
  { id: 28, name: "Unit 28: Meat, fish, dairy, and snacks", totalWords: 53, learnedWords: 0, icon: "📚" },
  { id: 29, name: "Unit 29: Fruit and nuts", totalWords: 47, learnedWords: 0, icon: "📚" },
  { id: 30, name: "Unit 30: Vegetables", totalWords: 21, learnedWords: 0, icon: "📚" },
  { id: 31, name: "Unit 31: Bread, desserts, and condiments", totalWords: 47, learnedWords: 0, icon: "📚" },
  { id: 32, name: "Unit 32: Drinking and eating", totalWords: 49, learnedWords: 0, icon: "📚" },
  { id: 33, name: "Unit 33: Eating in and eating out", totalWords: 52, learnedWords: 0, icon: "📚" },
  { id: 34, name: "Unit 34: Jobs", totalWords: 50, learnedWords: 0, icon: "📚" },
  { id: 35, name: "Unit 35: Working conditions", totalWords: 42, learnedWords: 0, icon: "📚" },
  { id: 36, name: "Unit 36: Industries and departments", totalWords: 40, learnedWords: 0, icon: "📚" },
  { id: 37, name: "Unit 37: Office equipment", totalWords: 44, learnedWords: 0, icon: "📚" },
  { id: 38, name: "Unit 38: Money and finance", totalWords: 35, learnedWords: 0, icon: "📚" },
  { id: 39, name: "Unit 39: Working", totalWords: 23, learnedWords: 0, icon: "📚" },
  { id: 40, name: "Unit 40: Meeting and presenting", totalWords: 21, learnedWords: 0, icon: "📚" },
  { id: 41, name: "Unit 41: Work and business idioms", totalWords: 20, learnedWords: 0, icon: "📚" },
  { id: 42, name: "Unit 42: Applying for a job", totalWords: 29, learnedWords: 0, icon: "📚" },
  { id: 43, name: "Unit 43: Workplace skills and abilities", totalWords: 46, learnedWords: 0, icon: "📚" },
  { id: 44, name: "Unit 44: Transportation and travel", totalWords: 54, learnedWords: 0, icon: "📚" },
  { id: 45, name: "Unit 45: Driving a car", totalWords: 51, learnedWords: 0, icon: "📚" },
  { id: 46, name: "Unit 46: Maps and directions", totalWords: 60, learnedWords: 0, icon: "📚" },
  { id: 47, name: "Unit 47: Travel and accommodation", totalWords: 54, learnedWords: 0, icon: "📚" },
  { id: 48, name: "Unit 48: Travel and tourism", totalWords: 23, learnedWords: 0, icon: "📚" },
  { id: 49, name: "Unit 49: Camping and cycling", totalWords: 54, learnedWords: 0, icon: "📚" },
  { id: 50, name: "Unit 50: Beach", totalWords: 31, learnedWords: 0, icon: "📚" },
  { id: 51, name: "Unit 51: Weather and climate", totalWords: 53, learnedWords: 0, icon: "📚" },
  { id: 52, name: "Unit 52: Geographical features", totalWords: 40, learnedWords: 0, icon: "📚" },
  { id: 53, name: "Unit 53: Environmental concerns", totalWords: 14, learnedWords: 0, icon: "📚" },
  { id: 54, name: "Unit 54: Pets and farm animals", totalWords: 62, learnedWords: 0, icon: "📚" },
  { id: 55, name: "Unit 55: Wild animals", totalWords: 50, learnedWords: 0, icon: "📚" },
  { id: 56, name: "Unit 56: Birds and bugs", totalWords: 52, learnedWords: 0, icon: "📚" },
  { id: 57, name: "Unit 57: Fish, whales, and sea creatures", totalWords: 40, learnedWords: 0, icon: "📚" },
  { id: 58, name: "Unit 58: Free time activities", totalWords: 69, learnedWords: 0, icon: "📚" },
  { id: 59, name: "Unit 59: Abilities and actions", totalWords: 46, learnedWords: 0, icon: "📚" },
  { id: 60, name: "Unit 60: Sports", totalWords: 47, learnedWords: 0, icon: "📚" },
  { id: 61, name: "Unit 61: Soccer", totalWords: 38, learnedWords: 0, icon: "📚" },
  { id: 62, name: "Unit 62: Sports equipment and venues", totalWords: 43, learnedWords: 0, icon: "📚" },
  { id: 63, name: "Unit 63: Books and reading", totalWords: 37, learnedWords: 0, icon: "📚" },
  { id: 64, name: "Unit 64: Music", totalWords: 43, learnedWords: 0, icon: "📚" },
  { id: 65, name: "Unit 65: Movies and plays", totalWords: 46, learnedWords: 0, icon: "📚" },
  { id: 66, name: "Unit 66: TV", totalWords: 53, learnedWords: 0, icon: "📚" },
  { id: 67, name: "Unit 67: Media and celebrity", totalWords: 16, learnedWords: 0, icon: "📚" },
  { id: 68, name: "Unit 68: Sickness", totalWords: 47, learnedWords: 0, icon: "📚" },
  { id: 69, name: "Unit 69: Medicine and treatment", totalWords: 52, learnedWords: 0, icon: "📚" },
  { id: 70, name: "Unit 70: Healthy eating", totalWords: 36, learnedWords: 0, icon: "📚" },
  { id: 71, name: "Unit 71: Fitness and well-being", totalWords: 44, learnedWords: 0, icon: "📚" },
  { id: 72, name: "Unit 72: Around town", totalWords: 49, learnedWords: 0, icon: "📚" },
  { id: 73, name: "Unit 73: Shopping", totalWords: 37, learnedWords: 0, icon: "📚" },
  { id: 74, name: "Unit 74: At the supermarket", totalWords: 40, learnedWords: 0, icon: "📚" },
  { id: 75, name: "Unit 75: Urban life", totalWords: 18, learnedWords: 0, icon: "📚" },
  { id: 76, name: "Unit 76: Technology and gadgets", totalWords: 34, learnedWords: 0, icon: "📚" },
  { id: 77, name: "Unit 77: Technology and the future", totalWords: 21, learnedWords: 0, icon: "📚" },
  { id: 78, name: "Unit 78: Science", totalWords: 41, learnedWords: 0, icon: "📚" },
];

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-display text-primary mb-4">
          选择学习单元
        </h1>
        <p className="text-gray-600 text-lg">
          已完成 <span className="font-bold text-accent-green">25</span> / <span className="font-bold">220</span> 个单词
        </p>
        <div className="mt-4 max-w-md mx-auto">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: "11%" }} />
          </div>
        </div>
      </div>

      {/* Units Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {units.map((unit) => {
          const progress = Math.round((unit.learnedWords / unit.totalWords) * 100);
          const isStarted = progress > 0;

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
                    <div className="progress-fill" style={{ width: `${progress}%` }} />
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
