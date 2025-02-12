import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

type Table = {
  idTable: number
  tableNumber: number
  capacity: number
  idLounge: number
}

type Hall = {
  idHalls: number
  name: string
  capacity: number
}

type TableSelectionProps = {
  tables: Table[]
  onSelect: (table: Table) => void
  selectedHall: Hall
}

export function TableSelection({ tables, onSelect, selectedHall }: TableSelectionProps) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Seleccionar Mesa en {selectedHall.name}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tables.map((table) => (
          <Card key={table.idTable} className="cursor-pointer hover:bg-gray-100" onClick={() => onSelect(table)}>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold">Mesa {table.tableNumber}</h3>
              <p>Capacidad: {table.capacity}</p>
              <Button className="mt-2">Seleccionar</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

