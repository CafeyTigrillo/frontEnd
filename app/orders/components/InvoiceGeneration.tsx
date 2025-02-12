"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"

type Customer = {
  id_client: number
  name: string
  lastname: string
  email: string
  dni: string
}

type OrderItem = {
  product: {
    id_product: number
    name: string
    price: number
  }
  quantity: number
}

type Order = {
  hallId: number | null
  tableId: number | null
  items: OrderItem[]
}

type InvoiceGenerationProps = {
  order: Order
  onNewOrder: () => void
}

const API_URL = {
  customers: "http://ec2-13-216-183-248.compute-1.amazonaws.com:8081/clients",
}

export function InvoiceGeneration({ order, onNewOrder }: InvoiceGenerationProps) {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isInvoiceGenerated, setIsInvoiceGenerated] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchCustomers()
  }, [])

  useEffect(() => {
    const filtered = customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.dni.includes(searchTerm),
    )
    setFilteredCustomers(filtered)
  }, [searchTerm, customers])

  const fetchCustomers = async () => {
    try {
      const response = await fetch(`${API_URL.customers}/bring_all`)
      if (!response.ok) throw new Error("Error al obtener los clientes")
      const data = await response.json()
      setCustomers(data)
      setFilteredCustomers(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los clientes",
        variant: "destructive",
      })
    }
  }

  const generateInvoice = () => {
    if (!selectedCustomer) return
    setIsInvoiceGenerated(true)
    toast({
      title: "Éxito",
      description: "Factura generada correctamente",
    })
  }

  const sendInvoiceByEmail = async () => {
    if (!selectedCustomer) return

    const emailData = {
      email: selectedCustomer.email,
      name: `${selectedCustomer.name} ${selectedCustomer.lastname}`,
    }

    try {
      const response = await fetch("http://localhost:9003/survey/send-mail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
      })

      if (!response.ok) {
        throw new Error("Error al enviar el correo")
      }

      toast({
        title: "Éxito",
        description: "Factura enviada por correo electrónico a " + selectedCustomer.email,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar el correo electrónico",
        variant: "destructive",
      })
    }
  }

  const printInvoice = () => {
    window.print()
  }

  const calculateTotal = () => {
    return order.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  }

  if (isInvoiceGenerated) {
    return (
      <Card className="print:shadow-none">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Factura</h2>
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Cliente:</h3>
            <p>
              {selectedCustomer?.name} {selectedCustomer?.lastname}
            </p>
            <p>Cédula: {selectedCustomer?.dni}</p>
            <p>Email: {selectedCustomer?.email}</p>
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Detalles de la Orden:</h3>
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between">
                <span>
                  {item.product.name} x {item.quantity}
                </span>
                <span>${(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t mt-2 pt-2 font-semibold">
              <span>Total:</span>
              <span className="float-right">${calculateTotal().toFixed(2)}</span>
            </div>
          </div>
          <div className="flex space-x-4 print:hidden">
            <Button onClick={sendInvoiceByEmail}>Enviar por Correo</Button>
            <Button onClick={printInvoice}>Imprimir Factura</Button>
            <Button onClick={onNewOrder}>Nueva Orden</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex space-x-4">
      <Card className="flex-1">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Generar Factura</h2>
          {selectedCustomer && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Cliente Seleccionado:</h3>
              <p>
                Nombre: {selectedCustomer.name} {selectedCustomer.lastname}
              </p>
              <p>Email: {selectedCustomer.email}</p>
              <p>Cédula: {selectedCustomer.dni}</p>
            </div>
          )}
          <Button onClick={generateInvoice} disabled={!selectedCustomer}>
            Generar Factura
          </Button>
        </CardContent>
      </Card>
      <Card className="w-1/3">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Lista de Clientes</h2>
          <Input
            placeholder="Buscar cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />
          <ScrollArea className="h-[400px]">
            {filteredCustomers.map((customer) => (
              <div
                key={customer.id_client}
                className={`p-2 cursor-pointer hover:bg-gray-100 ${
                  selectedCustomer?.id_client === customer.id_client ? "bg-blue-100" : ""
                }`}
                onClick={() => setSelectedCustomer(customer)}
              >
                <p className="font-semibold">
                  {customer.name} {customer.lastname}
                </p>
                <p className="text-sm text-gray-600">Cédula: {customer.dni}</p>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

