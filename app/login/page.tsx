"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Coffee } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("http://ec2-13-216-183-248.compute-1.amazonaws.com:3002/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error("Credenciales inválidas")
      }

      const data = await response.json()
      localStorage.setItem("token", data.token)

      toast({
        title: "Inicio de sesión exitoso",
        description: "Bienvenido a ChefLink",
      })

      router.push("/dashboard")
    } catch (error) {
      setError("Credenciales inválidas. Por favor, intenta de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative p-4"
      style={{
        backgroundImage: `url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-BG2GwAs09U8EubfgV0iA2mYjLAxXPZ.png')`,
      }}
    >
      {/* Overlay oscuro para mejorar la legibilidad */}
      <div className="absolute inset-0 bg-black/50" />

      <Card className="w-full max-w-md relative z-10 border-none bg-white/90 backdrop-blur-sm shadow-2xl">
        <CardHeader className="space-y-3 pb-2">
          <div className="flex items-center justify-center">
            <Coffee className="h-12 w-12 text-amber-800" />
          </div>
          <CardTitle className="text-3xl font-bold text-center text-amber-900">ChefLink</CardTitle>
          <p className="text-sm text-center text-amber-800/80">Sistema de Gestión de Restaurantes</p>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-amber-900">
                Correo Electrónico
              </label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-amber-200 focus:border-amber-500 bg-white/80"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-amber-900">
                Contraseña
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-amber-200 focus:border-amber-500 bg-white/80"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-amber-800 hover:bg-amber-900 text-white transition-colors"
              disabled={isLoading}
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}


