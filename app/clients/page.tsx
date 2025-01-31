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

// Tipo para el cliente
type Cliente = {
  id_client: number
  name: string
  lastname: string
  address: string
  phone: string
  dni: string
  email: string
}

const API_URL = "http://localhost:8080/clients"

export default function GestionClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null)
  const [clienteEliminando, setClienteEliminando] = useState<Cliente | null>(null)
  const [busqueda, setBusqueda] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    fetchClientes()
  }, [])

  const fetchClientes = async () => {
    try {
      const response = await fetch(`${API_URL}/bring_all`)
      if (!response.ok) throw new Error("Error al obtener los clientes")
      const data = await response.json()
      setClientes(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los clientes",
        variant: "destructive",
      })
    }
  }

  const handleAddCliente = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const nuevoCliente = {
      name: formData.get("name") as string,
      lastname: formData.get("lastname") as string,
      address: formData.get("address") as string,
      phone: formData.get("phone") as string,
      dni: formData.get("dni") as string,
      email: formData.get("email") as string,
    }
    try {
      const response = await fetch(`${API_URL}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevoCliente),
      })
      if (!response.ok) throw new Error("Error al crear el cliente")
      await fetchClientes()
      toast({
        title: "Éxito",
        description: "Cliente creado correctamente",
      })
      event.currentTarget.reset()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear el cliente",
        variant: "destructive",
      })
    }
  }

  const handleEditCliente = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!clienteEditando) return
    const formData = new FormData(event.currentTarget)
    const clienteActualizado = {
      name: formData.get("name") as string,
      lastname: formData.get("lastname") as string,
      address: formData.get("address") as string,
      phone: formData.get("phone") as string,
      dni: formData.get("dni") as string,
      email: formData.get("email") as string,
    }
    try {
      const response = await fetch(`${API_URL}/edit/${clienteEditando.id_client}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(clienteActualizado),
      })
      if (!response.ok) throw new Error("Error al actualizar el cliente")
      await fetchClientes()
      toast({
        title: "Éxito",
        description: "Cliente actualizado correctamente",
      })
      setClienteEditando(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el cliente",
        variant: "destructive",
      })
    }
  }

  const handleDeleteCliente = async () => {
    if (!clienteEliminando) return
    try {
      const response = await fetch(`${API_URL}/delete/${clienteEliminando.id_client}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Error al eliminar el cliente")
      await fetchClientes()
      toast({
        title: "Éxito",
        description: "Cliente eliminado correctamente",
      })
      setClienteEliminando(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el cliente",
        variant: "destructive",
      })
    }
  }

  const clientesFiltrados = clientes.filter(
    (cliente) =>
      cliente.name.toLowerCase().includes(busqueda.toLowerCase()) ||
      cliente.lastname.toLowerCase().includes(busqueda.toLowerCase()) ||
      cliente.email.toLowerCase().includes(busqueda.toLowerCase()) ||
      cliente.phone.includes(busqueda),
  )

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-3xl font-semibold mb-6">Gestión de Clientes</h1>

        <div className="flex justify-between items-center mb-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Añadir Cliente
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Añadir Nuevo Cliente</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddCliente} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nombre</Label>
                  <Input id="name" name="name" required />
                </div>
                <div>
                  <Label htmlFor="lastname">Apellido</Label>
                  <Input id="lastname" name="lastname" required />
                </div>
                <div>
                  <Label htmlFor="address">Dirección</Label>
                  <Input id="address" name="address" required />
                </div>
                <div>
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input id="phone" name="phone" required />
                </div>
                <div>
                  <Label htmlFor="dni">DNI</Label>
                  <Input id="dni" name="dni" required />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required />
                </div>
                <Button type="submit">Guardar Cliente</Button>
              </form>
            </DialogContent>
          </Dialog>

          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              type="search"
              placeholder="Buscar clientes..."
              className="pl-8"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Apellido</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clientesFiltrados.map((cliente) => (
              <TableRow key={cliente.id_client}>
                <TableCell>{cliente.name}</TableCell>
                <TableCell>{cliente.lastname}</TableCell>
                <TableCell>{cliente.email}</TableCell>
                <TableCell>{cliente.phone}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon" onClick={() => setClienteEditando(cliente)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Editar Cliente</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleEditCliente} className="space-y-4">
                        <div>
                          <Label htmlFor="name">Nombre</Label>
                          <Input id="name" name="name" defaultValue={cliente.name} required />
                        </div>
                        <div>
                          <Label htmlFor="lastname">Apellido</Label>
                          <Input id="lastname" name="lastname" defaultValue={cliente.lastname} required />
                        </div>
                        <div>
                          <Label htmlFor="address">Dirección</Label>
                          <Input id="address" name="address" defaultValue={cliente.address} required />
                        </div>
                        <div>
                          <Label htmlFor="phone">Teléfono</Label>
                          <Input id="phone" name="phone" defaultValue={cliente.phone} required />
                        </div>
                        <div>
                          <Label htmlFor="dni">DNI</Label>
                          <Input id="dni" name="dni" defaultValue={cliente.dni} required />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" name="email" type="email" defaultValue={cliente.email} required />
                        </div>
                        <Button type="submit">Actualizar Cliente</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="ml-2"
                        onClick={() => setClienteEliminando(cliente)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirmar Eliminación</DialogTitle>
                        <DialogDescription>
                          ¿Estás seguro de que quieres eliminar a {clienteEliminando?.name}{" "}
                          {clienteEliminando?.lastname}? Esta acción no se puede deshacer.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setClienteEliminando(null)}>
                          Cancelar
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteCliente}>
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

