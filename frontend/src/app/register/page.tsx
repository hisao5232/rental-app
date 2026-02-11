"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    full_name: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("https://api-rental.go-pro-world.net/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("ユーザー登録が完了しました！ログインしてください。");
        router.push("/login");
      } else {
        const errData = await res.json();
        alert(errData.detail || "登録に失敗しました");
      }
    } catch (error) {
      alert("サーバーに接続できませんでした");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full p-8 bg-white border border-gray-200 rounded-2xl shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-gray-900 italic">CREATE ACCOUNT</h1>
          <p className="text-gray-500 mt-2 text-sm">新規ユーザー情報を入力してください</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Full Name</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 outline-none transition-all"
              placeholder="山田 太郎"
              onChange={(e) => setFormData({...formData, full_name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Email Address</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 outline-none transition-all"
              placeholder="example@mail.com"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 outline-none transition-all"
              placeholder="••••••••"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold shadow-lg transition-all active:scale-95 ${
              loading ? "bg-gray-400" : "bg-gray-900 text-white hover:bg-gray-800"
            }`}
          >
            {loading ? "登録中..." : "アカウントを作成する"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link href="/login" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">
            ← ログイン画面へ戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
