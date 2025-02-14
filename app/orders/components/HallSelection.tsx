import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

type Hall = {
  idHalls: number
  name: string
  capacity: number
}

type HallSelectionProps = {
  halls: Hall[]
  onSelect: (hall: Hall) => void
}

export function HallSelection({ halls, onSelect }: HallSelectionProps) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Seleccionar Salón</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {halls.map((hall) => (
          <Card key={hall.idHalls} className="cursor-pointer hover:bg-gray-100" onClick={() => onSelect(hall)}>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold">{hall.name}</h3>
              <p>Capacidad: {hall.capacity}</p>
              <Button className="mt-2">Seleccionar</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

