"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "../../components/sidebar"
import { useToast } from "@/components/ui/use-toast"
import { HallSelection } from "./components/HallSelection"
import { TableSelection } from "./components/TableSelection"
import { ProductSelection } from "./components/ProductSelection"
import { OrderSummary } from "./components/OrderSummary"
import { InvoiceGeneration } from "./components/InvoiceGeneration"

type Hall = {
  idHalls: number
  name: string
  capacity: number
}

type Table = {
  idTable: number
  tableNumber: number
  capacity: number
  idLounge: number
}

type Product = {
  id_product: number
  name: string
  description: string
  price: number
  id_category: number
}

type OrderItem = {
  product: Product
  quantity: number
}

type Order = {
  hallId: number | null
  tableId: number | null
  items: OrderItem[]
}

const API_URL = {
  halls: "http://ec2-13-216-183-248.compute-1.amazonaws.com:9001/halls",
  tables: "http://ec2-13-216-183-248.compute-1.amazonaws.com:9000/tables",
  products: "http://ec2-13-216-183-248.compute-1.amazonaws.com:8083/products",
  categories: "http://ec2-13-216-183-248.compute-1.amazonaws.com:8082/category",
}

export default function GestionOrdenes() {
  const [halls, setHalls] = useState<Hall[]>([])
  const [tables, setTables] = useState<Table[]>([])
  const [selectedHall, setSelectedHall] = useState<Hall | null>(null)
  const [selectedTable, setSelectedTable] = useState<Table | null>(null)
  const [currentOrder, setCurrentOrder] = useState<Order>({ hallId: null, tableId: null, items: [] })
  const [orderStep, setOrderStep] = useState<"hall" | "table" | "products" | "summary" | "invoice">("hall")
  const { toast } = useToast()

  useEffect(() => {
    fetchHalls()
  }, [])

  const fetchHalls = async () => {
    try {
      const response = await fetch(`${API_URL.halls}/bring_all`)
      if (!response.ok) throw new Error("Error al obtener los salones")
      const data = await response.json()
      setHalls(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los salones",
        variant: "destructive",
      })
    }
  }

  const fetchTables = async (hallId: number) => {
    try {
      const response = await fetch(`${API_URL.tables}/${hallId}`)
      if (!response.ok) throw new Error("Error al obtener las mesas")
      const data = await response.json()
      setTables(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar las mesas",
        variant: "destructive",
      })
    }
  }

  const handleHallSelect = (hall: Hall) => {
    setSelectedHall(hall)
    setCurrentOrder({ ...currentOrder, hallId: hall.idHalls })
    fetchTables(hall.idHalls)
    setOrderStep("table")
  }

  const handleTableSelect = (table: Table) => {
    setSelectedTable(table)
    setCurrentOrder({ ...currentOrder, tableId: table.idTable })
    setOrderStep("products")
  }

  const handleAddProduct = (product: Product, quantity: number) => {
    setCurrentOrder((prevOrder) => {
      const existingItemIndex = prevOrder.items.findIndex((item) => item.product.id_product === product.id_product)
      if (existingItemIndex > -1) {
        const updatedItems = [...prevOrder.items]
        updatedItems[existingItemIndex].quantity += quantity
        return { ...prevOrder, items: updatedItems }
      } else {
        return { ...prevOrder, items: [...prevOrder.items, { product, quantity }] }
      }
    })
  }

  const handleRemoveProduct = (productId: number) => {
    setCurrentOrder((prevOrder) => ({
      ...prevOrder,
      items: prevOrder.items.filter((item) => item.product.id_product !== productId),
    }))
  }

  const handleUpdateQuantity = (productId: number, newQuantity: number) => {
    setCurrentOrder((prevOrder) => ({
      ...prevOrder,
      items: prevOrder.items.map((item) =>
        item.product.id_product === productId ? { ...item, quantity: newQuantity } : item,
      ),
    }))
  }

  const handleGenerateOrder = () => {
    setOrderStep("summary")
  }

  const handleProceedToInvoice = () => {
    setOrderStep("invoice")
  }

  const handleNewOrder = () => {
    setCurrentOrder({ hallId: null, tableId: null, items: [] })
    setSelectedHall(null)
    setSelectedTable(null)
    setOrderStep("hall")
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-3xl font-semibold mb-6">Gestión de Órdenes</h1>

        {orderStep === "hall" && <HallSelection halls={halls} onSelect={handleHallSelect} />}

        {orderStep === "table" && selectedHall && (
          <TableSelection tables={tables} onSelect={handleTableSelect} selectedHall={selectedHall} />
        )}

        {orderStep === "products" && (
          <ProductSelection
            currentOrder={currentOrder}
            onAddProduct={handleAddProduct}
            onRemoveProduct={handleRemoveProduct}
            onUpdateQuantity={handleUpdateQuantity}
            onGenerateOrder={handleGenerateOrder}
          />
        )}

        {orderStep === "summary" && (
          <OrderSummary
            order={currentOrder}
            onConfirm={handleGenerateOrder}
            onNewOrder={handleNewOrder}
            onProceedToInvoice={() => setOrderStep("invoice")}
          />
        )}

        {orderStep === "invoice" && <InvoiceGeneration order={currentOrder} onNewOrder={handleNewOrder} />}
      </main>
    </div>
  )
}


