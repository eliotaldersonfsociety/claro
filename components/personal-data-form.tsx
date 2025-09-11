// PersonalDataForm.tsx — versión con Driver.js

"use client"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useMemo, useState, useEffect } from "react"
import { driver } from "driver.js";
import 'driver.js/dist/driver.css'

// Lista de países
const countries = [
  { code: "AR", name: "Argentina", phone: "+54" },
  { code: "BO", name: "Bolivia", phone: "+591" },
  { code: "BR", name: "Brasil", phone: "+55" },
  { code: "CA", name: "Canadá", phone: "+1" },
  { code: "CL", name: "Chile", phone: "+56" },
  { code: "CO", name: "Colombia", phone: "+57" },
  { code: "CR", name: "Costa Rica", phone: "+506" },
  { code: "CU", name: "Cuba", phone: "+53" },
  { code: "CW", name: "Curazao", phone: "+599" },
  { code: "DO", name: "República Dominicana", phone: "+1" },
  { code: "EC", name: "Ecuador", phone: "+593" },
  { code: "SV", name: "El Salvador", phone: "+503" },
  { code: "GT", name: "Guatemala", phone: "+502" },
  { code: "GY", name: "Guyana", phone: "+592" },
  { code: "HN", name: "Honduras", phone: "+504" },
  { code: "MX", name: "México", phone: "+52" },
  { code: "PA", name: "Panamá", phone: "+507" },
  { code: "PY", name: "Paraguay", phone: "+595" },
  { code: "PE", name: "Perú", phone: "+51" },
  { code: "PR", name: "Puerto Rico", phone: "+1-787" },
  { code: "ES", name: "España", phone: "+34" },
  { code: "US", name: "Estados Unidos", phone: "+1" },
  { code: "UY", name: "Uruguay", phone: "+598" },
  { code: "VE", name: "Venezuela", phone: "+58" },
] as const

const getFlagEmoji = (countryCode: string) =>
  countryCode.toUpperCase().replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt(0)))

export type PersonalData = {
  fullName: string
  idNumber: string
  phone: string
  countryCode: string
  countryName: string
  paymentReference: string
  accountHolder: string
}

type PersonalDataFormProps = {
  value: PersonalData
  onChange: (data: PersonalData) => void
}

export function PersonalDataForm({ value, onChange }: PersonalDataFormProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Extraer prefijo y número de teléfono
  const [prefix, phoneNumber] = useMemo(() => {
    const phone = value.phone || "+58"
    const firstSpace = phone.indexOf(" ")
    if (firstSpace === -1) {
      for (const c of countries) {
        if (phone.startsWith(c.phone)) {
          return [c.phone, phone.slice(c.phone.length).trim()]
        }
      }
      return ["+58", phone.slice(3)]
    }
    return [phone.slice(0, firstSpace), phone.slice(firstSpace + 1)]
  }, [value.phone])

  const countryOptions = useMemo(
    () => countries.map(c => ({ ...c, emoji: getFlagEmoji(c.code) })),
    []
  )

  const handlePhonePrefixChange = (newPrefix: string) => {
    onChange({
      ...value,
      phone: `${newPrefix} ${phoneNumber}`.trim(),
    })
  }

  const handlePhoneChange = (newNumber: string) => {
    onChange({
      ...value,
      phone: `${prefix} ${newNumber}`.trim(),
    })
  }

  const handleCountryChange = (code: string) => {
    const country = countries.find(c => c.code === code)
    onChange({
      ...value,
      countryCode: code,
      countryName: country?.name || "Venezuela",
      phone: country ? `${country.phone} ${phoneNumber}`.trim() : value.phone,
    })
  }

  // 🎯 DRIVER.JS TOUR
  const startTour = () => {
    if (typeof window === 'undefined') return

    const tour = driver({
      showProgress: true,
      allowKeyboardControl: true,
      allowClose: true,
      steps: [
        {
          element: '#personal-data-title',
          popover: {
            title: 'Bienvenido al formulario de datos personales',
            description: 'Completa todos los campos para poder procesar tu compra de boletos.',
            side: 'bottom',
            align: 'center',
          },
        },
        {
          element: '#form-fullname',
          popover: {
            title: 'Nombre completo',
            description: 'Ingresa tu nombre y apellido tal como aparece en tu documento de identidad.',
            side: 'left',
            align: 'start',
          },
        },
        {
          element: '#form-id',
          popover: {
            title: 'Número de cédula o documento',
            description: 'Escribe el número de tu documento de identidad sin puntos ni guiones.',
            side: 'right',
            align: 'start',
          },
        },
        {
          element: '#form-phone',
          popover: {
            title: 'Teléfono',
            description: 'Primero selecciona el código de país, luego escribe tu número sin el 0 inicial.',
            side: 'left',
            align: 'start',
          },
        },
        {
          element: '#form-country',
          popover: {
            title: 'País de residencia',
            description: 'Selecciona el país donde vives actualmente. Se sincroniza automáticamente con el prefijo telefónico.',
            side: 'right',
            align: 'start',
          },
        },
        {
          element: '#form-reference',
          popover: {
            title: 'Referencia de pago',
            description: 'Ingresa los últimos 4 dígitos del número de referencia de tu transferencia o pago.',
            side: 'top',
            align: 'center',
          },
        },
        {
          element: '#form-account-holder',
          popover: {
            title: 'Titular de la cuenta',
            description: 'Nombre completo de la persona o cuenta desde la que realizaste el pago.',
            side: 'top',
            align: 'center',
          },
        },
        {
          element: '#form-help-button',
          popover: {
            title: '¿Necesitas ayuda?',
            description: 'Puedes volver a iniciar este tutorial en cualquier momento haciendo clic aquí.',
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
  //   const seen = localStorage.getItem('seenPersonalDataTour')
  //   if (!seen) {
  //     setTimeout(startTour, 1000)
  //     localStorage.setItem('seenPersonalDataTour', 'true')
  //   }
  // }, [isClient])

  return (
    <div className="mb-8 p-[1px] rounded-xl bg-[linear-gradient(to_right,_#ec4899,_#facc15,_#60a5fa,_#22c55e)]">
      <Card className="p-4 bg-gradient-to-br from-gray-900 via-gray-800 to-black shadow-md border-0">
        <div className="text-center mb-8">
          <div className="p-[1px] rounded-full bg-[linear-gradient(to_right,_#ec4899,_#facc15,_#60a5fa,_#22c55e)] inline-block mb-4 shadow-lg">
            <div className="bg-stone-950 w-fit text-s text-white py-3 px-6 rounded-full flex items-center space-x-2">
              <h2
                id="personal-data-title"
                className="text-lg sm:text-3xl font-black flex items-center justify-center space-x-1 sm:space-x-3"
              >
                <img src="/user.png" alt="Usuario" className="w-6 h-6" />
                <span className="text-balance"><b>Datos Personales</b></span>
              </h2>
              <button
                id="form-help-button"
                onClick={startTour}
                className="ml-4 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm py-1 px-3 rounded-full flex items-center gap-1 transition-all duration-300 shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-help-circle">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <line x1="12" y1="17" x2="12" y2="17"></line>
                </svg>
                ¿Cómo llenar?
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Nombres */}
            <div id="form-fullname">
              <Label htmlFor="name" className="text-white p-1">Nombres y Apellidos *</Label>
              <Input
                id="name"
                placeholder="Ingresa tu nombre completo"
                className="text-stone-950 bg-amber-100"
                value={value.fullName}
                onChange={e => onChange({ ...value, fullName: e.target.value })}
              />
            </div>

            {/* Cédula */}
            <div id="form-id">
              <Label htmlFor="cedula" className="text-white p-1">Cédula *</Label>
              <Input
                id="cedula"
                placeholder="Número de cédula"
                className="text-stone-950 bg-amber-100"
                value={value.idNumber}
                onChange={e => onChange({ ...value, idNumber: e.target.value })}
              />
            </div>

            {/* Teléfono */}
            <div id="form-phone">
              <Label htmlFor="phone" className="text-white p-1">Teléfono *</Label>
              <div className="flex">
                <Select value={prefix} onValueChange={handlePhonePrefixChange}>
                  <SelectTrigger className="w-24 text-stone-950 bg-amber-100">
                    <SelectValue placeholder="Código" />
                  </SelectTrigger>
                  <SelectContent>
                    {countryOptions.map(c => (
                      <SelectItem key={c.code} value={c.phone}>
                        <span className="flex items-center gap-2">{c.emoji} {c.phone}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  className="flex-1 ml-2 text-stone-950 bg-amber-100"
                  placeholder="Número de teléfono"
                  value={phoneNumber}
                  onChange={e => handlePhoneChange(e.target.value)}
                />
              </div>
            </div>

            {/* País */}
            <div id="form-country">
              <Label htmlFor="country" className="text-white p-1">País</Label>
              <Select value={value.countryCode} onValueChange={handleCountryChange}>
                <SelectTrigger className="text-stone-950 bg-amber-100">
                  <SelectValue placeholder="Selecciona un país" />
                </SelectTrigger>
                <SelectContent>
                  {countryOptions.map(c => (
                    <SelectItem key={c.code} value={c.code}>
                      <span className="flex items-center gap-2">{c.emoji} {c.name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Referencia de pago */}
            <div id="form-reference" className="md:col-span-2">
              <Label htmlFor="reference" className="text-white p-1">Referencia del Pago (4 últimos dígitos)</Label>
              <Input
                id="reference"
                placeholder="Últimos 4 dígitos de la referencia"
                className="text-stone-950 bg-amber-100"
                value={value.paymentReference}
                onChange={e => onChange({ ...value, paymentReference: e.target.value })}
              />
            </div>

            {/* Titular de la cuenta */}
            <div id="form-account-holder" className="md:col-span-2">
              <Label htmlFor="account" className="text-white p-1">Titular de la Cuenta</Label>
              <Input
                id="account"
                placeholder="Nombre del titular de la cuenta"
                className="text-stone-950 bg-amber-100"
                value={value.accountHolder}
                onChange={e => onChange({ ...value, accountHolder: e.target.value })}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
