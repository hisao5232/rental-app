"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    // ブラウザの保存領域からユーザー情報を取得
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      router.push("/login"); // ログインしてなければログイン画面へ
    } else {
      setUser(JSON.parse(savedUser));
    }
  }, [router]);

  if (!user) return <div className="p-8">読み込み中...</div>;

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <main className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー部分 */}
        <div className="flex justify-between items-center mb-12 mt-10">
          <div className="text-left">
            <h1 className="text-3xl font-bold text-gray-900">メインメニュー</h1>
            <p className="text-gray-500">こんにちは、{user.email} さん</p>
          </div>
          <button 
            onClick={handleLogout}
            className="text-sm text-gray-400 hover:text-gray-600 underline"
          >
            ログアウト
          </button>
        </div>

        {/* メニューボタン */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button className="p-10 border-2 border-gray-100 rounded-2xl bg-gray-50 hover:bg-white hover:border-gray-800 transition-all text-left">
            <h2 className="text-xl font-bold mb-2">🚜 予約メニュー</h2>
            <p className="text-sm text-gray-600">重機の空き状況確認と予約</p>
          </button>

          {user.role === "admin" && (
            <button className="p-10 border-2 border-gray-100 rounded-2xl bg-gray-50 hover:bg-white hover:border-gray-800 transition-all text-left">
              <h2 className="text-xl font-bold mb-2 text-gray-900">🛠️ 管理メニュー</h2>
              <p className="text-sm text-gray-600">重機登録・顧客管理・点検設定</p>
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
