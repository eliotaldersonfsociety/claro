"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"

const faqs = [
  {
    question: "¿Cómo funciona la rifa?",
    answer:
      "Selecciona tus números favoritos, realiza el pago, sube tu capture de la compra y en 24 horas se te contacta por whatsapp para la verificacion de tu boleto y espera el sorteo a traves de nuestras redes sociales o la web conoceras la fecha y hora y or donde se hara la rifa es Super Gana. Es muy fácil y seguro.",
  },
  {
    question: "¿Cuándo es el sorteo?",
    answer:
      "El sorteo se dara la fecha al obtener el 50% de la venta de los tickets.",
  },
  {
    question: "¿Cómo verifico mis boletos?",
    answer:
      "Usa nuestro verificador de boletos ingresando tu número de teléfono o el número de boleto directamente.",
  },
  {
    question: "¿Si vivo en EEUU me la envian?",
    answer:
      "Si vivies en Miami se te hara la entrega personalmente si no se te enviara a tu domicilio.",
  },
  {
    question: "¿Si vivo fuera de EEUU me la envian?",
    answer:
      "Si vivies fuera de EEUU se te enviaran 3000 USD en efectivo, y si vives en Venezuela si te gusta se te entregaran 3 motos SBR.",
  },
  {
    question: "¿Si tengo un problema con algo en la web?",
    answer:
      "Teniendo algun problema con el sitio web, por favor comunica con nosotros a traves de nuestro chat en whatsapp a traves de estos numeros  o por correo electrónico de contacto.",
  },
  {
    question: "¿En que loteria se lanzara la rifa?",
    answer:
      "Se hara a traves de La Fantastica loteria colombiana.",
  },
  {
    question: "¿Quieres comunicarte con nosotros escribenos por whatsapp?",
    answer:
      "https://wa.me/17863728246 \n https://wa.me/13057861708 \n https://wa.me/19549313426",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="mb-8 p-[1px] rounded-xl bg-[linear-gradient(to_right,_#ec4899,_#facc15,_#60a5fa,_#22c55e)]">
    <Card className="p-4 md:p-8 border-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black shadow-2xl border border-gray-700">
      <div className="text-center">
              <div className="p-[1px] rounded-full bg-[linear-gradient(to_right,_#ec4899,_#facc15,_#60a5fa,_#22c55e)] inline-block mb-4 shadow-lg">
                <div className="bg-stone-950 w-fit text-s text-white py-3 px-6 rounded-full flex items-center space-x-2">
                  <h2 className="text-lg sm:text-3xl font-black flex items-center justify-center space-x-1 sm:space-x-3">
                    <img src="/conversacion.png" alt="Boletas" className="w-6 h-6" />
                    <span className="text-balance"><b>Preguntas Frecuentes</b></span>
                  </h2>
                </div>
              </div>
            </div>


      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-300 rounded-lg overflow-hidden"
          >
            {/* Pregunta */}
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex justify-between items-center px-4 py-3 text-left font-semibold text-white hover:bg-orange-500"
            >
              {faq.question}
              <span className="text-lg">{openIndex === index ? "−" : "+"}</span>
            </button>

            {/* Respuesta (animada) */}
            <AnimatePresence initial={false}>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-4 pb-3 text-white text-sm"
                >
                  {faq.answer}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </Card>
    </div>
  )
}
