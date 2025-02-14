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
import { PlusCircle, Pencil, Trash2, Search } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

type Hall = {
  idHalls: number
  name: string
  capacity: number
}

const API_URL = "http://ec2-13-216-183-248.compute-1.amazonaws.com:9001/halls"

export default function GestionSalones() {
  const [salones, setSalones] = useState<Hall[]>([])
  const [salonEditando, setSalonEditando] = useState<Hall | null>(null)
  const [salonEliminando, setSalonEliminando] = useState<Hall | null>(null)
  const [busqueda, setBusqueda] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    fetchSalones()
  }, [])

  const fetchSalones = async () => {
    try {
      const response = await fetch(`${API_URL}/bring_all`)
      if (!response.ok) throw new Error("Error al obtener los salones")
      const data = await response.json()
      setSalones(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los salones",
        variant: "destructive",
      })
    }
  }

  const handleAddSalon = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const nuevoSalon = {
      name: formData.get("name") as string,
      capacity: Number(formData.get("capacity")),
    }

    try {
      const response = await fetch(`${API_URL}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevoSalon),
      })
      if (!response.ok) throw new Error("Error al crear el salón")
      await fetchSalones()
      toast({
        title: "Éxito",
        description: "Salón creado correctamente",
      })
      event.currentTarget.reset()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear el salón",
        variant: "destructive",
      })
    }
  }

  const handleEditSalon = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!salonEditando) return
    const formData = new FormData(event.currentTarget)
    const salonActualizado = {
      name: formData.get("name") as string,
      capacity: Number(formData.get("capacity")),
    }

    try {
      const response = await fetch(`${API_URL}/edit/${salonEditando.idHalls}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(salonActualizado),
      })
      if (!response.ok) throw new Error("Error al actualizar el salón")
      await fetchSalones()
      toast({
        title: "Éxito",
        description: "Salón actualizado correctamente",
      })
      setSalonEditando(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el salón",
        variant: "destructive",
      })
    }
  }

  const handleDeleteSalon = async () => {
    if (!salonEliminando) return
    try {
      const response = await fetch(`${API_URL}/delete/${salonEliminando.idHalls}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Error al eliminar el salón")
      await fetchSalones()
      toast({
        title: "Éxito",
        description: "Salón eliminado correctamente",
      })
      setSalonEliminando(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el salón",
        variant: "destructive",
      })
    }
  }

  const salonesFiltrados = salones.filter(
    (salon) =>
      salon.name.toLowerCase().includes(busqueda.toLowerCase()) || salon.capacity.toString().includes(busqueda),
  )

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-3xl font-semibold mb-6">Gestión de Salones</h1>

        <div className="flex justify-between items-center mb-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Añadir Salón
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Añadir Nuevo Salón</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddSalon} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nombre</Label>
                  <Input id="name" name="name" required />
                </div>
                <div>
                  <Label htmlFor="capacity">Capacidad</Label>
                  <Input id="capacity" name="capacity" type="number" required />
                </div>
                <Button type="submit">Guardar Salón</Button>
              </form>
            </DialogContent>
          </Dialog>

          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              type="search"
              placeholder="Buscar salones..."
              className="pl-8"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Capacidad</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {salonesFiltrados.map((salon) => (
              <TableRow key={salon.idHalls}>
                <TableCell>{salon.idHalls}</TableCell>
                <TableCell>{salon.name}</TableCell>
                <TableCell>{salon.capacity}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon" onClick={() => setSalonEditando(salon)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Editar Salón</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleEditSalon} className="space-y-4">
                        <div>
                          <Label htmlFor="name">Nombre</Label>
                          <Input id="name" name="name" defaultValue={salon.name} required />
                        </div>
                        <div>
                          <Label htmlFor="capacity">Capacidad</Label>
                          <Input id="capacity" name="capacity" type="number" defaultValue={salon.capacity} required />
                        </div>
                        <Button type="submit">Actualizar Salón</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon" className="ml-2" onClick={() => setSalonEliminando(salon)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirmar Eliminación</DialogTitle>
                        <DialogDescription>
                          ¿Estás seguro de que quieres eliminar el salón "{salonEliminando?.name}"? Esta acción no se
                          puede deshacer.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setSalonEliminando(null)}>
                          Cancelar
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteSalon}>
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

