// app/dashboard/page.tsx
"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { getEntries } from "../actions/getEntries"
import { deleteEntry } from "@/app/actions/deleteEntry"
import { logoutAction } from "@/app/actions/logout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Trash2,
  Search,
  FileText,
  Phone,
  CreditCard,
  User,
  MapPin,
  Hash,
  Eye,
  LogOut,
} from "lucide-react"
import Image from "next/image"

export default function DashboardPage() {
  const [entries, setEntries] = useState<any[]>([])
  const [filteredEntries, setFilteredEntries] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [selectedEntry, setSelectedEntry] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { isAuthenticated, logout, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    async function fetchEntries() {
      setLoading(true)
      const res = await getEntries()
      if (res.success) {
        setEntries(res.data as any[])
        setFilteredEntries(res.data as any[])
      }
      setLoading(false)
    }
    fetchEntries()
  }, [])

  // Calcular Top 5 compradores (solo si no hay búsqueda activa)
  const topBuyers = useMemo(() => {
    if (searchTerm.trim() !== '') return []

    return [...entries]
      .sort((a, b) => b.ticketCount - a.ticketCount)
      .slice(0, 5)
  }, [entries, searchTerm])

  // Detectar si estamos buscando un número de boleto específico
  const searchedTicket = useMemo(() => {
    const term = searchTerm.trim()
    if (/^\d{1,4}$/.test(term)) {
      return term.padStart(4, '0')
    }
    return null
  }, [searchTerm])

  // Filtro por texto O número de boleto
  useEffect(() => {
    const term = searchTerm.toLowerCase().trim()

    const filtered = entries
      .filter((entry) => {
        const matchesText =
          entry.fullName.toLowerCase().includes(term) ||
          entry.idNumber.toLowerCase().includes(term) ||
          entry.phone.toLowerCase().includes(term) ||
          entry.countryName.toLowerCase().includes(term)

        const matchesTicket = entry.tickets.some(
          (ticket: string | number) => ticket.toString().includes(term)
        )

        return matchesText || matchesTicket
      })
      .sort((a, b) => b.ticketCount - a.ticketCount)

    setFilteredEntries(filtered)
  }, [searchTerm, entries])

  const handleDelete = async (id: number) => {
    if (confirm("¿Seguro que deseas eliminar esta entrada?")) {
      const res = await deleteEntry(id)
      if (res.success) {
        setEntries(entries.filter((e) => e.id !== id))
        if (selectedEntry?.id === id) {
          setIsModalOpen(false)
          setSelectedEntry(null)
        }
      } else {
        alert(res.message)
      }
    }
  }

  const handleViewEntry = (entry: any) => {
    setSelectedEntry(entry)
    setIsModalOpen(true)
  }

  const handleLogout = async () => {
    if (confirm("¿Seguro que deseas cerrar sesión?")) {
      logout() // limpia el contexto en memoria
      await logoutAction() // borra cookie + redirige a /login
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-center sm:text-left">
            <Image
              src="/4fantasticos.png"
              alt="Dashboard"
              width={180}
              height={50}
              className="mx-auto sm:mx-0 mb-2"
            />
            <p className="text-gray-600 text-sm">
              Gestiona y visualiza todas las entradas registradas
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>{user?.username}</span>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {filteredEntries.length}{" "}
              {filteredEntries.length === 1 ? "entrada" : "entradas"}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </Button>
          </div>
        </div>

        {/* Search */}
        <Card className="bg-white border-gray-200">
          <CardContent className="p-3 sm:p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por nombre, cédula, teléfono, país o número de boleto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border-gray-300 text-gray-900 placeholder-gray-500 text-sm sm:text-base"
              />
            </div>
          </CardContent>
        </Card>

        {/* Banner si se está buscando un boleto específico */}
        {searchedTicket && filteredEntries.length > 0 && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-300 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-500 text-white flex items-center justify-center">
                🎟️
              </div>
              <div>
                <h3 className="font-bold text-yellow-900">
                  Resultados para el boleto <span className="font-mono bg-yellow-200 px-2 py-1 rounded">{searchedTicket}</span>
                </h3>
                <p className="text-yellow-800 text-sm">
                  {filteredEntries.length} cliente{filteredEntries.length !== 1 ? "s" : ""} lo compraron.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Top Buyers */}
        {topBuyers.length > 0 && (
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-4">
              <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
                🏆 Top 5 Compradores
              </h3>
              <div className="space-y-2">
                {topBuyers.map((entry, index) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-2 bg-white rounded-lg border border-blue-100 hover:shadow-sm transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {entry.fullName}
                        </p>
                        <p className="text-xs text-gray-600">
                          {entry.countryName} • {entry.idNumber}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-blue-600 text-white px-3 py-1 text-sm font-bold">
                      {entry.ticketCount} boletos
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Entries List */}
        <div className="space-y-3">
          {filteredEntries.map((entry) => (
            <Card
              key={entry.id}
              className={`
                hover:shadow-md transition-shadow duration-200 bg-white border-gray-200
                ${searchedTicket && entry.tickets.includes(searchedTicket)
                  ? "ring-2 ring-yellow-400 border-yellow-400 bg-yellow-50"
                  : ""
                }
              `}
            >
              <CardContent className="p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 flex-1">
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold text-gray-900 text-sm sm:text-base">
                        {entry.fullName}
                      </span>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800 ml-2">
                        {entry.ticketCount} boletos
                      </Badge>
                      {searchedTicket && entry.tickets.includes(searchedTicket) && (
                        <Badge variant="destructive" className="bg-yellow-500 text-white ml-2 animate-pulse">
                          🔍 ¡Tiene el boleto {searchedTicket}!
                        </Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs sm:text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Hash className="h-4 w-4" />
                        <span>{entry.idNumber}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        <span>{entry.phone}</span>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-xs border-gray-300 text-gray-700"
                      >
                        {entry.countryName}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewEntry(entry)}
                      className="h-8 border-blue-300 text-blue-700 hover:bg-blue-50 text-xs sm:text-sm"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(entry.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredEntries.length === 0 && !loading && (
          <Card className="text-center py-12 bg-white border-gray-200">
            <CardContent>
              <div className="text-gray-600">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2 text-gray-900">
                  No se encontraron entradas
                </h3>
                <p className="text-sm">
                  {searchTerm
                    ? "Intenta con otros términos de búsqueda"
                    : "Aún no hay entradas registradas"}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-lg sm:max-w-2xl max-h-[80vh] overflow-y-auto bg-white">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-gray-900">
                <User className="h-5 w-5 text-blue-600" />
                {selectedEntry?.fullName}
              </DialogTitle>
            </DialogHeader>

            {selectedEntry && (
              <div className="space-y-6 text-sm sm:text-base">
                {/* Personal Info */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-1">
                    Información Personal
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Hash className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-xs font-medium text-gray-600">
                          Cédula
                        </p>
                        <p className="text-gray-900">{selectedEntry.idNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-xs font-medium text-gray-600">
                          Teléfono
                        </p>
                        <p className="text-gray-900">{selectedEntry.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-xs font-medium text-gray-600">
                          País
                        </p>
                        <Badge
                          variant="outline"
                          className="border-gray-300 text-gray-700"
                        >
                          {selectedEntry.countryName}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-1">
                    Información de Pago
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-xs font-medium text-gray-600">
                          Referencia
                        </p>
                        <p className="text-gray-900 font-mono text-sm">
                          {selectedEntry.paymentReference}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-xs font-medium text-gray-600">
                          Titular
                        </p>
                        <p className="text-gray-900">
                          {selectedEntry.accountHolder}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tickets */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-1">
                    Boletos ({selectedEntry.tickets.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedEntry.tickets.map((ticket: string, i: number) => (
                      <Badge
                        key={i}
                        variant="secondary"
                        className={`
                          text-xs sm:text-sm px-3 py-1
                          ${searchedTicket === ticket
                            ? "bg-red-500 text-white animate-bounce font-bold"
                            : "bg-blue-100 text-blue-800"
                          }
                        `}
                      >
                        {ticket}
                        {searchedTicket === ticket && (
                          <span className="ml-1 inline-block animate-pulse">🎯</span>
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* File */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-1">
                    Comprobante
                  </h3>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <FileText className="h-5 w-5 text-gray-500" />
                    <a
                      href={selectedEntry.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline break-all text-sm sm:text-base"
                    >
                      {selectedEntry.fileUrl}
                    </a>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
