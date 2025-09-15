// app/components/TicketVerifier.tsx
'use client'

import { useState } from 'react'
import { verifyTickets } from '@/app/actions/verifyTickets'
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from 'next/link'

export function TicketVerifier() {
  const [identifier, setIdentifier] = useState('')
  const [tickets, setTickets] = useState<number[] | null>(null)
  const [customer, setCustomer] = useState<{
    fullName: string
    idNumber: string
    phone: string
    countryCode: string
    countryName: string
    paymentReference: string
    accountHolder: string
    fileUrl?: string
    fileName?: string
    mimeType?: string
  } | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    setLoading(true)
    setMessage(null)
    setTickets(null)
    setCustomer(null)

    const res = await verifyTickets({ identifier })

    if (res.success) {
      setTickets(res.tickets ?? null)
      if (res.customer) {
        setCustomer({
          fullName: String(res.customer.fullName),
          idNumber: String(res.customer.idNumber),
          phone: String(res.customer.phone),
          countryCode: String(res.customer.countryCode),
          countryName: String(res.customer.countryName),
          paymentReference: String(res.customer.paymentReference),
          accountHolder: String(res.customer.accountHolder),
          fileUrl: res.customer.fileUrl ? String(res.customer.fileUrl) : undefined,
          fileName: res.customer.fileName ? String(res.customer.fileName) : undefined,
          mimeType: res.customer.mimeType ? String(res.customer.mimeType) : undefined,
        })
      } else {
        setCustomer(null)
      }

      if ((res.tickets?.length ?? 0) === 0) {
        setMessage('No se encontraron boletos para este usuario')
      }
    } else {
      setMessage(res.message)
    }

    setLoading(false)
  }

  return (
    <div className="mb-8 p-[1px] rounded-xl bg-[linear-gradient(to_right,_#ec4899,_#facc15,_#60a5fa,_#22c55e)]">
      <Card className="border-0 p-4 md:p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-black shadow-2xl">
        <div className="text-center">
          <div className="p-[1px] rounded-full bg-[linear-gradient(to_right,_#ec4899,_#facc15,_#60a5fa,_#22c55e)] inline-block mb-4 shadow-lg">
            <div className="bg-stone-950 w-fit text-s text-white py-3 px-6 rounded-full flex items-center space-x-2">
              <h2 className="text-lg sm:text-3xl font-black flex items-center justify-center space-x-1 sm:space-x-3">
                <img src="/verificado.png" alt="Boletas" className="w-6 h-6" />
                <span className="text-balance"><b>Verificador de boletos</b></span>
              </h2>
            </div>
          </div>
        </div>

        <div className="max-w-md mx-auto mb-4">
          <Input
            placeholder="Ingresa tu número de cédula o teléfono"
            className="text-center text-white"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
        </div>

        <Button
          className="bg-orange-500 hover:bg-orange-600 text-white mb-4"
          onClick={handleSearch}
          disabled={loading || !identifier}
        >
          {loading ? 'Buscando...' : 'Buscar boletos'}
        </Button>

        {message && <p className="text-center text-red-400 mt-4">{message}</p>}

        {customer && (
          <div className="mt-6 p-4 bg-gray-800 rounded-lg text-white space-y-3">
            <h3 className="text-xl font-bold border-b border-gray-600 pb-2">Datos del Cliente</h3>
            <div><strong>Nombre completo:</strong> {customer.fullName}</div>
            <div><strong>Cédula:</strong> {customer.idNumber}</div>
            <div><strong>Teléfono:</strong> {customer.phone}</div>
            <div><strong>País:</strong> {customer.countryName} ({customer.countryCode})</div>
            <div><strong>Referencia de pago:</strong> {customer.paymentReference}</div>
            <div><strong>Titular de la cuenta:</strong> {customer.accountHolder}</div>

            {customer.fileUrl && (
              <div className="mt-4">
                <strong>Comprobante de pago:</strong>
                {customer.mimeType?.startsWith('image/') ? (
                  <div className="mt-2">
                    <img
                      src={customer.fileUrl}
                      alt="Comprobante"
                      className="max-h-40 max-w-full rounded border border-gray-600"
                    />
                  </div>
                ) : customer.mimeType === 'application/pdf' ? (
                  <div className="mt-2">
                    <Link
                      href={customer.fileUrl}
                      target="_blank"
                      className="text-blue-400 underline hover:text-blue-300"
                    >
                      📄 Ver PDF: {customer.fileName}
                    </Link>
                  </div>
                ) : (
                  <div className="mt-2">
                    <a
                      href={customer.fileUrl}
                      target="_blank"
                      className="text-blue-400 underline hover:text-blue-300"
                    >
                      📎 Descargar archivo: {customer.fileName}
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {tickets && tickets.length > 0 && (
          <div className="text-center mt-6">
            <h3 className="text-white font-bold mb-2">
              {tickets.length} boleto{tickets.length !== 1 ? 's' : ''} encontrados:
            </h3>
            <div className="flex flex-wrap justify-center gap-2">
              {tickets.map((t) => (
                <span
                  key={t}
                  className="bg-yellow-500 text-black px-3 py-1 rounded-md font-mono font-bold text-sm sm:text-base"
                >
                  {t.toString().padStart(4, '0')}
                </span>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
