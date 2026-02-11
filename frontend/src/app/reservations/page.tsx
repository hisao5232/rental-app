"use client";

import Link from "next/link";

const categories = [
  { id: "backhoe", name: "バックホー", icon: "🚜", desc: "0.11m3〜0.25m3クラス" },
  { id: "roller", name: "ローラー", icon: "🚜", desc: "振動ローラー・タイヤローラー" },
  { id: "loader", name: "タイヤショベル", icon: "🚜", desc: "ホイールローダー・除雪" },
  { id: "others", name: "その他", icon: "🔧", desc: "キャリア・発電機・小物など" },
];

export default function ReservationMenu() {
  return (
    <main className="min-h-screen bg-white p-8">
      <div className="max-w-xl mx-auto">
        
        {/* ヘッダー部分 */}
        <div className="mb-12 mt-10">
          <h1 className="text-3xl font-black text-gray-900 italic tracking-tighter uppercase">Category</h1>
          <p className="text-gray-500 mt-2 font-medium">予約・お問い合わせの機種を選択してください</p>
        </div>
        
        {/* カテゴリ一覧 */}
        <div className="grid grid-cols-1 gap-4">
          {categories.map((cat) => (
            <Link 
              key={cat.id} 
              href={`/reservations/${cat.id}`}
              className="flex items-center justify-between p-6 bg-white rounded-3xl border-2 border-gray-100 hover:border-blue-500 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl group-hover:scale-110 transition-transform">{cat.icon}</span>
                <div className="text-left">
                  <span className="block text-lg font-bold text-gray-800">{cat.name}</span>
                  <span className="text-xs text-gray-400">{cat.desc}</span>
                </div>
              </div>
              <span className="text-gray-300 group-hover:text-blue-500 transition-colors font-bold text-xl">→</span>
            </Link>
          ))}
        </div>

        {/* --- トップへ戻るボタン --- */}
        <div className="mt-16 flex justify-center">
          <Link 
            href="/" 
            className="flex items-center gap-2 px-10 py-3 rounded-full border border-gray-200 text-gray-400 hover:text-gray-900 hover:border-gray-900 hover:bg-gray-50 transition-all font-bold text-xs uppercase tracking-[0.2em]"
          >
            <span className="text-base">←</span>
            Back to Top
          </Link>
        </div>

        {/* 装飾用のフッター */}
        <div className="mt-20 text-center">
          <p className="text-[10px] text-gray-200 font-mono uppercase tracking-widest">
            Select equipment to proceed with reservation
          </p>
        </div>
      </div>
    </main>
  );
}
