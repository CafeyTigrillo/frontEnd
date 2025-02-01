import Link from "next/link"
import {
  Users,
  UserCheck,
  Coffee,
  LayoutGrid,
  Tags,
  ShoppingCart,
  BarChart3,
  Settings,
  ClipboardList,
} from "lucide-react"

const sidebarItems = [
  { name: "Usuarios", icon: Users, href: "/usuarios" },
  { name: "Clientes", icon: UserCheck, href: "/clients" },
  { name: "Productos", icon: Coffee, href: "/products" },
  { name: "Mesas y Salones", icon: LayoutGrid, href: "/mesas-salones" },
  { name: "Categorías", icon: Tags, href: "/category" },
  { name: "Ventas", icon: ShoppingCart, href: "/ventas" },
  { name: "Órdenes", icon: ClipboardList, href: "/ordenes" },
  { name: "Análisis", icon: BarChart3, href: "/analisis" },
  { name: "Configuración", icon: Settings, href: "/configuracion" },
]

export function Sidebar() {
  return (
    <div className="flex flex-col h-full p-3 bg-gray-800 text-white">
      <div className="space-y-3">
        <div className="flex items-center justify-center">
          <h2 className="text-xl font-bold">ChefLink</h2>
        </div>
        <div className="flex-1">
          <ul className="pt-2 pb-4 space-y-1 text-sm">
            {sidebarItems.map((item) => (
              <li key={item.name} className="rounded-sm">
                <Link href={item.href} className="flex items-center p-2 space-x-3 rounded-md hover:bg-gray-700">
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

