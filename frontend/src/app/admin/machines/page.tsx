// frontend/src/app/admin/machines/page.tsx
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

  return (
    <main className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 italic">STOCK LIST / 在庫一覧</h1>
          <Link href="/admin/machines/new" className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700">
            + 新規登録
          </Link>
        </div>

        <div className="overflow-x-auto border border-gray-200 rounded-xl">
          <table className="w-full text-left text-sm text-gray-700">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
              <tr>
                <th className="px-4 py-3">名称 / メーカー</th>
                <th className="px-4 py-3">型式 / 機番</th>
                <th className="px-4 py-3">性能 / アタッチメント</th>
                <th className="px-4 py-3">仕様</th>
                <th className="px-4 py-3">状態</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {machines.map((m: any) => (
                <tr key={m.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-4 font-bold text-gray-900">
                    {m.name}<br />
                    <span className="text-xs font-normal text-gray-500">{m.maker}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">{m.model_number}</span><br />
                    <span className="text-xs text-gray-500">No. {m.serial_number}</span>
                  </td>
                  <td className="px-4 py-4">
                    {m.performance}<br />
                    <span className="text-xs text-gray-500">{m.attachment_type}</span>
                  </td>
                  <td className="px-4 py-4 space-x-1">
                    {m.has_crane && <span className="bg-blue-50 text-blue-600 text-[10px] px-1.5 py-0.5 rounded border border-blue-200">🏗️ クレーン</span>}
                    {m.is_ultra_small_swing && <span className="bg-green-50 text-green-600 text-[10px] px-1.5 py-0.5 rounded border border-green-200">🔄 超小旋回</span>}
                    {m.has_service_port && <span className="bg-orange-50 text-orange-600 text-[10px] px-1.5 py-0.5 rounded border border-orange-200">🔌 SP付</span>}
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-green-600 font-bold">● 在庫あり</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
