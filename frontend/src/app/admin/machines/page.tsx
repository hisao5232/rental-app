"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function MachineListPage() {
  const [machines, setMachines] = useState([]);

  const fetchMachines = () => {
    fetch("https://api-rental.go-pro-world.net/machines")
      .then(res => res.json())
      .then(data => setMachines(data))
      .catch(err => console.error("取得エラー:", err));
  };

  useEffect(() => {
    fetchMachines();
  }, []);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`「${name}」を削除してもよろしいですか？`)) return;

    const response = await fetch(`https://api-rental.go-pro-world.net/machines/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      fetchMachines(); // 画面を更新
    } else {
      alert("削除に失敗しました。");
    }
  };

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
          <h1 className="text-2xl font-bold text-gray-900 italic">STOCK LIST / 管理</h1>
          <Link href="/admin/machines/new" className="bg-gray-800 text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-sm">
            + 新規重機を登録
          </Link>
        </div>

        <div className="bg-white overflow-hidden shadow-sm border border-gray-200 rounded-2xl">
          <table className="w-full text-left text-sm text-gray-700">
            <thead className="bg-gray-50 text-gray-600 font-bold border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">名称 / メーカー</th>
                <th className="px-6 py-4">型式 / 機番</th>
                <th className="px-6 py-4">稼働状態</th>
                <th className="px-6 py-4 text-right">料金</th>
                <th className="px-6 py-4 text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {machines.map((m: any) => (
                <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900">{m.name}<br /><span className="text-xs font-normal text-gray-400">{m.maker}</span></td>
                  <td className="px-6 py-4 font-mono text-xs">{m.model_number}<br />No.{m.serial_number}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(m.status)}`}>
                      ● {m.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold">¥{Number(m.daily_rate).toLocaleString()}</td>
                  <td className="px-6 py-4 text-center space-x-4">
                    <Link href={`/admin/machines/${m.id}/edit`} className="text-blue-600 hover:underline">編集</Link>
                    <button onClick={() => handleDelete(m.id, m.name)} className="text-red-600 hover:underline">削除</button>
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