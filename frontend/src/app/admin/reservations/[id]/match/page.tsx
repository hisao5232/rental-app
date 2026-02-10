"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function MatchingPage() {
  const params = useParams();
  const [reservation, setReservation] = useState<any>(null);
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. 全予約を取得して該当のものを探す
        const resRes = await fetch("https://api-rental.go-pro-world.net/reservations");
        const resData = await resRes.json();
        const targetRes = resData.find((r: any) => r.id === Number(params.id));
        setReservation(targetRes);

        // 2. 在庫一覧を取得
        const macRes = await fetch("https://api-rental.go-pro-world.net/machines");
        const macData = await macRes.json();
        setMachines(macData);

        setLoading(false);
      } catch (err) {
        console.error("データ取得エラー:", err);
        setLoading(false);
      }
    };
    fetchData();
  }, [params.id]);

  if (loading) return <div className="p-8">読み込み中...</div>;
  if (!reservation) return <div className="p-8">データが見つかりません。</div>;

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">🔍 適合重機のマッチング</h1>
          <Link href="/admin/reservations" className="text-sm text-gray-500 hover:underline">← 戻る</Link>
        </header>

        {/* お客様の要望（左側に固定して見やすくする） */}
        <div className="bg-orange-50 border-2 border-orange-200 p-6 rounded-2xl mb-8 shadow-sm">
          <h2 className="text-orange-800 font-bold mb-4 flex items-center">
            <span className="mr-2">📝</span> お客様の希望スペック
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-xs text-orange-600">希望機種</p>
              <p className="font-bold text-lg">{reservation.category}</p>
            </div>
            <div>
              <p className="text-xs text-orange-600">希望性能</p>
              <p className="font-bold text-lg">{reservation.performance}</p>
            </div>
            <div>
              <p className="text-xs text-orange-600">アタッチメント</p>
              <p className="font-bold text-lg">{reservation.attachment || "標準"}</p>
            </div>
            <div>
              <p className="text-xs text-orange-600">希望メーカー</p>
              <p className="font-bold text-lg">{reservation.maker || "指定なし"}</p>
            </div>
          </div>
        </div>

        {/* 在庫からの候補一覧 */}
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <span className="mr-2">🚜</span> 在庫重機からの候補
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {machines
            .filter((m: any) => m.status === "在庫あり") // 在庫ありのみ表示
            .map((m: any) => (
              <div key={m.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex justify-between hover:border-blue-400 transition">
                <div>
                  <h3 className="font-bold text-gray-900">{m.name}</h3>
                  <p className="text-xs text-gray-500">{m.maker} / {m.model_number}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="bg-gray-100 text-[10px] px-2 py-1 rounded">性能: {m.performance}</span>
                    <span className="bg-gray-100 text-[10px] px-2 py-1 rounded">SP: {m.has_service_port ? "有" : "無"}</span>
                    <span className="bg-gray-100 text-[10px] px-2 py-1 rounded">クレーン: {m.has_crane ? "有" : "無"}</span>
                  </div>
                </div>
                <div className="text-right flex flex-col justify-between">
                  <p className="font-bold text-blue-600 text-sm">¥{Number(m.daily_rate).toLocaleString()}/日</p>
                  <button 
                    onClick={() => alert(`この機体(${m.name})でお客様に回答する準備をします。`)}
                    className="bg-blue-50 text-blue-700 text-xs px-3 py-2 rounded-lg font-bold hover:bg-blue-100"
                  >
                    選択
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </main>
  );
}
