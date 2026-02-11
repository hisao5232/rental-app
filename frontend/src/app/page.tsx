"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// ユーザー情報の型定義に full_name を追加
interface UserData {
  email: string;
  role: string;
  full_name: string;
}

export default function HomePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const router = useRouter();

  useEffect(() => {
    // ブラウザの保存領域からユーザー情報を取得
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      router.push("/login"); // ログインしてなければログイン画面へ
    } else {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (e) {
        console.error("ユーザー情報のパースに失敗しました");
        router.push("/login");
      }
    }
  }, [router]);

  // 読み込み中、またはリダイレクト前の表示
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse font-bold text-gray-400">読み込み中...</div>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <main className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* ヘッダー部分 */}
        <div className="flex justify-between items-end mb-12 mt-10 border-b border-gray-100 pb-8">
          <div className="text-left">
            <h1 className="text-3xl font-black text-gray-900 italic tracking-tighter uppercase">Main Menu</h1>
            <p className="text-gray-500 mt-2">
              こんにちは、
              <span className="text-gray-900 font-bold px-1">
                {user.full_name || user.email.split('@')[0]}
              </span> 
              さん
            </p>
          </div>
          <button 
            onClick={handleLogout}
            className="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-widest border border-gray-200 px-3 py-1 rounded-full"
          >
            Logout
          </button>
        </div>

        {/* メニューボタン */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* 一般予約メニュー */}
          <Link 
            href="/reservations" 
            className="p-10 border-2 border-gray-100 rounded-3xl bg-white hover:border-blue-500 hover:shadow-xl transition-all text-left block group"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🚜</div>
            <h2 className="text-xl font-bold mb-2 text-gray-800">予約メニュー</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              重機の空き状況確認と予約リクエストの送信を行います。
            </p>
          </Link>

          {/* 管理者専用メニュー */}
          {user.role === "admin" && (
            <Link 
              href="/admin" 
              className="p-10 border-2 border-gray-100 rounded-3xl bg-gray-50 hover:bg-white hover:border-gray-900 hover:shadow-xl transition-all text-left block group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🛠️</div>
              <h2 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-blue-600">
                管理者メニュー
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                重機の新規登録・在庫管理・届いた問い合わせの適合確認を行います。
              </p>
            </Link>
          )}
        </div>

        {/* フッター的な装飾 */}
        <div className="mt-20 text-center">
          <p className="text-[10px] text-gray-300 font-mono uppercase tracking-[0.2em]">
            Heavy Machine Rental System v2.0
          </p>
        </div>
      </div>
    </main>
  );
}
