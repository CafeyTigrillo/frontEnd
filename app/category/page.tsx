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

type Categoria = {
  id_category: number
  name: string
}

const API_URL = "http://ec2-13-216-183-248.compute-1.amazonaws.com:8082/category"

export default function GestionCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [categoriaEditando, setCategoriaEditando] = useState<Categoria | null>(null)
  const [categoriaEliminando, setCategoriaEliminando] = useState<Categoria | null>(null)
  const [busqueda, setBusqueda] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    fetchCategorias()
  }, [])

  const fetchCategorias = async () => {
    try {
      const response = await fetch(`${API_URL}/bring_all`)
      if (!response.ok) throw new Error("Error al obtener las categorías")
      const data = await response.json()
      setCategorias(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar las categorías",
        variant: "destructive",
      })
    }
  }

  const handleAddCategoria = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const nuevaCategoria = {
      name: formData.get("name") as string,
    }

    // Validar que el nombre no se repita
    if (categorias.some((c) => c.name.toLowerCase() === nuevaCategoria.name.toLowerCase())) {
      toast({
        title: "Error",
        description: "Ya existe una categoría con este nombre",
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
        body: JSON.stringify(nuevaCategoria),
      })
      if (!response.ok) throw new Error("Error al crear la categoría")
      await fetchCategorias()
      toast({
        title: "Éxito",
        description: "Categoría creada correctamente",
      })
      event.currentTarget.reset()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear la categoría",
        variant: "destructive",
      })
    }
  }

  const handleEditCategoria = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!categoriaEditando) return
    const formData = new FormData(event.currentTarget)
    const categoriaActualizada = {
      name: formData.get("name") as string,
    }

    // Validar que el nombre no se repita (excluyendo la categoría actual)
    if (
      categorias.some(
        (c) =>
          c.name.toLowerCase() === categoriaActualizada.name.toLowerCase() &&
          c.id_category !== categoriaEditando.id_category,
      )
    ) {
      toast({
        title: "Error",
        description: "Ya existe una categoría con este nombre",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`${API_URL}/edit/${categoriaEditando.id_category}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoriaActualizada),
      })
      if (!response.ok) throw new Error("Error al actualizar la categoría")
      await fetchCategorias()
      toast({
        title: "Éxito",
        description: "Categoría actualizada correctamente",
      })
      setCategoriaEditando(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar la categoría",
        variant: "destructive",
      })
    }
  }

  const handleDeleteCategoria = async () => {
    if (!categoriaEliminando) return
    try {
      const response = await fetch(`${API_URL}/delete/${categoriaEliminando.id_category}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Error al eliminar la categoría")
      await fetchCategorias()
      toast({
        title: "Éxito",
        description: "Categoría eliminada correctamente",
      })
      setCategoriaEliminando(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la categoría",
        variant: "destructive",
      })
    }
  }

  const categoriasFiltradas = categorias.filter((categoria) =>
    categoria.name.toLowerCase().includes(busqueda.toLowerCase()),
  )

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-3xl font-semibold mb-6">Gestión de Categoríasss</h1>

        <div className="flex justify-between items-center mb-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Añadir Categoría
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Añadir Nueva Categoría</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddCategoria} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nombre</Label>
                  <Input id="name" name="name" required />
                </div>
                <Button type="submit">Guardar Categoría</Button>
              </form>
            </DialogContent>
          </Dialog>

          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              type="search"
              placeholder="Buscar categorías..."
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
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categoriasFiltradas.map((categoria) => (
              <TableRow key={categoria.id_category}>
                <TableCell>{categoria.id_category}</TableCell>
                <TableCell>{categoria.name}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon" onClick={() => setCategoriaEditando(categoria)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Editar Categoría</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleEditCategoria} className="space-y-4">
                        <div>
                          <Label htmlFor="name">Nombre</Label>
                          <Input id="name" name="name" defaultValue={categoria.name} required />
                        </div>
                        <Button type="submit">Actualizar Categoría</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="ml-2"
                        onClick={() => setCategoriaEliminando(categoria)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirmar Eliminación</DialogTitle>
                        <DialogDescription>
                          ¿Estás seguro de que quieres eliminar la categoría "{categoriaEliminando?.name}"? Esta acción
                          no se puede deshacer.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setCategoriaEliminando(null)}>
                          Cancelar
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteCategoria}>
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

