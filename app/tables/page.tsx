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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Mesa = {
  idTable: number
  tableNumber: number
  capacity: number
  idLounge: number
  hallName?: string // Nuevo campo para el nombre del salón
}

type Hall = {
  idHalls: number
  name: string
  capacity: number
}

const API_URL = "http://ec2-13-216-183-248.compute-1.amazonaws.com:9000/tables"
const HALL_API_URL = "http://ec2-13-216-183-248.compute-1.amazonaws.com:9001/halls"

export default function GestionMesas() {
  const [mesas, setMesas] = useState<Mesa[]>([])
  const [mesaEditando, setMesaEditando] = useState<Mesa | null>(null)
  const [mesaEliminando, setMesaEliminando] = useState<Mesa | null>(null)
  const [busqueda, setBusqueda] = useState("")
  const [halls, setHalls] = useState<Hall[]>([])
  const [selectedHallId, setSelectedHallId] = useState<string>("")
  const { toast } = useToast()

  useEffect(() => {
    fetchMesas()
    fetchHalls()
  }, [])

  const fetchMesas = async () => {
    try {
      const response = await fetch(`${API_URL}/bring_all`)
      if (!response.ok) throw new Error("Error al obtener las mesas")
      const data = await response.json()
      const mesasConNombreSalon = await Promise.all(
        data.map(async (mesa: Mesa) => ({
          ...mesa,
          hallName: await fetchHallName(mesa.idLounge),
        })),
      )
      setMesas(mesasConNombreSalon)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar las mesas",
        variant: "destructive",
      })
    }
  }

  const fetchHalls = async () => {
    try {
      const response = await fetch(`${HALL_API_URL}/bring_all`)
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

  const fetchHallName = async (idHall: number): Promise<string> => {
    try {
      const response = await fetch(`${HALL_API_URL}/bringHall/${idHall}`)
      if (!response.ok) throw new Error("Error al obtener el nombre del salón")
      const data = await response.json()
      return data.name
    } catch (error) {
      console.error("Error fetching hall name:", error)
      return "Desconocido"
    }
  }

  const fetchMesasByHall = async (idHall: number) => {
    try {
      const response = await fetch(`${API_URL}/${idHall}`)
      if (!response.ok) throw new Error("Error al obtener las mesas del salón")
      const data = await response.json()
      const mesasConNombreSalon = await Promise.all(
        data.map(async (mesa: Mesa) => ({
          ...mesa,
          hallName: await fetchHallName(mesa.idLounge),
        })),
      )
      setMesas(mesasConNombreSalon)
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
      (mesa.hallName && mesa.hallName.toLowerCase().includes(busqueda.toLowerCase())),
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
                  <Label htmlFor="idLounge">Salón</Label>
                  <Select name="idLounge" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un salón" />
                    </SelectTrigger>
                    <SelectContent>
                      {halls.map((hall) => (
                        <SelectItem key={hall.idHalls} value={hall.idHalls.toString()}>
                          {hall.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
            <Select
              value={selectedHallId}
              onValueChange={(value) => {
                setSelectedHallId(value)
                if (value) {
                  fetchMesasByHall(Number(value))
                } else {
                  fetchMesas()
                }
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por Salón" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Todos los salones</SelectItem> {/* Added value prop */}
                {halls.map((hall) => (
                  <SelectItem key={hall.idHalls} value={hall.idHalls.toString()}>
                    {hall.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número</TableHead>
              <TableHead>Capacidad</TableHead>
              <TableHead>Salón</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mesasFiltradas.map((mesa) => (
              <TableRow key={mesa.idTable}>
                <TableCell>{mesa.tableNumber}</TableCell>
                <TableCell>{mesa.capacity}</TableCell>
                <TableCell>{mesa.hallName}</TableCell>
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
                          <Label htmlFor="idLounge">Salón</Label>
                          <Select name="idLounge" defaultValue={mesa.idLounge.toString()} required>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un salón" />
                            </SelectTrigger>
                            <SelectContent>
                              {halls.map((hall) => (
                                <SelectItem key={hall.idHalls} value={hall.idHalls.toString()}>
                                  {hall.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
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
                          ¿Estás seguro de que quieres eliminar la mesa número {mesaEliminando?.tableNumber} del salón{" "}
                          {mesaEliminando?.hallName}? Esta acción no se puede deshacer.
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

