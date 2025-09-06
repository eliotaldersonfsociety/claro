"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image";

export function Header() {
  const scrollToTickets = () => {
    const ticketsSection = document.getElementById("tickets-section")
    if (ticketsSection) {
      ticketsSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <header className="bg-transparent backdrop-blur-md border-b border-white/10 text-white py-4 shadow-lg">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="text-white font-bold text-2xl flex items-center space-x-2">
            <Image 
              src="/4fantasticos.png"   // pon tu imagen en la carpeta /public
              alt="Logo los 4 fantasticos"
              width={100}
              height={100}
              className="rounded-full"
            />
          </div>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <a href="#" className="hover:text-yellow-300 transition-colors flex items-center space-x-1">
              <span>🏠</span>
              <span>INICIO</span>
            </a>
            <a href="#" className="hover:text-yellow-300 transition-colors flex items-center space-x-1">
              <span>⚙️</span>
              <span>VERIFICADOR</span>
            </a>
            <a href="#" className="hover:text-yellow-300 transition-colors flex items-center space-x-1">
              <span>❓</span>
              <span>PREGUNTAS</span>
            </a>
            <a href="#" className="hover:text-yellow-300 transition-colors flex items-center space-x-1">
              <span>📞</span>
              <span>CONTACTO</span>
            </a>
          </nav>
        </div>
        <Button
          onClick={scrollToTickets}
          className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold px-6 py-2 rounded-full shadow-lg transform hover:scale-105 transition-all"
        >
          <img 
              src="/billetes.png"   // 👉 tu imagen dentro de /public/icons/
              alt="Reloj"
              className="w-6 h-6"      // tamaño
            />
          LISTA DE BOLETOS
        </Button>
      </div>
    </header>
  )
}
