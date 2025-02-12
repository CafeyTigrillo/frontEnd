import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

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

type OrderSummaryProps = {
  order: Order
  onConfirm: () => void
  onNewOrder: () => void
  onProceedToInvoice: () => void
}

export function OrderSummary({ order, onConfirm, onNewOrder, onProceedToInvoice }: OrderSummaryProps) {
  const total = order.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Resumen de la Orden</h2>
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-2">Detalles de la Orden</h3>
          {order.items.map((item) => (
            <div key={item.product.id_product} className="flex justify-between mb-2">
              <span>
                {item.product.name} x {item.quantity}
              </span>
              <span>${(item.product.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-semibold">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="mt-4 flex justify-between">
        <Button onClick={onNewOrder}>Nueva Orden</Button>
        <Button onClick={onProceedToInvoice}>Proceder a Facturación</Button>
      </div>
    </div>
  )
}

