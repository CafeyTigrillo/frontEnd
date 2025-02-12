"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

type Product = {
  id_product: number
  name: string
  description: string
  price: number
  id_category: number
  availability: boolean
}

type Category = {
  id_category: number
  name: string
}

type OrderItem = {
  product: Product
  quantity: number
}

type Order = {
  hallId: number | null
  tableId: number | null
  items: OrderItem[]
}

type ProductSelectionProps = {
  currentOrder: Order
  onAddProduct: (product: Product, quantity: number) => void
  onRemoveProduct: (productId: number) => void
  onUpdateQuantity: (productId: number, newQuantity: number) => void
  onGenerateOrder: () => void
}

const API_URL = {
  categories: "http://ec2-13-216-183-248.compute-1.amazonaws.com:8082/category",
  productsByCategory: "http://ec2-13-216-183-248.compute-1.amazonaws.com:8082/category/products",
}

export function ProductSelection({
  currentOrder,
  onAddProduct,
  onRemoveProduct,
  onUpdateQuantity,
  onGenerateOrder,
}: ProductSelectionProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [quantity, setQuantity] = useState<number>(1)
  const { toast } = useToast()

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL.categories}/bring_all`)
      if (!response.ok) throw new Error("Error al obtener las categorías")
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar las categorías",
        variant: "destructive",
      })
    }
  }

  const fetchProductsByCategory = async (categoryId: number) => {
    try {
      const response = await fetch(`${API_URL.productsByCategory}/${categoryId}`)
      if (!response.ok) throw new Error("Error al obtener los productos")
      const data = await response.json()
      setProducts(data.listProducts)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los productos",
        variant: "destructive",
      })
    }
  }

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.id_category === selectedCategory)
    : products

  return (
    <div className="flex">
      <div className="w-1/2 pr-4">
        <h2 className="text-2xl font-semibold mb-4">Orden Actual</h2>
        {currentOrder.items.map((item) => (
          <Card key={item.product.id_product} className="mb-2">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{item.product.name}</h3>
                <p>Precio: ${item.product.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onUpdateQuantity(item.product.id_product, Math.max(1, item.quantity - 1))}
                >
                  -
                </Button>
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => onUpdateQuantity(item.product.id_product, Number.parseInt(e.target.value) || 0)}
                  className="w-16 mx-2"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onUpdateQuantity(item.product.id_product, item.quantity + 1)}
                >
                  +
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="ml-2"
                  onClick={() => onRemoveProduct(item.product.id_product)}
                >
                  Eliminar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        <div className="mt-4">
          <h3 className="text-xl font-semibold">
            Total: ${currentOrder.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0).toFixed(2)}
          </h3>
          <Button className="mt-2" onClick={onGenerateOrder}>
            Generar Orden
          </Button>
        </div>
      </div>
      <div className="w-1/2 pl-4">
        <h2 className="text-2xl font-semibold mb-4">Agregar Productos</h2>
        <Select
          onValueChange={(value) => {
            const categoryId = Number(value)
            setSelectedCategory(categoryId)
            fetchProductsByCategory(categoryId)
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar categoría" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id_category} value={category.id_category.toString()}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {products.map((product) => (
            <Card key={product.id_product} className="cursor-pointer hover:bg-gray-100">
              <CardContent className="p-4">
                <h3 className="font-semibold">{product.name}</h3>
                <p>{product.description}</p>
                <p className="font-semibold mt-2">Precio: ${product.price.toFixed(2)}</p>
                <div className="flex items-center mt-2">
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
                    className="w-16 mr-2"
                  />
                  <Button
                    onClick={() => {
                      onAddProduct(product, quantity)
                      setQuantity(1)
                    }}
                  >
                    Agregar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

