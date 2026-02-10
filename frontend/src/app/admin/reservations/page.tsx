"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    fetch("https://api-rental.go-pro-world.net/reservations")
      .then(res => res.json())
      .then(data => setReservations(data))
      .catch(err => console.error("取得エラー:", err));
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 italic uppercase tracking-wider">Reservation List</h1>
            <p className="text-sm text-gray-500">届いた予約・問い合わせ一覧</p>
          </div>
          <Link href="/admin" className="text-gray-600 hover:text-gray-900 text-sm font-bold border-b border-gray-300">
            ← 管理メニューへ戻る
          </Link>
        </div>

        <div className="grid gap-6">
          {reservations.length === 0 ? (
            <div className="bg-white p-20 text-center rounded-3xl border border-gray-200 text-gray-400 shadow-sm">
              現在、新しい問い合わせはありません。
            </div>
          ) : (
            reservations.map((res: any) => (
              <div key={res.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between gap-6 hover:shadow-md transition-shadow">
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-blue-600 text-white text-[10px] px-2.5 py-1 rounded-md font-black">
                      {res.category}
                    </span>
                    <span className="text-xs text-gray-400 font-mono">
                      ID: {res.id} | 受信: {new Date(res.created_at).toLocaleString('ja-JP')}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 border-t border-gray-50 pt-4">
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">使用開始日</p>
                      <p className="font-bold text-gray-800 text-sm">{res.start_date}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">プラン</p>
                      <p className="font-bold text-gray-800 text-sm">{res.rate_type}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">性能/メーカー</p>
                      <p className="text-sm text-gray-700 font-medium">{res.performance} / {res.maker || "指定なし"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">アタッチメント</p>
                      <p className="text-sm text-gray-700 font-medium">{res.attachment || "標準"}</p>
                    </div>
                  </div>

                  {res.message && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-xl text-sm text-gray-600 border-l-4 border-gray-200">
                      <p className="font-bold text-[10px] text-gray-400 mb-1">備考・要望</p>
                      {res.message}
                    </div>
                  )}
                </div>

                {/* 操作エリア */}
                <div className="flex flex-col items-center justify-center md:border-l border-gray-100 md:pl-8 min-w-[180px] gap-4">
                   <div className="text-center">
                     <span className="text-[10px] text-blue-600 font-black border-2 border-blue-600 px-3 py-1 rounded-full uppercase">
                       New Request
                     </span>
                   </div>
                   
                   <Link 
                     href={`/admin/reservations/${res.id}/match`}
                     className="w-full text-center bg-gray-900 text-white text-xs py-3 rounded-xl hover:bg-gray-700 transition-all font-bold shadow-lg active:scale-95"
                   >
                     適合重機を確認 →
                   </Link>
                </div>

              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
