export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold text-center">
          自動音声通話システム
        </h1>
      </div>
      
      <div className="relative flex place-items-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">
            システム準備中
          </h2>
          <p className="text-gray-600">
            IVRを使用した自動音声通話システムを構築中です
          </p>
        </div>
      </div>
    </main>
  )
}