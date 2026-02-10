"use client";
import Link from "next/link";

const categories = [
  { id: "backhoe", name: "バックホー", icon: "🚜" },
  { id: "roller", name: "ローラー", icon: "🚜" },
  { id: "loader", name: "タイヤショベル", icon: "🚜" },
  { id: "others", name: "その他", icon: "🔧" },
];

export default function ReservationMenu() {
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-md mx-auto">
        <h1 className="text-xl font-bold text-center mb-8">予約・お問い合わせ</h1>
        <p className="text-sm text-gray-600 mb-6 text-center">ご希望の機種を選択してください</p>
        
        <div className="grid grid-cols-1 gap-4">
          {categories.map((cat) => (
            <Link 
              key={cat.id} 
              href={`/reservations/${cat.id}`}
              className="flex items-center justify-between p-5 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-gray-800 transition"
            >
              <span className="text-lg font-bold">{cat.icon} {cat.name}</span>
              <span className="text-gray-400">→</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
