"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "../../components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
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

type Producto = {
  id_product: number
  name: string
  description: string
  price: number
  id_category: number
  availability: boolean
}

const API_URL = "http://ec2-13-216-183-248.compute-1.amazonaws.com:8083/products"

export default function GestionProductos() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [productoEditando, setProductoEditando] = useState<Producto | null>(null)
  const [productoEliminando, setProductoEliminando] = useState<Producto | null>(null)
  const [busqueda, setBusqueda] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    fetchProductos()
  }, [])

  const fetchProductos = async () => {
    try {
      const response = await fetch(`${API_URL}/bring_all`)
      if (!response.ok) throw new Error("Error al obtener los productos")
      const data = await response.json()
      setProductos(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los productos",
        variant: "destructive",
      })
    }
  }

  const handleAddProducto = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const nuevoProducto = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: Number.parseFloat(formData.get("price") as string),
      id_category: Number.parseInt(formData.get("id_category") as string),
      availability: formData.get("availability") === "on",
    }

    // Validar que el nombre no se repita
    if (productos.some((p) => p.name.toLowerCase() === nuevoProducto.name.toLowerCase())) {
      toast({
        title: "Error",
        description: "Ya existe un producto con este nombre",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`${API_URL}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevoProducto),
      })
      if (!response.ok) throw new Error("Error al crear el producto")
      await fetchProductos()
      toast({
        title: "Éxito",
        description: "Producto creado correctamente",
      })
      event.currentTarget.reset()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear el producto",
        variant: "destructive",
      })
    }
  }

  const handleEditProducto = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!productoEditando) return
    const formData = new FormData(event.currentTarget)
    const productoActualizado = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: Number.parseFloat(formData.get("price") as string),
      id_category: Number.parseInt(formData.get("id_category") as string),
      availability: formData.get("availability") === "on",
    }

    // Validar que el nombre no se repita (excluyendo el producto actual)
    if (
      productos.some(
        (p) =>
          p.name.toLowerCase() === productoActualizado.name.toLowerCase() &&
          p.id_product !== productoEditando.id_product,
      )
    ) {
      toast({
        title: "Error",
        description: "Ya existe un producto con este nombre",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`${API_URL}/edit/${productoEditando.id_product}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productoActualizado),
      })
      if (!response.ok) throw new Error("Error al actualizar el producto")
      await fetchProductos()
      toast({
        title: "Éxito",
        description: "Producto actualizado correctamente",
      })
      setProductoEditando(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el producto",
        variant: "destructive",
      })
    }
  }

  const handleDeleteProducto = async () => {
    if (!productoEliminando) return
    try {
      const response = await fetch(`${API_URL}/delete/${productoEliminando.id_product}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Error al eliminar el producto")
      await fetchProductos()
      toast({
        title: "Éxito",
        description: "Producto eliminado correctamente",
      })
      setProductoEliminando(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el producto",
        variant: "destructive",
      })
    }
  }

  const productosFiltrados = productos.filter(
    (producto) =>
      producto.name.toLowerCase().includes(busqueda.toLowerCase()) ||
      producto.description.toLowerCase().includes(busqueda.toLowerCase()),
  )

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-3xl font-semibold mb-6">Gestión de Productos</h1>

        <div className="flex justify-between items-center mb-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Añadir Producto
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Añadir Nuevo Producto</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddProducto} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nombre</Label>
                  <Input id="name" name="name" required />
                </div>
                <div>
                  <Label htmlFor="description">Descripción</Label>
                  <Input id="description" name="description" required />
                </div>
                <div>
                  <Label htmlFor="price">Precio</Label>
                  <Input id="price" name="price" type="number" step="0.01" required />
                </div>
                <div>
                  <Label htmlFor="id_category">Categoría ID</Label>
                  <Input id="id_category" name="id_category" type="number" required />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="availability" name="availability" />
                  <Label htmlFor="availability">Disponible</Label>
                </div>
                <Button type="submit">Guardar Producto</Button>
              </form>
            </DialogContent>
          </Dialog>

          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              type="search"
              placeholder="Buscar productos..."
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
              <TableHead>Descripción</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Categoría ID</TableHead>
              <TableHead>Disponible</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productosFiltrados.map((producto) => (
              <TableRow key={producto.id_product}>
                <TableCell>{producto.name}</TableCell>
                <TableCell>{producto.description}</TableCell>
                <TableCell>${producto.price.toFixed(2)}</TableCell>
                <TableCell>{producto.id_category}</TableCell>
                <TableCell>{producto.availability ? "Sí" : "No"}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon" onClick={() => setProductoEditando(producto)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Editar Producto</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleEditProducto} className="space-y-4">
                        <div>
                          <Label htmlFor="name">Nombre</Label>
                          <Input id="name" name="name" defaultValue={producto.name} required />
                        </div>
                        <div>
                          <Label htmlFor="description">Descripción</Label>
                          <Input id="description" name="description" defaultValue={producto.description} required />
                        </div>
                        <div>
                          <Label htmlFor="price">Precio</Label>
                          <Input
                            id="price"
                            name="price"
                            type="number"
                            step="0.01"
                            defaultValue={producto.price}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="id_category">Categoría ID</Label>
                          <Input
                            id="id_category"
                            name="id_category"
                            type="number"
                            defaultValue={producto.id_category}
                            required
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="availability" name="availability" defaultChecked={producto.availability} />
                          <Label htmlFor="availability">Disponible</Label>
                        </div>
                        <Button type="submit">Actualizar Producto</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="ml-2"
                        onClick={() => setProductoEliminando(producto)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirmar Eliminación</DialogTitle>
                        <DialogDescription>
                          ¿Estás seguro de que quieres eliminar el producto "{productoEliminando?.name}"? Esta acción no
                          se puede deshacer.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setProductoEliminando(null)}>
                          Cancelar
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteProducto}>
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

