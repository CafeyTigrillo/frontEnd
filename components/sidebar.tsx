import Link from "next/link"
import {
  Users,
  UserCheck,
  Coffee,
  Tags,
  ShoppingCart,
  BarChart3,
  Settings,
  ClipboardList,
  CreditCard,
  Table,
  Home,
} from "lucide-react"

const sidebarItems = [
  { name: "Usuarios", icon: Users, href: "/users" },
  { name: "Clientes", icon: UserCheck, href: "/clients" },
  { name: "Productos", icon: Coffee, href: "/products" },
  { name: "Mesas", icon: Table, href: "/tables" },
  { name: "Salones", icon: Home, href: "/hall" },
  { name: "Categorías", icon: Tags, href: "/category" },
  { name: "Ventas", icon: ShoppingCart, href: "/sales" },
  { name: "Órdenes", icon: ClipboardList, href: "/orders" },
  { name: "Formas de Pago", icon: CreditCard, href: "/payment-methods" },
  { name: "Análisis", icon: BarChart3, href: "/analysis" },
  { name: "Configuración", icon: Settings, href: "/configuration" },
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


