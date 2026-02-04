// frontend/src/app/admin/page.tsx
import Link from "next/link";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8 border-b pb-4">
          管理者専用メニュー
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link 
            href="/admin/machines/new" 
            className="p-6 border border-gray-200 rounded-xl hover:bg-gray-50 transition"
          >
            <h2 className="font-bold text-lg">🚜 在庫重機の登録</h2>
            <p className="text-sm text-gray-500 mt-1">新しい車両をデータベースに追加します</p>
          </Link>

          {/* 今後ここに追加予定 */}
          <div className="p-6 border border-gray-100 rounded-xl bg-gray-50 opacity-50">
            <h2 className="font-bold text-lg text-gray-400">📋 貸出状況（開発中）</h2>
          </div>
        </div>

        <div className="mt-8">
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 underline">
            ← トップページへ戻る
          </Link>
        </div>
      </div>
    </main>
  );
}
