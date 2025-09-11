// src/components/PaymentMethods.tsx
'use client'

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { driver } from "driver.js";
import 'driver.js/dist/driver.css'

export function PaymentMethods({
  selectedTickets,
  total,
}: {
  selectedTickets: number[]
  total: number
}) {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const paymentMethods = [
    { name: "Zelle", icon: "/zelle.png", color: "bg-[#6d1ed4]" },
    { name: "PayPal", icon: "/paypal.png", color: "bg-[#0e319f]" },
    { name: "Binance", icon: "/binance.webp", color: "bg-[#0c0e12]" },
    { name: "Cash App", icon: "/cashapp.png", color: "bg-[#00d72e]" },
    { name: "Airtm", icon: "/airtm.jpg", color: "bg-[#0080ff]" },
    { name: "Western Union", icon: "/wester.png", color: "bg-[#ffdd00]" },
    { name: "Pago Móvil", icon: "/pagomovil.png", color: "bg-red-700" },
    { name: "Nequi", icon: "/nequi.png", color: "bg-white", textColor: "text-purple-900" },
  ]

  const paymentData = {
    Zelle: { email: "rifalosfantasticos@gmail.com", name: "Pleyker Pena" },
    PayPal: { email: "bucarmarketing@gmail.com", link: "https://paypal.me/bucarmarketing", name: "Bucarmarketing" },
    Binance: { id: "613937704", email: "rifalosfantasticos@gmail.com", wallet: "0x8667128a08288e39a916712f899d43761bb260b7" },
    "Pago Móvil": { bank: "Banesco", account: "01340428334281055039", name: "Dilia Mendez Araujo ", ci: "12032808", phone: "04127451647", cost: "420 Bs" },
    Nequi: { phone: "3219412929" },
    "Cash App": { link: "https://cash.app/$MaikolArdila" },
    "Western Union": { name: "Elbis Pleyker Peña Mendez", country: "EEUU - Miami", ci: "22214146" },
    Airtm: { email: "rifaslosfantasticos@gmail.com", name: "rifasfantasticos" },
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert("✅ Copiado: " + text)
  }

  const formatTicketNumber = (num: number) => num.toString().padStart(4, '0')

  // 🎯 DRIVER.JS TOUR
  const startTour = () => {
    if (typeof window === 'undefined') return

    const tour = driver({
      showProgress: true,
      allowKeyboardControl: true,
      allowClose: true,
      steps: [
        {
          element: '#payment-title',
          popover: {
            title: 'Bienvenido a Métodos de Pago',
            description: 'Aquí puedes seleccionar cómo deseas pagar por tus boletos. ¡Elige el que más te convenga!',
            side: 'bottom',
            align: 'center',
          },
        },
        {
          element: '#purchase-summary',
          popover: {
            title: 'Resumen de tu compra',
            description: 'Aquí ves el total a pagar y los números de boletos que has seleccionado.',
            side: 'top',
            align: 'center',
          },
        },
        {
          element: '#payment-grid',
          popover: {
            title: 'Selecciona un método de pago',
            description: 'Haz clic en cualquiera de estos botones para ver los datos de pago correspondientes.',
            side: 'top',
            align: 'center',
          },
        },
        {
          element: '#payment-details',
          popover: {
            title: 'Datos de pago',
            description: 'Una vez seleccionado un método, aquí aparecerán los datos (email, teléfono, link, etc.) que debes usar para pagar.',
            side: 'left',
            align: 'start',
          },
        },
        {
          element: '#copy-buttons',
          popover: {
            title: 'Copia fácilmente',
            description: 'Usa los botones "Copiar" para copiar los datos al portapapeles. ¡Así evitas errores al escribir!',
            side: 'right',
            align: 'start',
          },
        },
        {
          element: '#help-button-payment',
          popover: {
            title: '¿Necesitas ayuda?',
            description: 'Puedes reiniciar este tutorial en cualquier momento haciendo clic aquí.',
            side: 'left',
            align: 'start',
          },
        },
      ],
    })

    tour.drive()
  }

  // Opcional: auto-iniciar tour en primer uso
  // useEffect(() => {
  //   if (!isClient) return
  //   const seen = localStorage.getItem('seenPaymentTour')
  //   if (!seen) {
  //     setTimeout(startTour, 1000)
  //     localStorage.setItem('seenPaymentTour', 'true')
  //   }
  // }, [isClient])

  return (
    <div className="mb-8 p-[1px] rounded-xl bg-[linear-gradient(to_right,_#ec4899,_#facc15,_#60a5fa,_#22c55e)]">
      <Card className="border-0 p-4 md:p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-black shadow-2xl">
        {/* Título */}
        <div className="text-center mb-6 md:mb-8">
          <div className="p-[1px] rounded-full bg-[linear-gradient(to_right,_#ec4899,_#facc15,_#60a5fa,_#22c55e)] inline-block mb-4 shadow-lg">
            <div className="bg-stone-950 w-fit text-s text-white py-3 px-6 rounded-full flex items-center space-x-2">
              <h2
                id="payment-title"
                className="text-lg sm:text-3xl font-black flex items-center justify-center space-x-2"
              >
                <img src="/pago.png" alt="Boletas" className="w-6 h-6" />
                <span>
                  <b>Métodos de Pago</b>
                </span>
              </h2>
              <button
                id="help-button-payment"
                onClick={startTour}
                className="ml-4 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm py-1 px-3 rounded-full flex items-center gap-1 transition-all duration-300 shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-help-circle">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <line x1="12" y1="17" x2="12" y2="17"></line>
                </svg>
                ¿Cómo pagar?
              </button>
            </div>
          </div>
        </div>

        {/* Resumen de compra — NUEVO BLOQUE */}
        {selectedTickets.length > 0 && (
          <div id="purchase-summary" className="bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-600 text-black py-4 px-6 rounded-2xl mb-6 shadow-xl">
            <h4 className="text-lg font-black text-center mb-2">🎟️ TU COMPRA</h4>
            <p className="text-center font-bold text-lg">Total: ${total.toFixed(2)} USD</p>
            <p className="text-center font-bold text-lg text-yellow-900">
              🇻🇪 {new Intl.NumberFormat('es-VE').format(total * 210)} Bs
            </p>
            <div className="mt-2 text-center">
              <p className="text-sm font-medium">Boletos seleccionados ({selectedTickets.length}):</p>
              <div className="flex flex-wrap justify-center gap-1 mt-1">
                {selectedTickets
                  .sort((a, b) => a - b)
                  .map((ticket) => (
                    <span
                      key={ticket}
                      className="bg-black bg-opacity-20 text-white px-2 py-1 rounded text-xs font-mono font-bold"
                    >
                      {formatTicketNumber(ticket)}
                    </span>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Botones de métodos */}
        <div id="payment-grid" className="grid grid-cols-4 md:grid-cols-8 gap-4 mb-8">
          {paymentMethods.map((method, index) => (
            <button
              key={index}
              onClick={() => setSelectedMethod(method.name)}
              className={`flex flex-col items-center p-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg border-2 ${
                selectedMethod === method.name
                  ? `bg-gradient-to-r ${method.color} border-white shadow-2xl scale-105`
                  : `${method.color} border-transparent hover:shadow-xl`
              }`}
            >
              <img src={method.icon} alt={method.name} className="w-10 h-10 mb-2" />
              <span className={`text-sm font-bold text-center ${method.textColor ?? "text-white"}`}>
                {method.name}
              </span>
            </button>
          ))}
        </div>

        {/* Datos del método seleccionado */}
        {selectedMethod && paymentData[selectedMethod as keyof typeof paymentData] && (
          <div id="payment-details" className="mb-8">
            <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-6 rounded-2xl shadow-xl border border-gray-600">
              <h3 className="text-2xl font-bold text-orange-400 mb-4 text-center">
                📋 Datos para {selectedMethod}
              </h3>

              {/* Zelle */}
              {selectedMethod === "Zelle" && (
                <div className="space-y-3 text-center">
                  {["email", "name"].map((field, i) => (
                    <div key={i} className="bg-gray-900 p-4 rounded-xl">
                      <p className="text-gray-300 text-sm">📧 {field}</p>
                      <p className="text-sm sm:text-base font-bold text-white break-words text-center">
                        {paymentData.Zelle[field as keyof typeof paymentData.Zelle]}
                      </p>
                      <button
                        id={i === 0 ? "copy-buttons" : undefined} // Solo el primer botón lleva el ID para el tour
                        onClick={() =>
                          copyToClipboard(paymentData.Zelle[field as keyof typeof paymentData.Zelle] as string)
                        }
                        className="mt-2 text-xs bg-blue-600 px-3 py-1 rounded-lg text-white hover:bg-blue-700"
                      >
                        Copiar
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* PayPal */}
              {selectedMethod === "PayPal" && (
                <div className="space-y-3 text-center">
                  {["email", "name"].map((field, i) => (
                    <div key={i} className="bg-gray-900 p-4 rounded-xl">
                      <p className="text-gray-300 text-sm">
                        {field === "link" ? "🔗 Link directo" : field === "email" ? "📧 Email" : "👤 Nombre"}
                      </p>
                      <p className="text-sm sm:text-base font-bold text-white break-words text-center">
                        {paymentData.PayPal[field as keyof typeof paymentData.PayPal]}
                      </p>
                      <button
                        id={i === 0 ? "copy-buttons" : undefined}
                        onClick={() =>
                          copyToClipboard(
                            field === "link"
                              ? paymentData.PayPal.link
                              : paymentData.PayPal[field as keyof typeof paymentData.PayPal]
                          )
                        }
                        className="mt-2 text-xs bg-blue-600 px-3 py-1 rounded-lg text-white hover:bg-blue-700"
                      >
                        Copiar
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Binance */}
              {selectedMethod === "Binance" && (
                <div className="space-y-3 text-center">
                  {["id", "email", "wallet"].map((field, i) => (
                    <div key={i} className="bg-gray-900 p-4 rounded-xl">
                      <p className="text-gray-300 text-sm">
                        {field === "id" ? "🆔 ID Binance" : field === "email" ? "📧 Email" : "💰 Wallet"}
                      </p>
                      <p
                        className={`text-sm sm:text-base font-bold ${
                          field === "wallet" ? "text-yellow-400 break-all" : "text-white break-words"
                        } text-center`}
                      >
                        {paymentData.Binance[field as keyof typeof paymentData.Binance]}
                      </p>
                      <button
                        id={i === 0 ? "copy-buttons" : undefined}
                        onClick={() =>
                          copyToClipboard(paymentData.Binance[field as keyof typeof paymentData.Binance])
                        }
                        className="mt-2 text-xs bg-blue-600 px-3 py-1 rounded-lg text-white hover:bg-blue-700"
                      >
                        Copiar
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Pago Móvil */}
              {selectedMethod === "Pago Móvil" && (
                <div className="space-y-3 text-center">
                  {["bank", "account", "name", "ci", "phone", "cost"].map((field, i) => (
                    <div key={i} className="bg-gray-900 p-4 rounded-xl">
                      <p className="text-gray-300 text-sm">
                        {field === "bank"
                          ? "🏦 Banco"
                          : field === "account"
                          ? "💳 Cuenta"
                          : field === "name"
                          ? "👤 Titular"
                          : field === "ci"
                          ? "🆔 Cédula"
                          : field === "phone"
                          ? "📱 Teléfono"
                          : "💵 Monto po Ticket"}
                      </p>
                      <p className="text-sm sm:text-base font-bold text-white break-words text-center">
                        {paymentData["Pago Móvil"][field as keyof typeof paymentData["Pago Móvil"]]}
                      </p>
                      <button
                        id={i === 0 ? "copy-buttons" : undefined}
                        onClick={() =>
                          copyToClipboard(
                            paymentData["Pago Móvil"][field as keyof typeof paymentData["Pago Móvil"]] as string
                          )
                        }
                        className="mt-2 text-xs bg-blue-600 px-3 py-1 rounded-lg text-white hover:bg-blue-700"
                      >
                        Copiar
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Nequi */}
              {selectedMethod === "Nequi" && (
                <div className="space-y-3 text-center">
                  <div className="bg-gray-900 p-4 rounded-xl">
                    <p className="text-gray-300 text-sm">📱 Teléfono</p>
                    <p className="text-sm sm:text-base font-bold text-white break-words text-center">
                      {paymentData.Nequi.phone}
                    </p>
                    <button
                      id="copy-buttons"
                      onClick={() => copyToClipboard(paymentData.Nequi.phone)}
                      className="mt-2 text-xs bg-blue-600 px-3 py-1 rounded-lg text-white hover:bg-blue-700"
                    >
                      Copiar
                    </button>
                  </div>
                </div>
              )}

              {/* Cash App */}
              {selectedMethod === "Cash App" && (
                <div className="space-y-3 text-center">
                  <div className="bg-gray-900 p-4 rounded-xl">
                    <p className="text-gray-300 text-sm">🔗 Link directo</p>
                    <a
                      href={paymentData["Cash App"].link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs sm:text-sm font-bold text-blue-400 break-all text-center underline hover:text-blue-500 block"
                    >
                      {paymentData["Cash App"].link}
                    </a>
                    <button
                      id="copy-buttons"
                      onClick={() => copyToClipboard(paymentData["Cash App"].link)}
                      className="mt-2 text-xs bg-blue-600 px-3 py-1 rounded-lg text-white hover:bg-blue-700"
                    >
                      Copiar
                    </button>
                  </div>
                </div>
              )}

              {/* Airtm */}
              {selectedMethod === "Airtm" && (
                <div className="space-y-3 text-center">
                  {["email", "name"].map((field, i) => (
                    <div key={i} className="bg-gray-900 p-4 rounded-xl">
                      <p className="text-gray-300 text-sm">
                        {field === "link" ? "🔗 Link directo" : field === "email" ? "📧 Email" : "👤 Nombre"}
                      </p>
                      <p className="text-sm sm:text-base font-bold text-white break-words text-center">
                        {paymentData.Airtm[field as keyof typeof paymentData.Airtm]}
                      </p>
                      <button
                        id={i === 0 ? "copy-buttons" : undefined}
                        onClick={() =>
                          copyToClipboard(
                            field === "name"
                              ? paymentData.Airtm.name
                              : paymentData.Airtm[field as keyof typeof paymentData.Airtm]
                          )
                        }
                        className="mt-2 text-xs bg-blue-600 px-3 py-1 rounded-lg text-white hover:bg-blue-700"
                      >
                        Copiar
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Western Union */}
              {selectedMethod === "Western Union" && (
                <div className="space-y-3 text-center">
                  {["ci", "name"].map((field, i) => (
                    <div key={i} className="bg-gray-900 p-4 rounded-xl">
                      <p className="text-gray-300 text-sm">
                        {field === "phone" ? "📱 Teléfono" : field === "ci" ? "🆔 Cédula" : field === "bank" ? "🏦 Banco" : "👤 Nombre"}
                      </p>
                      <p className="text-sm sm:text-base font-bold text-white break-words text-center">
                        {paymentData["Western Union"][field as keyof typeof paymentData["Western Union"]]}
                      </p>
                      <button
                        id={i === 0 ? "copy-buttons" : undefined}
                        onClick={() =>
                          copyToClipboard(paymentData["Western Union"][field as keyof typeof paymentData["Western Union"]])
                        }
                        className="mt-2 text-xs bg-blue-600 px-3 py-1 rounded-lg text-white hover:bg-blue-700"
                      >
                        Copiar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
