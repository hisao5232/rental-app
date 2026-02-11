"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // 追加

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("https://api-rental.go-pro-world.net/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const userData = await res.json();
        // ユーザー情報をブラウザに保存
        localStorage.setItem("user", JSON.stringify(userData));
        router.push("/");
      } else {
        const errData = await res.json();
        alert(errData.detail || "ログイン失敗");
      }
    } catch (error) {
      alert("サーバーに接続できませんでした");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white border border-gray-200 rounded-2xl shadow-sm">
        <div className="text-center mb-10">
          <h1 className="text-2xl font-black text-gray-900 italic">HEAVY MACHINE RENTAL</h1>
          <p className="text-gray-500 mt-2 text-sm">アカウントにログインしてください</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:bg-white outline-none transition-all"
              placeholder="example@mail.com"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:bg-white outline-none transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 px-4 rounded-xl font-bold shadow-lg transition-all active:scale-95 ${
              loading ? "bg-gray-400" : "bg-gray-900 text-white hover:bg-gray-800"
            }`}
          >
            {loading ? "照合中..." : "ログイン"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center space-y-3">
          <Link href="/register" className="text-sm text-blue-600 font-bold hover:underline">
            新規アカウント作成はこちら
          </Link>
          <p className="text-[10px] text-gray-400">
            © 2026 Go Pro World Net
          </p>
        </div>
      </div>
    </div>
  );
}
