import { Sidebar } from "@/components/sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Coffee, Users, ShoppingCart, ClipboardList } from "lucide-react"

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {/* Hero Section */}
        <div
          className="relative h-[300px] bg-cover bg-center"
          style={{
            backgroundImage: `url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-DRC8PieK5Zpuvu0roiG2WF8JLpgybf.png')`,
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">Bienvenidos a Todos</h1>
            <p className="text-xl text-white/90 text-center max-w-2xl">
              Gestiona tu restaurante de manera eficiente con ChefLink
            </p>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white/80 backdrop-blur-sm border-amber-100">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-amber-100 rounded-lg">
                    <Users className="h-6 w-6 text-amber-800" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-amber-800">Clientes Activos</p>
                    <h3 className="text-2xl font-bold text-amber-900">2,345</h3>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-amber-100">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-amber-100 rounded-lg">
                    <ShoppingCart className="h-6 w-6 text-amber-800" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-amber-800">Ventas del Día</p>
                    <h3 className="text-2xl font-bold text-amber-900">$12,456</h3>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-amber-100">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-amber-100 rounded-lg">
                    <ClipboardList className="h-6 w-6 text-amber-800" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-amber-800">Órdenes Pendientes</p>
                    <h3 className="text-2xl font-bold text-amber-900">18</h3>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-amber-100">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-amber-100 rounded-lg">
                    <Coffee className="h-6 w-6 text-amber-800" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-amber-800">Productos Activos</p>
                    <h3 className="text-2xl font-bold text-amber-900">156</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Content Section */}
          <div className="mt-8">
            <Card className="bg-white/80 backdrop-blur-sm border-amber-100">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-amber-900 mb-4">Actividad Reciente</h2>
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-center space-x-4 p-4 bg-amber-50/50 rounded-lg">
                      <div className="h-2 w-2 rounded-full bg-amber-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-amber-900">Nueva orden recibida - Mesa {item}</p>
                        <p className="text-sm text-amber-700">Hace {item * 5} minutos</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}



