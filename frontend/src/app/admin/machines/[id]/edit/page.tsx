"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditMachinePage() {
  const router = useRouter();
  const params = useParams(); // URLからIDを取得
  
  // 初期値を登録画面と同じ構造で持たせることで TypeScript のエラーを防ぐ
  const [formData, setFormData] = useState({
    name: "",
    model_number: "",
    serial_number: "",
    maker: "",
    performance: "",
    attachment_type: "",
    has_crane: false,
    has_service_port: false,
    is_ultra_small_swing: false,
    is_rear_small_swing: false,
    status: "在庫あり",
    daily_rate: 0,
    monthly_rate: 0,
  });

  const [loading, setLoading] = useState(true);

  // 1. 既存のデータをバックエンドから取得してフォームに入れる
  useEffect(() => {
    const fetchMachine = async () => {
      try {
        const response = await fetch("https://api-rental.go-pro-world.net/machines");
        const data = await response.json();
        // 一覧の中から、URLのIDと一致するデータを探す
        const target = data.find((m: any) => m.id === Number(params.id));
        
        if (target) {
          setFormData(target);
        }
        setLoading(false);
      } catch (error) {
        console.error("読み込みエラー:", error);
        setLoading(false);
      }
    };
    fetchMachine();
  }, [params.id]);

  const handleSubmit = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`https://api-rental.go-pro-world.net/machines/${params.id}`, {
        method: "PUT", // 更新はPUTメソッド
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("重機情報を更新しました！");
        router.push("/admin/machines"); // 一覧に戻る
      } else {
        alert("更新に失敗しました。");
      }
    } catch (error) {
      console.error("通信エラー:", error);
      alert("サーバーと通信できませんでした。");
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">データを読み込み中...</div>;

  return (
    <main className="min-h-screen bg-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8 border-b pb-4 italic">
          🛠️ EDIT MACHINE / 重機情報の編集
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 基本情報 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">名称</label>
              <input type="text" className="mt-1 w-full p-2 bg-gray-50 border border-gray-300 rounded" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">メーカー</label>
              <input type="text" className="mt-1 w-full p-2 bg-gray-50 border border-gray-300 rounded" 
                value={formData.maker}
                onChange={e => setFormData({...formData, maker: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">型式</label>
              <input type="text" className="mt-1 w-full p-2 bg-gray-50 border border-gray-300 rounded" 
                value={formData.model_number}
                onChange={e => setFormData({...formData, model_number: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">機番</label>
              <input type="text" className="mt-1 w-full p-2 bg-gray-50 border border-gray-300 rounded" 
                value={formData.serial_number}
                onChange={e => setFormData({...formData, serial_number: e.target.value})} />
            </div>
          </div>

          {/* 稼働状況と料金設定エリア */}
          <div className="bg-blue-50 p-4 rounded-xl space-y-4 border border-blue-100">
            <p className="text-sm font-bold text-blue-900">レンタル・稼働設定</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600">稼働状態</label>
                <select 
                  className="mt-1 w-full p-2 bg-white border border-gray-300 rounded text-sm"
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value})}
                >
                  <option value="在庫あり">在庫あり</option>
                  <option value="貸出中">貸出中</option>
                  <option value="点検中">点検中</option>
                  <option value="休止中">休止中</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600">日極料金 (円)</label>
                <input type="number" className="mt-1 w-full p-2 bg-white border border-gray-300 rounded text-sm"
                  value={formData.daily_rate}
                  onChange={e => setFormData({...formData, daily_rate: Number(e.target.value)})} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600">月極料金 (円)</label>
                <input type="number" className="mt-1 w-full p-2 bg-white border border-gray-300 rounded text-sm"
                  value={formData.monthly_rate}
                  onChange={e => setFormData({...formData, monthly_rate: Number(e.target.value)})} />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">性能・スペック</label>
            <input type="text" className="mt-1 w-full p-2 bg-gray-50 border border-gray-300 rounded" 
              value={formData.performance}
              onChange={e => setFormData({...formData, performance: e.target.value})} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">アタッチメント</label>
            <input type="text" className="mt-1 w-full p-2 bg-gray-50 border border-gray-300 rounded" 
              value={formData.attachment_type}
              onChange={e => setFormData({...formData, attachment_type: e.target.value})} />
          </div>

          {/* 仕様（チェックボックス） */}
          <div className="bg-gray-50 p-4 rounded-xl space-y-3">
            <p className="text-sm font-bold text-gray-700 mb-2">仕様オプション</p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: "has_crane", label: "🏗️ クレーン仕様" },
                { id: "has_service_port", label: "🔌 サービスポート" },
                { id: "is_ultra_small_swing", label: "🔄 超小旋回" },
                { id: "is_rear_small_swing", label: "📐 後方小旋回" },
              ].map((item) => (
                <label key={item.id} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 accent-gray-800"
                    checked={(formData as any)[item.id]}
                    onChange={(e) => setFormData({ ...formData, [item.id]: e.target.checked })}
                  />
                  <span className="text-sm text-gray-700">{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <button type="button" onClick={() => router.back()} className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              キャンセル
            </button>
            <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-bold shadow-md">
              変更を保存する
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
