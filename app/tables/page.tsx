"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "../../components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { PlusCircle, Pencil, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

type Mesa = {
  idTable: number
  tableNumber: number
  capacity: number
  idLounge: number
}

const API_URL = "http://localhost:9000/tables"

export default function GestionMesas() {
  const [mesas, setMesas] = useState<Mesa[]>([])
  const [mesaEditando, setMesaEditando] = useState<Mesa | null>(null)
  const [mesaEliminando, setMesaEliminando] = useState<Mesa | null>(null)
  const [busqueda, setBusqueda] = useState("")
  const [hallId, setHallId] = useState<number | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchMesas()
  }, [])

  const fetchMesas = async () => {
    try {
      const response = await fetch(`${API_URL}/bring_all`)
      if (!response.ok) throw new Error("Error al obtener las mesas")
      const data = await response.json()
      setMesas(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar las mesas",
        variant: "destructive",
      })
    }
  }

  const fetchMesasByHall = async (idHall: number) => {
    try {
      const response = await fetch(`${API_URL}/${idHall}`)
      if (!response.ok) throw new Error("Error al obtener las mesas del salón")
      const data = await response.json()
      setMesas(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar las mesas del salón",
        variant: "destructive",
      })
    }
  }

  const handleAddMesa = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const nuevaMesa = {
      tableNumber: Number(formData.get("tableNumber")),
      capacity: Number(formData.get("capacity")),
      idLounge: Number(formData.get("idLounge")),
    }

    try {
      const response = await fetch(`${API_URL}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevaMesa),
      })
      if (!response.ok) throw new Error("Error al crear la mesa")
      await fetchMesas()
      toast({
        title: "Éxito",
        description: "Mesa creada correctamente",
      })
      event.currentTarget.reset()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear la mesa",
        variant: "destructive",
      })
    }
  }

  const handleEditMesa = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!mesaEditando) return
    const formData = new FormData(event.currentTarget)
    const mesaActualizada = {
      tableNumber: Number(formData.get("tableNumber")),
      capacity: Number(formData.get("capacity")),
      idLounge: Number(formData.get("idLounge")),
    }

    try {
      const response = await fetch(`${API_URL}/edit/${mesaEditando.idTable}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mesaActualizada),
      })
      if (!response.ok) throw new Error("Error al actualizar la mesa")
      await fetchMesas()
      toast({
        title: "Éxito",
        description: "Mesa actualizada correctamente",
      })
      setMesaEditando(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar la mesa",
        variant: "destructive",
      })
    }
  }

  const handleDeleteMesa = async () => {
    if (!mesaEliminando) return
    try {
      const response = await fetch(`${API_URL}/delete/${mesaEliminando.idTable}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Error al eliminar la mesa")
      await fetchMesas()
      toast({
        title: "Éxito",
        description: "Mesa eliminada correctamente",
      })
      setMesaEliminando(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la mesa",
        variant: "destructive",
      })
    }
  }

  const mesasFiltradas = mesas.filter(
    (mesa) =>
      mesa.tableNumber.toString().includes(busqueda) ||
      mesa.capacity.toString().includes(busqueda) ||
      mesa.idLounge.toString().includes(busqueda),
  )

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-3xl font-semibold mb-6">Gestión de Mesas</h1>

        <div className="flex justify-between items-center mb-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Añadir Mesa
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Añadir Nueva Mesa</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddMesa} className="space-y-4">
                <div>
                  <Label htmlFor="tableNumber">Número de Mesa</Label>
                  <Input id="tableNumber" name="tableNumber" type="number" required />
                </div>
                <div>
                  <Label htmlFor="capacity">Capacidad</Label>
                  <Input id="capacity" name="capacity" type="number" required />
                </div>
                <div>
                  <Label htmlFor="idLounge">ID del Salón</Label>
                  <Input id="idLounge" name="idLounge" type="number" required />
                </div>
                <Button type="submit">Guardar Mesa</Button>
              </form>
            </DialogContent>
          </Dialog>

          <div className="flex items-center space-x-2">
            <Input
              type="search"
              placeholder="Buscar mesas..."
              className="w-64"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <Input
              type="number"
              placeholder="ID del Salón"
              className="w-32"
              value={hallId || ""}
              onChange={(e) => setHallId(e.target.value ? Number(e.target.value) : null)}
            />
            <Button onClick={() => hallId && fetchMesasByHall(hallId)}>Filtrar por Salón</Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número</TableHead>
              <TableHead>Capacidad</TableHead>
              <TableHead>ID del Salón</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mesasFiltradas.map((mesa) => (
              <TableRow key={mesa.idTable}>
                <TableCell>{mesa.tableNumber}</TableCell>
                <TableCell>{mesa.capacity}</TableCell>
                <TableCell>{mesa.idLounge}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon" onClick={() => setMesaEditando(mesa)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Editar Mesa</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleEditMesa} className="space-y-4">
                        <div>
                          <Label htmlFor="tableNumber">Número de Mesa</Label>
                          <Input
                            id="tableNumber"
                            name="tableNumber"
                            type="number"
                            defaultValue={mesa.tableNumber}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="capacity">Capacidad</Label>
                          <Input id="capacity" name="capacity" type="number" defaultValue={mesa.capacity} required />
                        </div>
                        <div>
                          <Label htmlFor="idLounge">ID del Salón</Label>
                          <Input id="idLounge" name="idLounge" type="number" defaultValue={mesa.idLounge} required />
                        </div>
                        <Button type="submit">Actualizar Mesa</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon" className="ml-2" onClick={() => setMesaEliminando(mesa)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirmar Eliminación</DialogTitle>
                        <DialogDescription>
                          ¿Estás seguro de que quieres eliminar la mesa número {mesaEliminando?.tableNumber}? Esta
                          acción no se puede deshacer.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setMesaEliminando(null)}>
                          Cancelar
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteMesa}>
                          Eliminar
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </main>
    </div>
  )
}

