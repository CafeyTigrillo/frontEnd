import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

type OrderConfirmationProps = {
  onNewOrder: () => void
}

export function OrderConfirmation({ onNewOrder }: OrderConfirmationProps) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Orden Confirmada</h2>
      <Card>
        <CardContent className="p-4">
          <p className="text-lg mb-4">Su orden ha sido confirmada y la factura ha sido generada.</p>
          <Button onClick={onNewOrder}>Crear Nueva Orden</Button>
        </CardContent>
      </Card>
    </div>
  )
}

