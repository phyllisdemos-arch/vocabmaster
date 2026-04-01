"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ClayCard from "@/components/ClayCard";
import ClayButton from "@/components/ClayButton";
import { BookOpen, Volume2, Star } from "lucide-react";

// Sample unit data
const unitData: Record<string, any> = {
  "1": {
    "id": 1,
    "name": "Unit 1: Countries and nationalities",
    "icon": "📚",
    "totalWords": 54,
    "learnedWords": 0,
    "words": [
      {
        "word": "American",
        "pronunciation": "/əˈmerɪkən/",
        "definition": "美国的；美国人",
        "partOfSpeech": "adj. / n.",
        "example": "While American culture has a global influence, it is important to appreciate the diversity within the United States itself.",
        "isLearned": false,
        "isFavorite": false
      },
      {
        "word": "British",
        "pronunciation": "/ˈbrɪtɪʃ/",
        "definition": "英国的；英国人的",
        "partOfSpeech": "adj. / n.",
        "example": "Many students find it challenging to distinguish between various British accents, which vary significantly from region to region.",
        "isLearned": false,
        "isFavorite": false
      },
      {
        "word": "China",
        "pronunciation": "/ˈtʃaɪnə/",
        "definition": "中国",
        "partOfSpeech": "n.",
        "example": "As a country with a long history, China is playing an increasingly vital role in international affairs and global economic development.",
        "isLearned": false,
        "isFavorite": false
      },
      {
        "word": "Chinese",
        "pronunciation": "/ˌtʃaɪˈniːz/",
        "definition": "中文；中国的；中国人",
        "partOfSpeech": "adj. / n.",
        "example": "Not only is the Chinese language rich in cultural heritage, but its complex character system also offers a unique perspective on history.",
        "isLearned": false,
        "isFavorite": false
      },
      {
        "word": "countries",
        "pronunciation": "/ˈkʌntriz/",
        "definition": "国家",
        "partOfSpeech": "n. (pl.)",
        "example": "With the rapid advancement of globalization, cooperation among different countries has become more essential than ever before.",
        "isLearned": false,
        "isFavorite": false
      },
      {
        "word": "country",
        "pronunciation": "/ˈkʌntri/",
        "definition": "国家",
        "partOfSpeech": "n.",
        "example": "Every country has its own unique cultural traditions that contribute to the rich tapestry of human civilization.",
        "isLearned": false,
        "isFavorite": false
      },
      {
        "word": "Egypt",
        "pronunciation": "/ˈiːdʒɪpt/",
        "definition": "埃及",
        "partOfSpeech": "n.",
        "example": "Egypt is the birthplace of one of the world's oldest civilizations, and the Great Pyramids remain its most iconic symbols.",
        "isLearned": false,
        "isFavorite": false
      },
      {
        "word": "Egyptian",
        "pronunciation": "/ɪˈdʒɪpʃən/",
        "definition": "埃及的；埃及人",
        "partOfSpeech": "adj. / n.",
        "example": "The ancient Egyptian civilization developed sophisticated systems of writing, mathematics, and architecture that still amaze us today.",
        "isLearned": false,
        "isFavorite": false
      },
      {
        "word": "France",
        "pronunciation": "/fræns/",
        "definition": "法国",
        "partOfSpeech": "n.",
        "example": "France is renowned for its culinary excellence, artistic heritage, and significant contributions to global culture and politics.",
        "isLearned": false,
        "isFavorite": false
      },
      {
        "word": "French",
        "pronunciation": "/frentʃ/",
        "definition": "法语；法国的；法国人",
        "partOfSpeech": "adj. / n.",
        "example": "Learning French opens doors to understanding not just the language, but also the rich literary and philosophical traditions of France.",
        "isLearned": false,
        "isFavorite": false
      },
      {
        "word": "Germany",
        "pronunciation": "/ˈdʒɜːrməni/",
        "definition": "德国",
        "partOfSpeech": "n.",
        "example": "Germany's engineering prowess and commitment to quality have made it a global leader in manufacturing and technological innovation.",
        "isLearned": false,
        "isFavorite": false
      },
      {
        "word": "German",
        "pronunciation": "/ˈdʒɜːrmən/",
        "definition": "德语；德国的；德国人",
        "partOfSpeech": "adj. / n.",
        "example": "The German language has given us many influential philosophers, scientists, and composers whose works continue to shape our world.",
        "isLearned": false,
        "isFavorite": false
      },
      {
        "word": "Greece",
        "pronunciation": "/ɡriːs/",
        "definition": "希腊",
        "partOfSpeech": "n.",
        "example": "Greece is the cradle of Western civilization, having given birth to democracy, philosophy, and the Olympic Games.",
        "isLearned": false,
        "isFavorite": false
      },
      {
        "word": "Greek",
        "pronunciation": "/ɡriːk/",
        "definition": "希腊语；希腊的；希腊人",
        "partOfSpeech": "adj. / n.",
        "example": "Ancient Greek mythology continues to influence modern literature, art, and popular culture around the world.",
        "isLearned": false,
        "isFavorite": false
      },
      {
        "word": "India",
        "pronunciation": "/ˈɪndiə/",
        "definition": "印度",
        "partOfSpeech": "n.",
        "example": "India's diverse cultural heritage, from its ancient spiritual traditions to its vibrant modern democracy, makes it a fascinating study.",
        "isLearned": false,
        "isFavorite": false
      },
      {
        "word": "Indian",
        "pronunciation": "/ˈɪndiən/",
        "definition": "印度的；印度人",
        "partOfSpeech": "adj. / n.",
        "example": "Indian cuisine, with its complex flavors and regional variations, reflects the country's rich culinary heritage and diversity.",
        "isLearned": false,
        "isFavorite": false
      },
      {
        "word": "Italy",
        "pronunciation": "/ˈɪtəli/",
        "definition": "意大利",
        "partOfSpeech": "n.",
        "example": "Italy's artistic legacy, from Renaissance masterpieces to modern design, continues to inspire creativity worldwide.",
        "isLearned": false,
        "isFavorite": false
      },
      {
        "word": "Italian",
        "pronunciation": "/ɪˈtæljən/",
        "definition": "意大利语；意大利的；意大利人",
        "partOfSpeech": "adj. / n.",
        "example": "Italian opera, with its dramatic storytelling and beautiful music, has captivated audiences for centuries.",
        "isLearned": false,
        "isFavorite": false
      },
      {
        "word": "Japan",
        "pronunciation": "/dʒəˈpæn/",
        "definition": "日本",
        "partOfSpeech": "n.",
        "example": "Japan's blend of ancient traditions with cutting-edge technology creates a unique cultural landscape.",
        "isLearned": false,
        "isFavorite": false
      },
      {
        "word": "Japanese",
        "pronunciation": "/ˌdʒæpəˈniːz/",
        "definition": "日语；日本的；日本人",
        "partOfSpeech": "adj. / n.",
        "example": "Japanese gardens, with their meticulous design and Zen philosophy, offer peaceful retreats in urban environments.",
        "isLearned": false,
        "isFavorite": false
      },
      {
        "word": "Mexico",
        "pronunciation": "/ˈmeksɪkoʊ/",
        "definition": "墨西哥",
        "partOfSpeech": "n.",
        "example": "Mexico's vibrant culture, from its ancient civilizations to its modern festivals, showcases incredible diversity and creativity.",
        "isLearned": false,
        "isFavorite": false
      },
      {
        "word": "Mexican",
        "pronunciation": "/ˈmeksɪkən/",
        "definition": "墨西哥的；墨西哥人",
        "partOfSpeech": "adj. / n.",
        "example": "Mexican cuisine, with its bold flavors and fresh ingredients, has become beloved worldwide.",
        "isLearned": false,
        "isFavorite": false
      },
      {
        "word": "New Zealand",
        "pronunciation": "/nuː ˈziːlənd/",
        "definition": "新西兰",
        "partOfSpeech": "n.",
        "example": "New Zealand is renowned for its spectacular landscapes, which served as the iconic backdrop for many epic fantasy movies.",
        "isLearned": false,
        "isFavorite": false
      },
      {
        "word": "New Zealander",
        "pronunciation": "/nuː ˈziːləndər/",
        "definition": "新西兰人",
        "partOfSpeech": "n.",
        "example": "New Zealanders take great pride in their country's natural beauty and outdoor lifestyle.",
        "isLearned": false,
        "isFavorite": false
      },
      {
        "word": "Russia",
        "pronunciation": "/ˈrʌʃə/",
        "definition": "俄罗斯",
        "partOfSpeech": "n.",
        "example": "Russia's vast territory and rich history have shaped its unique position in global affairs.",
        "isLearned": false,
        "isFavorite": false
      },
      {
        "word": "Russian",
        "pronunciation": "/ˈrʌʃən/",
        "definition": "俄语；俄罗斯的；俄罗斯人",
        "partOfSpeech": "adj. / n.",
        "example": "Russian literature, from Tolstoy to Dostoevsky, explores profound questions about human nature and society.",
        "isLearned": false,
        "isFavorite": false
      },
      {
        "word": "Spain",
        "pronunciation": "/speɪn/",
        "definition": "西班牙",
        "partOfSpeech": "n.",
        "example": "Spain's Moorish heritage and Catholic traditions have created a unique cultural blend that influences its art and architecture.",
        "isLearned": false,
        "isFavorite": false
      },
      {
        "word": "Spanish",
        "pronunciation": "/ˈspænɪʃ/",
        "definition": "西班牙语；西班牙的；西班牙人",
        "partOfSpeech": "adj. / n.",
        "example": "Spanish is the second most spoken language in the world and opens doors to rich Hispanic cultures.",
        "isLearned": false,
        "isFavorite": false
      },
      {
        "word": "Thailand",
        "pronunciation": "/ˈtaɪlænd/",
        "definition": "泰国",
        "partOfSpeech": "n.",
        "example": "Thailand's warm hospitality and stunning temples make it a popular destination for cultural tourism.",
        "isLearned": false,
        "isFavorite": false
      },
      {
        "word": "Thai",
        "pronunciation": "/taɪ/",
        "definition": "泰语；泰国的；泰国人",
        "partOfSpeech": "adj. / n.",
        "example": "Thai cuisine, with its perfect balance of sweet, sour, salty, and spicy flavors, is a culinary adventure.",
        "isLearned": false,
        "isFavorite": false
      },
      {
        "word": "Turkey",
        "pronunciation": "/ˈtɜːrki/",
        "definition": "土耳其",
        "partOfSpeech": "n.",
        "example": "Turkey serves as a bridge between Europe and Asia, blending diverse cultural influences.",
        "isLearned": false,
        "isFavorite": false
      },
      {
        "word": "Turkish",
        "pronunciation": "/ˈtɜːrkɪʃ/",
        "definition": "土耳其语；土耳其的；土耳其人",
        "partOfSpeech": "adj. / n.",
        "example": "Turkish coffee, with its strong flavor and thick texture, is a traditional way to enjoy this beverage.",
        "isLearned": false,
        "isFavorite": false
      },
      {
        "word": "UK",
        "pronunciation": "/ˌjuː ˈkeɪ/",
        "definition": "英国",
        "partOfSpeech": "n.",
        "example": "The UK consists of four countries: England, Scotland, Wales, and Northern Ireland, each with its own distinct identity.",
        "isLearned": false,
        "isFavorite": false
      },
      {
        "word": "US",
        "pronunciation": "/ˌjuː ˈes/",
        "definition": "美国",
        "partOfSpeech": "n.",
        "example": "The US is a federal republic comprising 50 states, each with its own government and constitution.",
        "isLearned": false,
        "isFavorite": false
      },
      {
        "word": "Vietnam",
        "pronunciation": "/ˌviətˈnæm/",
        "definition": "越南",
        "partOfSpeech": "n.",
        "example": "Vietnam's history of resilience and its rapid economic development make it an inspiring case study.",
        "isLearned": false,
        "isFavorite": false
      },
      {
        "word": "Vietnamese",
        "pronunciation": "/ˌviətnəˈmiːz/",
        "definition": "越南语；越南的；越南人",
        "partOfSpeech": "adj. / n.",
        "example": "Vietnamese cuisine emphasizes fresh herbs and vegetables, creating light and flavorful dishes.",
        "isLearned": false,
        "isFavorite": false
      },
      {
        "word": "Welsh",
        "pronunciation": "/welʃ/",
        "definition": "威尔士语；威尔士的；威尔士人",
        "partOfSpeech": "adj. / n.",
        "example": "The Welsh language has survived for centuries and continues to thrive in modern Wales.",
        "isLearned": false,
        "isFavorite": false
      },
      {
        "word": "Wales",
        "pronunciation": "/weɪlz/",
        "definition": "威尔士",
        "partOfSpeech": "n.",
        "example": "Wales is known for its stunning coastline, mountainous landscapes, and rich musical traditions.",
        "isLearned": false,
        "isFavorite": false
      },
      {
        "word": "Scotland",
        "pronunciation": "/ˈskɑːtlənd/",
        "definition": "苏格兰",
        "partOfSpeech": "n.",
        "example": "Scotland's castles, lochs, and highlands create a landscape of breathtaking beauty and mystery.",
        "isLearned": false,
        "isFavorite": false
      },
      {
        "word": "Scottish",
        "pronunciation": "/ˈskɑːtɪʃ/",
        "definition": "苏格兰语；苏格兰的；苏格兰人",
        "partOfSpeech": "adj. / n.",
        "example": "Scottish kilts and bagpipes are iconic symbols of Scottish culture and heritage.",
        "isLearned": false,
        "isFavorite": false
      },
      {
        "word": "Ireland",
        "pronunciation": "/ˈaɪərlənd/",
        "definition": "爱尔兰",
        "partOfSpeech": "n.",
        "example": "Ireland's lush green landscapes and ancient castles tell stories of a rich and turbulent history.",
        "isLearned": false,
        "isFavorite": false
      },
      {
        "word": "Irish",
        "pronunciation": "/ˈaɪrɪʃ/",
        "definition": "爱尔兰语；爱尔兰的；爱尔兰人",
        "partOfSpeech": "adj. / n.",
        "example": "Irish music, with its lively jigs and reels, brings joy and energy to any gathering.",
        "isLearned": false,
        "isFavorite": false
      },
      {
        "word": "Canada",
        "pronunciation": "/ˈkænədə/",
        "definition": "加拿大",
        "partOfSpeech": "n.",
        "example": "Canada's vast wilderness and multicultural society make it a model of peaceful coexistence.",
        "isLearned": false,
        "isFavorite": false
      },
      {
        "word": "Canadian",
        "pronunciation": "/kəˈneɪdiən/",
        "definition": "加拿大的；加拿大人",
        "partOfSpeech": "adj. / n.",
        "example": "Canadian politeness and friendliness are legendary, making visitors feel instantly welcome.",
        "isLearned": false,
        "isFavorite": false
      },
      {
        "word": "Australia",
        "pronunciation": "/əˈstreɪliə/",
        "definition": "澳大利亚",
        "partOfSpeech": "n.",
        "example": "Australia's unique wildlife and laid-back lifestyle create a distinctive national character.",
        "isLearned": false,
        "isFavorite": false
      },
      {
        "word": "Australian",
        "pronunciation": "/əˈstreɪliən/",
        "definition": "澳大利亚的；澳大利亚人",
        "partOfSpeech": "adj. / n.",
        "example": "Australian rules football combines elements of rugby and Gaelic football in a uniquely Australian sport.",
        "isLearned": false,
        "isFavorite": false
      },
      {
        "word": "Brazil",
        "pronunciation": "/brəˈzɪl/",
        "definition": "巴西",
        "partOfSpeech": "n.",
        "example": "Brazil's Carnival festival is the world's largest, showcasing incredible creativity and cultural energy.",
        "isLearned": false,
        "isFavorite": false
      },
      {
        "word": "Brazilian",
        "pronunciation": "/brəˈzɪliən/",
        "definition": "巴西的；巴西人",
        "partOfSpeech": "adj. / n.",
        "example": "Brazilian samba music and dance express the joy and rhythm that define Brazilian culture.",
        "isLearned": false,
        "isFavorite": false
      },
      {
        "word": "South Korea",
        "pronunciation": "/ˌsaʊθ kəˈriə/",
        "definition": "韩国",
        "partOfSpeech": "n.",
        "example": "South Korea's technological innovation and K-pop culture have made it a global trendsetter.",
        "isLearned": false,
        "isFavorite": false
      },
      {
        "word": "Korean",
        "pronunciation": "/kəˈriən/",
        "definition": "韩语；韩国的；韩国人",
        "partOfSpeech": "adj. / n.",
        "example": "Korean cuisine, with its fermented foods and spicy flavors, offers a unique culinary experience.",
        "isLearned": false,
        "isFavorite": false
      },
      {
        "word": "Netherlands",
        "pronunciation": "/ˈneðərləndz/",
        "definition": "荷兰",
        "partOfSpeech": "n.",
        "example": "The Netherlands is famous for its windmills, tulips, and innovative approach to urban planning.",
        "isLearned": false,
        "isFavorite": false
      },
      {
        "word": "Dutch",
        "pronunciation": "/dʌtʃ/",
        "definition": "荷兰语；荷兰的；荷兰人",
        "partOfSpeech": "adj. / n.",
        "example": "Dutch design is renowned for its functionality, simplicity, and attention to detail.",
        "isLearned": false,
        "isFavorite": false
      },
      {
        "word": "Sweden",
        "pronunciation": "/ˈswiːdən/",
        "definition": "瑞典",
        "partOfSpeech": "n.",
        "example": "Sweden's commitment to equality and environmental sustainability sets a high standard for modern societies.",
        "isLearned": false,
        "isFavorite": false
      },
      {
        "word": "Swedish",
        "pronunciation": "/ˈswiːdɪʃ/",
        "definition": "瑞典语；瑞典的；瑞典人",
        "partOfSpeech": "adj. / n.",
        "example": "Swedish furniture design, with its clean lines and natural materials, has influenced global aesthetics.",
        "isLearned": false,
        "isFavorite": false
      },
      {
        "word": "Switzerland",
        "pronunciation": "/ˈswɪtsərlənd/",
        "definition": "瑞士",
        "partOfSpeech": "n.",
        "example": "Switzerland's multilingual society and neutral status make it a hub for international organizations.",
        "isLearned": false,
        "isFavorite": false
      },
      {
        "word": "Swiss",
        "pronunciation": "/swɪs/",
        "definition": "瑞士的；瑞士人",
        "partOfSpeech": "adj. / n.",
        "example": "Swiss watches are synonymous with precision and reliability in timekeeping.",
        "isLearned": false,
        "isFavorite": false
      }
    ]
  }
};

export default function UnitPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const unit = unitData[params.id];

  const [words, setWords] = useState(unit?.words || []);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  if (!unit) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">单元不存在</h2>
        <ClayButton onClick={() => router.push("/")}>返回首页</ClayButton>
      </div>
    );
  }

  const speak = (word: string) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  };

  const toggleFavorite = (wordId: number) => {
    setWords(words.map(w =>
      w.id === wordId ? { ...w, isFavorite: !w.isFavorite } : w
    ));
  };

  const startLearning = () => {
    router.push("/learn");
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.push("/")}
          className="text-gray-600 hover:text-primary transition-colors mb-4 inline-flex items-center gap-2"
        >
          ← 返回单元列表
        </button>

        <ClayCard>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-5xl">{unit.icon}</div>
              <div>
                <h1 className="text-3xl font-bold font-display text-gray-800 mb-2">
                  {unit.name}
                </h1>
                <p className="text-gray-600">
                  {unit.learnedWords}/{unit.totalWords} 个单词
                </p>
              </div>
            </div>

            <ClayButton onClick={startLearning}>
              <BookOpen size={20} className="inline mr-2" />
              开始学习
            </ClayButton>
          </div>

          {/* Progress */}
          <div className="mt-6">
            <div className="progress-bar h-3">
              <div
                className="progress-fill"
                style={{ width: `${(unit.learnedWords / unit.totalWords) * 100}%` }}
              />
            </div>
          </div>
        </ClayCard>
      </div>

      {/* Words Grid */}
      <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
        {words.map((word: any) => (
          <ClayCard key={word.id} className={viewMode === "list" ? "flex items-center justify-between" : ""}>
            <div className={viewMode === "list" ? "flex items-center gap-4 flex-1" : ""}>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold font-display text-primary">
                    {word.word}
                  </h3>
                  {word.isLearned && (
                    <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs">
                      已掌握
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mb-1">{word.pronunciation}</p>
                <p className="text-gray-700">
                  <span className="text-blue-600 font-medium">{word.partOfSpeech}</span> {word.definition}
                </p>
                <p className="text-sm text-gray-500 italic mt-2">&quot;{word.example}&quot;</p>
              </div>
            </div>

            <div className={`flex gap-2 mt-4 ${viewMode === "list" ? "mt-0" : ""}`}>
              <button
                onClick={() => speak(word.word)}
                className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors"
              >
                <Volume2 className="text-primary" size={18} />
              </button>
              <button
                onClick={() => toggleFavorite(word.id)}
                className={`p-2 rounded-lg transition-colors ${
                  word.isFavorite ? "bg-yellow-100" : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                <Star
                  className={word.isFavorite ? "text-yellow-500 fill-yellow-500" : "text-gray-400"}
                  size={18}
                />
              </button>
            </div>
          </ClayCard>
        ))}
      </div>

      {/* Empty State */}
      {words.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <p className="text-gray-500">暂无单词</p>
        </div>
      )}
    </div>
  );
}
