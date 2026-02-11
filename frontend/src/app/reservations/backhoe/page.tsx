"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BackhoeReservation() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    category: "バックホー",
    startDate: "",
    returnDate: "",
    rateType: "日極",
    performance: "",
    maker: "",
    attachment: "",
    siteAddress: "",      // 追加
    needsTransport: false, // 追加
    options: {
      crane: false,
      servicePort: false,
      ultraSwing: false,
    },
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("https://api-rental.go-pro-world.net/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("お問い合わせを受け付けました。担当者よりご連絡いたします。");
        router.push("/reservations");
      } else {
        alert("送信に失敗しました。時間をおいて再度お試しください。");
      }
    } catch (error) {
      console.error("通信エラー:", error);
      alert("サーバーと通信できませんでした。");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white pb-10">
      {/* ヘッダー */}
      <div className="bg-gray-800 text-white p-6 text-center shadow-md">
        <h1 className="text-lg font-bold">🚜 バックホー 予約・問い合わせ</h1>
        <p className="text-xs opacity-80 mt-1">現場情報と希望スペックを入力してください</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 max-w-xl mx-auto space-y-8">
        
        {/* 1. 日程とプラン */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold border-l-4 border-gray-800 pl-2 text-gray-800">1. 日程とプラン</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">使用開始日</label>
              <input 
                type="date" 
                required 
                className="w-full border-b-2 border-gray-200 p-2 focus:border-gray-800 outline-none" 
                onChange={e => setFormData({...formData, startDate: e.target.value})} 
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">返却予定日</label>
              <input 
                type="date" 
                className="w-full border-b-2 border-gray-200 p-2 focus:border-gray-800 outline-none" 
                onChange={e => setFormData({...formData, returnDate: e.target.value})} 
              />
            </div>
          </div>
          
          <div className="flex gap-4 p-2 bg-gray-50 rounded-xl mt-2">
            {["日極", "月極"].map(type => (
              <label key={type} className={`flex-1 text-center py-3 rounded-lg cursor-pointer font-bold transition-all border ${
                formData.rateType === type 
                ? "bg-gray-800 text-white border-gray-800 shadow-md" 
                : "bg-white text-gray-500 border-gray-200"
              }`}>
                <input 
                  type="radio" 
                  name="rateType" 
                  className="hidden" 
                  onChange={() => setFormData({...formData, rateType: type})} 
                />
                {type}
              </label>
            ))}
          </div>
        </section>

        {/* 2. 現場情報（追加セクション） */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold border-l-4 border-gray-800 pl-2 text-gray-800">2. 現場情報</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">現場住所</label>
              <input 
                type="text" 
                required
                placeholder="例：神奈川県小田原市..." 
                className="w-full border-b border-gray-200 p-2 focus:border-gray-800 outline-none"
                onChange={e => setFormData({...formData, siteAddress: e.target.value})} 
              />
            </div>
            
            <label className="flex items-center p-4 border border-blue-100 bg-blue-50 rounded-xl gap-3 cursor-pointer hover:bg-blue-100 transition">
              <input 
                type="checkbox" 
                className="w-6 h-6 accent-blue-600" 
                onChange={e => setFormData({...formData, needsTransport: e.target.checked})} 
              />
              <div>
                <span className="block text-sm font-bold text-blue-900">回送（運搬）を依頼する</span>
                <span className="block text-[10px] text-blue-700">弊社による重機の配送・引き上げを希望する場合</span>
              </div>
            </label>
          </div>
        </section>

        {/* 3. 希望スペック */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold border-l-4 border-gray-800 pl-2 text-gray-800">3. 希望スペック</h2>
          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="性能 (例: 0.11m3, 3tクラス)" 
              className="w-full border-b border-gray-200 p-2 focus:border-gray-800 outline-none"
              onChange={e => setFormData({...formData, performance: e.target.value})} 
            />
            <input 
              type="text" 
              placeholder="希望メーカー (任意)" 
              className="w-full border-b border-gray-200 p-2 focus:border-gray-800 outline-none"
              onChange={e => setFormData({...formData, maker: e.target.value})} 
            />
            <input 
              type="text" 
              placeholder="アタッチメント (例: 網バケット, フォーク)" 
              className="w-full border-b border-gray-200 p-2 focus:border-gray-800 outline-none"
              onChange={e => setFormData({...formData, attachment: e.target.value})} 
            />
          </div>
        </section>

        {/* 4. オプション */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold border-l-4 border-gray-800 pl-2 text-gray-800">4. 必須オプション</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: "crane", label: "🏗️ クレーン仕様" },
              { id: "servicePort", label: "🔌 サービスポート" },
              { id: "ultraSwing", label: "🔄 超小旋回" },
            ].map(opt => (
              <label key={opt.id} className="flex items-center p-3 border border-gray-200 rounded-xl gap-3 cursor-pointer hover:bg-gray-50 transition">
                <input 
                  type="checkbox" 
                  className="w-5 h-5 accent-gray-800" 
                  onChange={e => {
                    const newOptions = { ...formData.options, [opt.id]: e.target.checked };
                    setFormData({ ...formData, options: newOptions });
                  }} 
                />
                <span className="text-sm text-gray-700">{opt.label}</span>
              </label>
            ))}
          </div>
        </section>

        {/* 備考 */}
        <section className="space-y-2">
          <label className="block text-xs text-gray-500">その他、ご要望など</label>
          <textarea 
            className="w-full border rounded-xl p-3 h-24 bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-gray-800 transition"
            placeholder="搬入路の幅員や、作業内容など詳細があれば記入してください"
            onChange={e => setFormData({...formData, message: e.target.value})}
          ></textarea>
        </section>

        {/* 送信ボタン */}
        <div className="pt-4">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`w-full py-4 rounded-full font-bold shadow-xl transition-all ${
              isSubmitting 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-gray-900 text-white hover:bg-gray-700 active:scale-95"
            }`}
          >
            {isSubmitting ? "送信中..." : "この内容で問い合わせる"}
          </button>

          <button 
            type="button"
            onClick={() => router.back()}
            className="w-full mt-4 text-sm text-gray-400 hover:text-gray-600 font-medium"
          >
            キャンセルして戻る
          </button>
        </div>
      </form>
    </main>
  );
}
