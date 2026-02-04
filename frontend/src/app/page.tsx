// frontend/src/app/page.tsx
export default async function Home() {
  // 1. バックエンドからデータを取得（サーバーサイドでの取得）
  // Dockerネットワーク内なので、サービス名「backend」で通信できます
  const response = await fetch("http://backend:8000/machines", { cache: 'no-store' });
  const machines = await response.json();

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">
        重機レンタル管理システム
      </h1>
      
      <div className="grid gap-4">
        {machines.length === 0 ? (
          <p className="text-gray-500">現在、登録されている重機はありません。</p>
        ) : (
          machines.map((machine: any) => (
            <div key={machine.id} className="border p-4 rounded-lg shadow-sm bg-white">
              <h2 className="text-xl font-semibold">{machine.name}</h2>
              <p className="text-gray-600">型番: {machine.model_number}</p>
              <p className="mt-2 text-sm">{machine.description}</p>
            </div>
          ))
        )}
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded text-sm">
        <p>✅ バックエンド通信ステータス: {response.ok ? "良好" : "エラー"}</p>
      </div>
    </main>
  );
}
