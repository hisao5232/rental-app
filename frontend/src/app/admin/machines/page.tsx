"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function MachineListPage() {
  const [machines, setMachines] = useState([]);

  useEffect(() => {
    // バックエンドから重機一覧を取得
    fetch("https://api-rental.go-pro-world.net/machines")
      .then(res => res.json())
      .then(data => setMachines(data))
      .catch(err => console.error("取得エラー:", err));
  }, []);

  // 状態に応じたテキスト色・背景色を返す関数
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "在庫あり": return "bg-green-100 text-green-700 border-green-200";
      case "貸出中": return "bg-blue-100 text-blue-700 border-blue-200";
      case "点検中": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "休止中": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 italic">STOCK LIST</h1>
            <p className="text-sm text-gray-500">在庫重機 一覧・管理</p>
          </div>
          <div className="flex gap-4">
            <Link href="/admin" className="text-gray-600 hover:text-gray-900 self-center text-sm mr-4">
              ← 管理メニューへ
            </Link>
            <Link href="/admin/machines/new" className="bg-gray-800 text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-700 shadow-sm transition">
              + 新規重機を登録
            </Link>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm border border-gray-200 rounded-2xl">
          <table className="w-full text-left text-sm text-gray-700">
            <thead className="bg-gray-50 text-gray-600 font-bold border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">名称 / メーカー</th>
                <th className="px-6 py-4">型式 / 機番</th>
                <th className="px-6 py-4">性能 / 仕様</th>
                <th className="px-6 py-4">稼働状態</th>
                <th className="px-6 py-4 text-right">レンタル料金 (日極/月極)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {machines.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-400">
                    登録されている重機がありません。
                  </td>
                </tr>
              ) : (
                machines.map((m: any) => (
                  <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">
                      {m.name}<br />
                      <span className="text-xs font-normal text-gray-500">{m.maker || "---"}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-mono">{m.model_number || "---"}</span><br />
                      <span className="text-xs text-gray-400">No. {m.serial_number || "---"}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs mb-1.5">{m.performance} / {m.attachment_type}</div>
                      <div className="flex flex-wrap gap-1">
                        {m.has_crane && <span className="bg-blue-50 text-blue-600 text-[10px] px-1.5 py-0.5 rounded border border-blue-100">🏗️ クレーン</span>}
                        {m.is_ultra_small_swing && <span className="bg-green-50 text-green-600 text-[10px] px-1.5 py-0.5 rounded border border-green-100">🔄 超小旋回</span>}
                        {m.has_service_port && <span className="bg-orange-50 text-orange-600 text-[10px] px-1.5 py-0.5 rounded border border-orange-100">🔌 SP付</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(m.status)}`}>
                        ● {m.status || "在庫あり"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="text-gray-900 font-bold">
                        ¥{Number(m.daily_rate).toLocaleString()}<span className="text-[10px] ml-1 font-normal text-gray-500">/日</span>
                      </div>
                      <div className="text-xs text-gray-500 italic">
                        ¥{Number(m.monthly_rate).toLocaleString()}<span className="text-[10px] ml-1">/月</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
