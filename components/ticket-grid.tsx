// src/components/TicketGrid.tsx
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { X, Minus, Plus, Sparkles, Ticket } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/Label'
import { getSoldTickets } from '@/server/helpers/getSoldTickets'
import { driver } from "driver.js";
import 'driver.js/dist/driver.css'

export function TicketGrid({
  selectedTickets,
  onSelectedTicketsChange,
}: {
  selectedTickets: number[]
  onSelectedTicketsChange: (tickets: number[]) => void
}) {
  const [soldTickets, setSoldTickets] = useState<number[]>([])
  const totalTickets = 10000
  const [isClient, setIsClient] = useState(false)
  const [loading, setLoading] = useState(true)

  // Cargar boletos vendidos desde el servidor
  useEffect(() => {
    setIsClient(true)
    const loadSoldTickets = async () => {
      setLoading(true)
      try {
        const tickets = await getSoldTickets()
        console.log('Tickets vendidos cargados:', tickets)
        setSoldTickets(tickets)
      } catch (error) {
        console.error('Error al cargar boletos vendidos:', error)
      } finally {
        setLoading(false)
      }
    }
    loadSoldTickets()
  }, [])

  const [currentPage, setCurrentPage] = useState(1)
  const ticketsPerPage = 1000
  const totalPages = Math.ceil(totalTickets / ticketsPerPage)
  const allTickets = Array.from({ length: totalTickets }, (_, i) => i)
  const availableTickets = isClient ? allTickets.filter((t) => !soldTickets.includes(t)) : []
  const startIndex = (currentPage - 1) * ticketsPerPage
  const endIndex = startIndex + ticketsPerPage
  const currentPageTickets = isClient ? allTickets.slice(startIndex, endIndex) : []

  const soldPercentage = isClient ? Number(((soldTickets.length / totalTickets) * 100).toFixed(2)) : 0
  const [showNotification, setShowNotification] = useState<string | null>(null)

  // Notificaciones inteligentes
  useEffect(() => {
    const count = selectedTickets.length
    if (count === 5) {
      setShowNotification('🎯 ¡Genial! Elige 5 más: paga $15 USD (ahorras $5) o 2.130 Bs (ahorras 520 Bs).')
    } else if (count === 9) {
      setShowNotification('🔥 ¡Casi lo tienes! 1 más y pagas $15 USD o 2.130 Bs por 10 boletos.')
    } else {
      setShowNotification(null)
    }
  }, [selectedTickets.length])

  const toggleTicket = (ticketNumber: number) => {
    if (soldTickets.includes(ticketNumber)) return // ya vendido
    onSelectedTicketsChange(
      selectedTickets.includes(ticketNumber)
        ? selectedTickets.filter((t) => t !== ticketNumber)
        : [...selectedTickets, ticketNumber]
    )
  }

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const goToFirstPage = () => goToPage(1)
  const goToLastPage = () => goToPage(totalPages)
  const goToPrevPage = () => goToPage(currentPage - 1)
  const goToNextPage = () => goToPage(currentPage + 1)

  const formatTicketNumber = (num: number) => num.toString().padStart(4, '0')

  // 💵 Cálculo en USD (original)
  const calculateTotalUSD = (tickets: number[]) => {
    const ticketPrice = 2
    const groupsOfTen = Math.floor(tickets.length / 10)
    const remaining = tickets.length % 10
    return groupsOfTen * 15 + remaining * ticketPrice
  }

  // 🇻🇪 Cálculo en Bolívares (nuevo)
  const calculateTotalBs = (tickets: number[]) => {
    const pricePerTicket = 265
    const pricePerTenPack = 2130
    const groupsOfTen = Math.floor(tickets.length / 10)
    const remaining = tickets.length % 10
    return groupsOfTen * pricePerTenPack + remaining * pricePerTicket
  }

  // --- Lucky Pick ---
  const [ticketCount, setTicketCount] = useState(1)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleTicketChange = (value: string) => {
    const num = parseInt(value) || 1
    setTicketCount(Math.max(1, Math.min(100, num)))
  }

  const incrementTickets = () => setTicketCount((prev) => Math.min(100, prev + 1))
  const decrementTickets = () => setTicketCount((prev) => Math.max(1, prev - 1))

  const handleLuckyPick = () => {
    if (!isClient || loading) return
    setIsAnimating(true)
    setTimeout(() => {
      const randomTickets: number[] = []
      const maxAttempts = 1000
      for (let i = 0; i < ticketCount; i++) {
        let attempts = 0
        let randomTicket
        do {
          randomTicket = Math.floor(Math.random() * totalTickets)
          attempts++
        } while (
          soldTickets.includes(randomTicket) ||
          randomTickets.includes(randomTicket) ||
          attempts > maxAttempts
        )
        if (!randomTickets.includes(randomTicket)) {
          randomTickets.push(randomTicket)
        }
      }
      onSelectedTicketsChange(randomTickets)
      if (randomTickets.length > 0) {
        const firstTicketPage = Math.ceil((randomTickets[0] + 1) / ticketsPerPage)
        setCurrentPage(firstTicketPage)
      }
      setIsAnimating(false)
    }, 1500)
  }

  // --- Driver.js Tour (v1.x compatible) ---
  const startTour = () => {
    if (typeof window === 'undefined') return // Solo en cliente

    const tour = driver({
      showProgress: true,
      allowKeyboardControl: true,
      allowClose: true,
      steps: [
        {
          element: '#ticket-grid-title',
          popover: {
            title: '¡Bienvenido al selector de boletos!',
            description: 'Aquí puedes seleccionar manualmente o aleatoriamente tus boletos para participar en el sorteo.',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '#progress-bar',
          popover: {
            title: 'Barra de progreso de ventas',
            description: 'Muestra el porcentaje de boletos ya vendidos. ¡Date prisa antes de que se agoten!',
            side: 'bottom',
            align: 'center',
          },
        },
        {
          element: '#legend',
          popover: {
            title: 'Leyenda de colores',
            description: 'Verde/amarillo: disponible. Naranja: seleccionado. Gris: vendido.',
            side: 'bottom',
            align: 'center',
          },
        },
        {
          element: '#total-display',
          popover: {
            title: 'Total a pagar',
            description: 'El costo se calcula automáticamente. ¡Por cada 10 boletos pagas solo $15 USD o 2.130 Bs!',
            side: 'bottom',
            align: 'center',
          },
        },
        {
          element: '#selected-tickets-list',
          popover: {
            title: 'Tus boletos seleccionados',
            description:
              'Aquí ves los números que has elegido. Puedes hacer clic en cualquier boleto de la cuadrícula para agregarlo o quitarlo.',
            side: 'top',
            align: 'center',
          },
        },
        {
          element: '#lucky-pick-section',
          popover: {
            title: '¡Escoge a la suerte!',
            description:
              'Selecciona cuántos boletos quieres y haz clic en este botón para que el sistema elija números aleatorios por ti.',
            side: 'bottom',
            align: 'center',
          },
        },
        {
          element: '#ticket-grid',
          popover: {
            title: 'Cuadrícula de boletos',
            description:
              'Navega entre páginas usando los botones de abajo. Haz clic en cualquier boleto disponible (gris claro) para seleccionarlo.',
            side: 'top',
            align: 'center',
          },
        },
        {
          element: '#pagination-controls',
          popover: {
            title: 'Controles de paginación',
            description: 'Usa estos botones para moverte entre las 10,000 boletas. Cada página muestra 1,000 números.',
            side: 'top',
            align: 'center',
          },
        },
        {
          element: '#available-counter',
          popover: {
            title: 'Boletos disponibles',
            description: 'Este contador te muestra cuántos boletos aún puedes comprar. ¡No esperes demasiado!',
            side: 'top',
            align: 'center',
          },
        },
      ],
    })

    tour.drive()
  }

  return (
    <div className="mb-8 p-[1px] rounded-xl bg-[linear-gradient(to_right,_#ec4899,_#facc15,_#60a5fa,_#22c55e)]">
      <Card className="p-4 sm:p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-black shadow-2xl border-0 relative">
        <div className="absolute top-4 right-4 w-16 h-16 opacity-30">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/lighta-k5gVU711ympDPJ2K6w8q3rMhsp1Xx3.webp"
            alt="Aro decorativo"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="text-center mb-8">
          <div className="p-[1px] rounded-full bg-[linear-gradient(to_right,_#ec4899,_#facc15,_#60a5fa,_#22c55e)] inline-block mb-4 shadow-lg">
            <div className="bg-stone-950 w-fit text-s text-white py-3 px-6 rounded-full flex items-center space-x-2">
              <h2
                id="ticket-grid-title"
                className="text-lg sm:text-3xl font-black flex items-center justify-center space-x-1 sm:space-x-3"
              >
                <img src="/boletas.png" alt="Boletas" className="w-6 h-6" />
                <span className="text-balance">
                  <b>Lista de Boletos</b>
                </span>
              </h2>
              <button
                onClick={startTour}
                className="ml-4 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm py-1 px-3 rounded-full flex items-center gap-1 transition-all duration-300 shadow-md"
              >
                <Sparkles className="w-4 h-4" />
                ¿Cómo usar?
              </button>
            </div>
          </div>

          {/* Barra de progreso */}
          <div id="progress-bar" className="mb-6 max-w-md mx-auto">
            <div className="flex justify-between text-sm sm:text-lg font-bold mb-2">
              <span className="text-gray-200">🔥 Progreso de ventas</span>
              <span suppressHydrationWarning className="text-orange-400">
                {loading ? 'Cargando...' : `${soldPercentage}%`}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-4 sm:h-6 shadow-inner">
              <div
                className="bg-gradient-to-r from-orange-400 via-yellow-500 to-orange-600 h-4 sm:h-6 rounded-full transition-all duration-1000 shadow-lg relative overflow-hidden"
                style={{ width: loading ? '0%' : `${soldPercentage}%` }}
              >
                {!loading && <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>}
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-300 mt-2 font-medium">
              🎯 {soldTickets.length} vendidos de {totalTickets}
            </p>
          </div>

          {/* Leyenda */}
          <div id="legend" className="flex items-center justify-center space-x-3 sm:space-x-6 mb-6">
            <div className="flex items-center space-x-1 sm:space-x-2 bg-gray-800 px-2 sm:px-4 py-1 sm:py-2 rounded-full shadow-md border border-gray-600">
              <div className="w-3 h-3 sm:w-5 sm:h-5 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full border-2 border-gray-300"></div>
              <span className="text-xs sm:text-sm font-medium text-gray-200">Disponible</span>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2 bg-gray-800 px-2 sm:px-4 py-1 sm:py-2 rounded-full shadow-md border border-gray-600">
              <div className="w-3 h-3 sm:w-5 sm:h-5 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-full border-2 border-orange-300"></div>
              <span className="text-xs sm:text-sm font-medium text-gray-200">Seleccionado</span>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2 bg-gray-800 px-2 sm:px-4 py-1 sm:py-2 rounded-full shadow-md border border-gray-600">
              <div className="w-3 h-3 sm:w-5 sm:h-5 bg-gray-500 rounded-full border-2 border-gray-400"></div>
              <span className="text-xs sm:text-sm font-medium text-gray-200">Vendido</span>
            </div>
          </div>

          {/* Total — ✅ MOSTRAMOS AMBOS PRECIOS */}
          <div id="total-display" className="bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-600 text-black py-3 px-4 sm:py-4 sm:px-8 rounded-2xl inline-block mb-4 shadow-xl max-w-full">
            {isClient && (
              <>
                {/* Precio en USD */}
                <p suppressHydrationWarning className="text-lg sm:text-2xl font-black">
                  💵 Total USD: ${calculateTotalUSD(selectedTickets).toFixed(2)}
                </p>

                {/* Precio en Bs */}
                <p className="text-lg sm:text-2xl font-black text-yellow-900 mt-1">
                  🇻🇪 Total Bs: {new Intl.NumberFormat('es-VE').format(calculateTotalBs(selectedTickets))} Bs
                </p>

                {/* Cantidad de boletos */}
                <p className="text-sm sm:text-lg font-bold mt-2">
                  🎟️ {selectedTickets.length} BOLETO{selectedTickets.length !== 1 ? 'S' : ''} SELECCIONADO{selectedTickets.length !== 1 ? 'S' : ''}
                </p>

                {/* Leyenda de precios */}
                <p className="text-xs text-white/80 mt-2">
                  💡 USD: $2 c/u • $15 cada 10 | Bs: 265 c/u • 2.130 cada 10
                </p>
              </>
            )}
          </div>

          {/* Lista de boletos seleccionados */}
          {selectedTickets.length > 0 && (
            <div id="selected-tickets-list" className="bg-gray-800 border border-gray-600 rounded-xl p-4 mb-6 max-w-md mx-auto shadow-inner">
              <h3 className="text-sm font-bold text-gray-200 mb-2 flex items-center gap-2">
                <Ticket className="w-4 h-4 text-orange-400" />
                Tus boletos seleccionados ({selectedTickets.length}):
              </h3>
              <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto text-xs">
                {selectedTickets
                  .sort((a, b) => a - b)
                  .map((ticket) => (
                    <span
                      key={ticket}
                      className="bg-gradient-to-r from-orange-500 to-yellow-500 text-black px-2 py-1 rounded-md font-mono font-bold shadow-sm"
                    >
                      {formatTicketNumber(ticket)}
                    </span>
                  ))}
              </div>
            </div>
          )}

          {/* Notificación inteligente */}
          {showNotification && (
            <Alert className="bg-blue-600 text-white border-none shadow-lg mb-6">
              <AlertDescription className="flex items-center justify-between px-2">
                <span>{showNotification}</span>
                <button
                  onClick={() => setShowNotification(null)}
                  className="ml-4 hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </AlertDescription>
            </Alert>
          )}

          {/* LotteryButton */}
          <div id="lucky-pick-section" className="max-w-md mx-auto mb-8">
            <Card className="bg-stone-950 backdrop-blur-xl border border-stone-800/50 shadow-2xl shadow-black/50 rounded-3xl overflow-hidden">
              <CardContent className="p-8 space-y-8">
                <div className="space-y-6">
                  <Label htmlFor="tickets" className="text-lg font-medium text-stone-200 flex items-center gap-3 tracking-wide">
                    <Ticket className="w-5 h-5 text-stone-400" />
                    Cantidad de Tickets
                  </Label>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={decrementTickets}
                      disabled={ticketCount <= 1}
                      className="h-14 w-14 rounded-2xl border border-stone-700/50 hover:border-stone-600 hover:bg-stone-800/50 bg-stone-900/50 backdrop-blur-sm text-stone-300 hover:text-white transition-all duration-300 disabled:opacity-30"
                    >
                      <Minus className="w-5 h-5" />
                    </Button>
                    <div className="flex-1">
                      <Input
                        id="tickets"
                        type="number"
                        min="1"
                        max="100"
                        value={ticketCount}
                        onChange={(e) => handleTicketChange(e.target.value)}
                        className="text-center text-2xl font-light h-14 border border-stone-700/50 focus:border-stone-500 bg-stone-900/50 backdrop-blur-sm text-white rounded-2xl focus:ring-2 focus:ring-stone-500/30 transition-all duration-300"
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={incrementTickets}
                      disabled={ticketCount >= 100}
                      className="h-14 w-14 rounded-2xl border border-stone-700/50 hover:border-stone-600 hover:bg-stone-800/50 bg-stone-900/50 backdrop-blur-sm text-stone-300 hover:text-white transition-all duration-300 disabled:opacity-30"
                    >
                      <Plus className="w-5 h-5" />
                    </Button>
                  </div>
                  <p className="text-sm text-stone-400 text-center font-light tracking-wide">
                    Selecciona entre 1 y 100 tickets
                  </p>
                </div>
                <div className="relative group">
                  <Button
                    onClick={handleLuckyPick}
                    disabled={isAnimating || !isClient}
                    className={`
                      w-full h-20 text-xl font-semibold tracking-wide
                      bg-gradient-to-b from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400
                      text-black border-0 rounded-3xl
                      transform transition-all duration-300 ease-out
                      shadow-[0_12px_0_0_#ca8a04,0_20px_40px_rgba(234,179,8,0.4)]
                      hover:shadow-[0_8px_0_0_#ca8a04,0_16px_32px_rgba(234,179,8,0.6)]
                      active:shadow-[0_4px_0_0_#ca8a04,0_8px_16px_rgba(234,179,8,0.4)]
                      hover:translate-y-[-4px]
                      active:translate-y-[6px]
                      ${isAnimating ? 'animate-pulse scale-105 shadow-[0_0_40px_rgba(234,179,8,0.8)]' : ''}
                      relative overflow-hidden
                    `}
                  >
                    <div className="flex items-center gap-4 relative z-10">
                      <Sparkles className={`w-7 h-7 ${isAnimating ? 'animate-spin' : ''}`} />
                      {isAnimating ? 'Seleccionando...' : 'Escoger a la Suerte'}
                      <Sparkles className={`w-7 h-7 ${isAnimating ? 'animate-spin' : ''}`} />
                    </div>
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 pointer-events-none" />
                  </Button>
                </div>
                <div className="text-center space-y-3 pt-2">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-stone-800/50 backdrop-blur-sm rounded-full border border-stone-700/30">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                    <p className="text-stone-200 font-medium text-sm tracking-wide">
                      {ticketCount} ticket{ticketCount > 1 ? 's' : ''} seleccionado{ticketCount > 1 ? 's' : ''}
                    </p>
                  </div>
                  <p className="text-xs text-stone-500 font-light tracking-wider uppercase">
                    Más tickets = más oportunidades de ganar
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Información de página */}
        <div className="text-center mb-6">
          <div className="bg-gray-800 border border-gray-600 px-3 sm:px-6 py-2 sm:py-3 rounded-full shadow-md inline-block max-w-full">
            <p className="text-sm sm:text-lg font-bold text-gray-200">
              📄 Página {currentPage} de {totalPages} - Números del {startIndex + 1} al {isClient ? Math.min(endIndex, totalTickets) : '...'}
            </p>
          </div>
        </div>

        {/* Cuadrícula de boletos */}
        <div id="ticket-grid" className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-orange-500 scrollbar-track-gray-700 mb-8">
          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-12 lg:grid-cols-15 xl:grid-cols-20 gap-1 sm:gap-2 p-2">
            {isClient && currentPageTickets.length > 0 ? (
              currentPageTickets.map((ticketNumber) => {
                const isSelected = selectedTickets.includes(ticketNumber)
                const isSold = soldTickets.includes(ticketNumber)
                return (
                  <button
                    key={ticketNumber}
                    onClick={() => !isSold && toggleTicket(ticketNumber)}
                    disabled={isSold}
                    className={`
                      p-1 sm:p-2 text-center rounded-md font-bold font-mono aspect-square flex items-center justify-center transition-all duration-300 border shadow-md text-xs
                      ${
                        isSold
                          ? 'bg-gray-500 text-gray-300 border-gray-500 cursor-not-allowed opacity-50'
                          : isSelected
                          ? 'bg-gradient-to-r from-orange-400 to-yellow-500 text-black border-orange-300 shadow-lg transform scale-105 z-10'
                          : 'bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 border-gray-500 hover:shadow-lg hover:scale-105 text-gray-200'
                      }
                    `}
                  >
                    <span className="leading-none">{formatTicketNumber(ticketNumber)}</span>
                  </button>
                )
              })
            ) : (
              <div className="col-span-full text-center text-gray-500 py-4">
                {loading ? 'Cargando boletos...' : 'No hay boletos disponibles'}
              </div>
            )}
          </div>
        </div>

        {/* Paginación */}
        <div id="pagination-controls" className="flex flex-wrap justify-center items-center gap-2 max-w-full overflow-x-auto py-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToFirstPage}
            disabled={currentPage === 1 || !isClient}
            className="bg-gray-800 border-gray-600 text-gray-200 shadow-md hover:shadow-lg hover:bg-gray-700 flex-shrink-0"
          >
            ⏮
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={goToPrevPage}
            disabled={currentPage === 1 || !isClient}
            className="bg-gray-800 border-gray-600 text-gray-200 shadow-md hover:shadow-lg hover:bg-gray-700 flex-shrink-0"
          >
            ◀
          </Button>

          {isClient && currentPage > 2 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => goToPage(1)}
                className="bg-gray-800 text-gray-200 shadow-md hover:bg-gray-700 flex-shrink-0"
              >
                1
              </Button>
              {currentPage > 3 && <span className="text-gray-400 font-bold">...</span>}
            </>
          )}

          {isClient && currentPage > 1 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              className="bg-gray-800 text-gray-200 shadow-md hover:bg-gray-700 flex-shrink-0"
            >
              {currentPage - 1}
            </Button>
          )}

          <Button className="bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-bold shadow-lg flex-shrink-0">
            {currentPage}
          </Button>

          {isClient && currentPage < totalPages && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              className="bg-gray-800 text-gray-200 shadow-md hover:bg-gray-700 flex-shrink-0"
            >
              {currentPage + 1}
            </Button>
          )}

          {isClient && currentPage < totalPages - 1 && (
            <>
              {currentPage < totalPages - 2 && <span className="text-gray-400 font-bold">...</span>}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => goToPage(totalPages)}
                className="bg-gray-800 text-gray-200 shadow-md hover:bg-gray-700 flex-shrink-0"
              >
                {totalPages}
              </Button>
            </>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={goToNextPage}
            disabled={currentPage === totalPages || !isClient}
            className="bg-gray-800 border-gray-600 text-gray-200 shadow-md hover:shadow-lg hover:bg-gray-700 flex-shrink-0"
          >
            ▶
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={goToLastPage}
            disabled={currentPage === totalPages || !isClient}
            className="bg-gray-800 border-gray-600 text-gray-200 shadow-md hover:shadow-lg hover:bg-gray-700 flex-shrink-0"
          >
            ⏭
          </Button>
        </div>

        {/* Boletos disponibles */}
        <div id="available-counter" className="text-center mt-6">
          <div className="bg-gray-800 border border-gray-600 px-3 sm:px-6 py-2 sm:py-3 rounded-full inline-block shadow-md max-w-full">
            <p className="text-sm sm:text-lg font-bold text-orange-400">
              🎯 {isClient ? availableTickets.length : 0} boletos disponibles de {totalTickets}
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
