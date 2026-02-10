"use client";
import Link from "next/link";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8 border-b pb-4 italic">
          🛠️ 管理者ダッシュボード
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 在庫一覧リンク */}
          <Link href="/admin/machines" className="p-8 bg-white border border-gray-200 rounded-2xl hover:border-blue-500 hover:shadow-md transition-all block group shadow-sm">
            <div className="text-3xl mb-4 group-hover:scale-110 transition-transform text-center md:text-left">📋</div>
            <h2 className="font-bold text-xl text-gray-800">在庫重機 一覧・管理</h2>
            <p className="text-sm text-gray-500 mt-2">登録済みの重機の編集・削除・状態変更を行います。</p>
          </Link>

          {/* 重機登録リンク */}
          <Link href="/admin/machines/new" className="p-8 bg-white border border-gray-200 rounded-2xl hover:border-green-500 hover:shadow-md transition-all block group shadow-sm">
            <div className="text-3xl mb-4 group-hover:scale-110 transition-transform text-center md:text-left">🚜</div>
            <h2 className="font-bold text-xl text-gray-800">新規重機 登録</h2>
            <p className="text-sm text-gray-500 mt-2">新しい車両をデータベースに追加します。</p>
          </Link>

          {/* 問い合わせ確認リンク（ここが重要！） */}
          <Link href="/admin/reservations" className="p-8 bg-white border border-gray-200 rounded-2xl hover:border-orange-500 hover:shadow-md transition-all block group shadow-sm">
            <div className="text-3xl mb-4 group-hover:scale-110 transition-transform text-center md:text-left">📩</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">問い合わせ確認</h2>
            <p className="text-sm text-gray-600 mt-2">届いた予約リクエストを確認し、在庫とのマッチングを行います。</p>
          </Link>
        </div>

        <div className="mt-12 text-center">
          <Link href="/" className="text-gray-400 hover:text-gray-700 underline text-sm">
            トップページへ戻る
          </Link>
        </div>
      </div>
    </main>
  );
}
