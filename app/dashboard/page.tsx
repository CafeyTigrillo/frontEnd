import { Sidebar } from "@/components/sidebar"

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>
        <p>Bienvenido al dashboard de ChefLink</p>
      </main>
    </div>
  )
}

