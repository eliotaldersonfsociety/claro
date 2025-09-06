"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"

export function PaymentMethods() {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)

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
    "Pago Móvil": { link: "https://wa.me/17863728246" },
    Nequi: { phone: "3219412929" },
    "Cash App": { link: "https://cash.app/$MaikolArdila" },
    "Western Union": { name: "Elbis Pleyker Peña Mendez", country: "EEUU - Miami", ci: "22214146" },
    Airtm: { email: "rifaslosfantasticos@gmail.com", name: "rifasfantasticos" },
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert("✅ Copiado: " + text)
  }

  return (
    <div className="mb-8 p-[1px] rounded-xl bg-[linear-gradient(to_right,_#ec4899,_#facc15,_#60a5fa,_#22c55e)]">
      <Card className="border-0 p-4 md:p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-black shadow-2xl border border-gray-700">
        {/* Título */}
        <div className="text-center mb-6 md:mb-8">
          <div className="p-[1px] rounded-full bg-[linear-gradient(to_right,_#ec4899,_#facc15,_#60a5fa,_#22c55e)] inline-block mb-4 shadow-lg">
            <div className="bg-stone-950 w-fit text-s text-white py-3 px-6 rounded-full flex items-center space-x-2">
              <h2 className="text-lg sm:text-3xl font-black flex items-center justify-center space-x-2">
                <img src="/pago.png" alt="Boletas" className="w-6 h-6" />
                <span>
                  <b>Métodos de Pago</b>
                </span>
              </h2>
            </div>
          </div>
        </div>

        {/* Botones de métodos */}
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4 mb-8">
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
          <div className="mb-8">
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
                  <div className="bg-gray-900 p-4 rounded-xl">
                    <p className="text-gray-300 text-sm">🔗 Link de Pago</p>
                    <a
                      href={paymentData["Pago Móvil"].link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm sm:text-base font-bold text-blue-400 hover:underline break-words"
                    >
                      {paymentData["Pago Móvil"].link}
                    </a>
                    <button
                      onClick={() => copyToClipboard(paymentData["Pago Móvil"].link)}
                      className="mt-2 text-xs bg-blue-600 px-3 py-1 rounded-lg text-white hover:bg-blue-700"
                    >
                      Copiar
                    </button>
                  </div>
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
                  {[ "ci", "name"].map((field, i) => (
                    <div key={i} className="bg-gray-900 p-4 rounded-xl">
                      <p className="text-gray-300 text-sm">
                        {field === "phone" ? "📱 Teléfono" : field === "ci" ? "🆔 Cédula" : field === "bank" ? "🏦 Banco" : "👤 Nombre"}
                      </p>
                      <p className="text-sm sm:text-base font-bold text-white break-words text-center">
                        {paymentData["Western Union"][field as keyof typeof paymentData["Western Union"]]}
                      </p>
                      <button
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
