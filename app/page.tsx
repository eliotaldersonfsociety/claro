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

  // 👉 Función para calcular el total (igual que en TicketGrid)
  const calculateTotal = (tickets: number[]) => {
    const ticketPrice = 2
    const groupsOfTen = Math.floor(tickets.length / 10)
    const remaining = tickets.length % 10
    return groupsOfTen * 15 + remaining * ticketPrice
  }

  const total = calculateTotal(selectedTickets)

  // Esta función se pasa a PaymentProof y se ejecuta tras envío exitoso
  const handlePurchaseSuccess = () => {
    // ✅ Resetear tickets seleccionados
    setSelectedTickets([])
    // ✅ Resetear datos personales
    setPersonalData({
      fullName: '',
      idNumber: '',
      phone: '',
      countryCode: 'VE',
      countryName: 'Venezuela',
      paymentReference: '',
      accountHolder: '',
    })
    // Scroll suave al inicio
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <RaffleInfo />

        <div id="tickets-section" className="mb-12">
          <TicketGrid
            selectedTickets={selectedTickets}
            onSelectedTicketsChange={setSelectedTickets}
          />
        </div>

        <div id="personal-data-section" className="mb-12">
          <PersonalDataForm
            value={personalData}
            onChange={setPersonalData}
          />
        </div>

        <div id="payment-methods-section" className="mb-12">
          <PaymentMethods
            selectedTickets={selectedTickets}
            total={total}
          />
        </div>

        <div id="payment-proof-section" className="mb-12">
          <PaymentProof
            selectedTickets={selectedTickets}
            personalData={personalData}
            onSuccess={handlePurchaseSuccess}
          />
        </div>

        <div id="ticket-verifier-section" className="mb-12">
          <TicketVerifier />
        </div>

        <div id="gallery-section" className="mb-12">
          <ImageGallery />
        </div>

        <div id="faq-section" className="mb-12">
          <FAQ />
        </div>

        <Footer />
      </main>
    </div>
  )
}
