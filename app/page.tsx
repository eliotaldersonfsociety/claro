// app/page.tsx
'use client'

import { useState } from 'react'
import { Header } from '@/components/header'
import { RaffleInfo } from '@/components/raffle-info'
import { TicketGrid } from '@/components/ticket-grid'
import { PersonalDataForm } from '@/components/personal-data-form'
import { PaymentMethods } from '@/components/payment-methods'
import { PaymentProof } from '@/components/payment-proof'
import { TicketVerifier } from '@/components/ticket-verifier'
import { ImageGallery } from '@/components/image-gallery'
import { FAQ } from '@/components/faq'
import { Footer } from '@/components/footer'

export default function Home() {
  const [selectedTickets, setSelectedTickets] = useState<number[]>([])

  // 👉 Estado para datos personales
  const [personalData, setPersonalData] = useState({
    fullName: '',
    idNumber: '',
    phone: '',
    countryCode: 'VE',
    countryName: 'Venezuela',
    paymentReference: '',
    accountHolder: '',
  })

  // Esta función se pasa a PaymentProof y se ejecuta tras envío exitoso
  const handlePurchaseSuccess = () => {
    // ✅ Resetear tickets seleccionados
    setSelectedTickets([])
    // ✅ Resetear datos personales (opcional, depende de si quieres mantenerlos)
    setPersonalData({
      fullName: '',
      idNumber: '',
      phone: '',
      countryCode: 'VE',
      countryName: 'Venezuela',
      paymentReference: '',
      accountHolder: '',
    })
    // Opcional: mostrar mensaje, scroll arriba, etc.
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <RaffleInfo />

        <div id="tickets-section">
          <TicketGrid
            selectedTickets={selectedTickets}
            onSelectedTicketsChange={setSelectedTickets}
          />
        </div>

        <PersonalDataForm
          value={personalData}
          onChange={setPersonalData}
        />

        <PaymentMethods />

        <PaymentProof
          selectedTickets={selectedTickets}
          personalData={personalData}
          onSuccess={handlePurchaseSuccess}
        />

        <TicketVerifier />
        <ImageGallery />
        <FAQ />
        <Footer />
      </main>
    </div>
  )
}