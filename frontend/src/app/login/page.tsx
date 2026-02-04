"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    
    let role = "";
    if (email === "admin@example.com" && password === "password123") {
      role = "admin";
    } else if (email === "user@example.com" && password === "password123") {
      role = "customer";
    }
  
    if (role) {
      // ユーザー情報をブラウザに保存
      localStorage.setItem("user", JSON.stringify({ email, role }));
      router.push("/");
    } else {
      alert("ログイン失敗");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-gray-900">重機レンタル管理</h1>
          <p className="text-gray-500 mt-2">アカウントにログインしてください</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              メールアドレス
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none transition-all"
              placeholder="example@mail.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              パスワード
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            ログイン
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">
            © 2026 Heavy Machine Rental Manager
          </p>
        </div>
      </div>
    </div>
  );
}
