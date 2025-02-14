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

type PaymentMethod = {
  paymentId: number
  paymentType: string
}

const API_URL = "http://ec2-13-216-183-248.compute-1.amazonaws.com:8085/payment"

export default function GestionFormasPago() {
  const [formasPago, setFormasPago] = useState<PaymentMethod[]>([])
  const [formaPagoEditando, setFormaPagoEditando] = useState<PaymentMethod | null>(null)
  const [formaPagoEliminando, setFormaPagoEliminando] = useState<PaymentMethod | null>(null)
  const [busqueda, setBusqueda] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    fetchFormasPago()
  }, [])

  const fetchFormasPago = async () => {
    try {
      const response = await fetch(`${API_URL}/bringAll`)
      if (!response.ok) throw new Error("Error al obtener las formas de pago")
      const data = await response.json()
      setFormasPago(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar las formas de pago",
        variant: "destructive",
      })
    }
  }

  const handleAddFormaPago = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const nuevaFormaPago = {
      paymentType: formData.get("paymentType") as string,
    }

    try {
      const response = await fetch(`${API_URL}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevaFormaPago),
      })
      if (!response.ok) throw new Error("Error al crear la forma de pago")
      await fetchFormasPago()
      toast({
        title: "Éxito",
        description: "Forma de pago creada correctamente",
      })
      event.currentTarget.reset()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear la forma de pago",
        variant: "destructive",
      })
    }
  }

  const handleEditFormaPago = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!formaPagoEditando) return
    const formData = new FormData(event.currentTarget)
    const formaPagoActualizada = {
      paymentType: formData.get("paymentType") as string,
    }

    try {
      const response = await fetch(`${API_URL}/edit/${formaPagoEditando.paymentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formaPagoActualizada),
        credentials: "include",
      })
      if (!response.ok) throw new Error("Error al actualizar la forma de pago")
      await fetchFormasPago()
      toast({
        title: "Éxito",
        description: "Forma de pago actualizada correctamente",
      })
      setFormaPagoEditando(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar la forma de pago",
        variant: "destructive",
      })
    }
  }

  const handleDeleteFormaPago = async () => {
    if (!formaPagoEliminando) return
    try {
      const response = await fetch(`${API_URL}/delete/${formaPagoEliminando.paymentId}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Error al eliminar la forma de pago")
      await fetchFormasPago()
      toast({
        title: "Éxito",
        description: "Forma de pago eliminada correctamente",
      })
      setFormaPagoEliminando(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la forma de pago",
        variant: "destructive",
      })
    }
  }

  const formasPagoFiltradas = formasPago.filter((formaPago) =>
    formaPago.paymentType.toLowerCase().includes(busqueda.toLowerCase()),
  )

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-3xl font-semibold mb-6">Gestión de Formas de Pago</h1>

        <div className="flex justify-between items-center mb-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Añadir Forma de Pago
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Añadir Nueva Forma de Pago</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddFormaPago} className="space-y-4">
                <div>
                  <Label htmlFor="paymentType">Tipo de Pago</Label>
                  <Input id="paymentType" name="paymentType" required />
                </div>
                <Button type="submit">Guardar Forma de Pago</Button>
              </form>
            </DialogContent>
          </Dialog>

          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              type="search"
              placeholder="Buscar formas de pago..."
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
              <TableHead>Tipo de Pago</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {formasPagoFiltradas.map((formaPago) => (
              <TableRow key={formaPago.paymentId}>
                <TableCell>{formaPago.paymentId}</TableCell>
                <TableCell>{formaPago.paymentType}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon" onClick={() => setFormaPagoEditando(formaPago)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Editar Forma de Pago</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleEditFormaPago} className="space-y-4">
                        <div>
                          <Label htmlFor="paymentType">Tipo de Pago</Label>
                          <Input id="paymentType" name="paymentType" defaultValue={formaPago.paymentType} required />
                        </div>
                        <Button type="submit">Actualizar Forma de Pago</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="ml-2"
                        onClick={() => setFormaPagoEliminando(formaPago)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirmar Eliminación</DialogTitle>
                        <DialogDescription>
                          ¿Estás seguro de que quieres eliminar la forma de pago "{formaPagoEliminando?.paymentType}"?
                          Esta acción no se puede deshacer.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setFormaPagoEliminando(null)}>
                          Cancelar
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteFormaPago}>
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

