// PaymentProof.tsx — versión con Driver.js

"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { submitEntry } from "@/app/actions/submitEntry"
import { uploadImage } from "@/app/actions/uploadToImageKit"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { driver } from "driver.js";
import 'driver.js/dist/driver.css'

type PersonalData = {
  fullName: string
  idNumber: string
  phone: string
  countryCode: string
  countryName: string
  paymentReference: string
  accountHolder: string
}

export function PaymentProof({
  selectedTickets,
  personalData,
  onSuccess,
}: {
  selectedTickets: number[]
  personalData: PersonalData
  onSuccess?: () => void
}) {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null

    // ✅ Validación: máximo 1MB
    if (selectedFile && selectedFile.size > 1 * 1024 * 1024) {
      alert("❌ El archivo excede el tamaño máximo permitido (1MB)")
      e.target.value = "" // reset input
      return
    }

    // ✅ Validación: solo imágenes
    if (selectedFile && !selectedFile.type.startsWith("image/")) {
      alert("❌ Solo se permiten imágenes (JPG, PNG, WEBP, etc.)")
      e.target.value = ""
      return
    }

    setFile(selectedFile)

    if (selectedFile) {
      const reader = new FileReader()
      reader.onload = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    } else {
      setPreviewUrl(null)
    }
  }

  const handleSubmit = async () => {
    // ✅ VALIDACIÓN FRONTEND — DETIENE EL ENVÍO SI FALTA ALGO
    if (!file) {
      alert("⚠️ Por favor, selecciona un archivo de comprobante de pago (imagen).")
      return
    }

    if (selectedTickets.length === 0) {
      alert("⚠️ Debes seleccionar al menos un boleto.")
      return
    }

    if (!personalData.fullName?.trim()) {
      alert('⚠️ El campo "Nombres y Apellidos" es obligatorio.')
      return
    }

    if (!personalData.idNumber?.trim()) {
      alert('⚠️ El campo "Cédula" es obligatorio.')
      return
    }

    if (!personalData.phone?.trim()) {
      alert('⚠️ El campo "Teléfono" es obligatorio.')
      return
    }

    if (!personalData.countryCode?.trim()) {
      alert('⚠️ El campo "País" es obligatorio.')
      return
    }

    if (!personalData.paymentReference?.trim()) {
      alert('⚠️ El campo "Referencia de pago" es obligatorio.')
      return
    }

    if (!personalData.accountHolder?.trim()) {
      alert('⚠️ El campo "Titular de la cuenta" es obligatorio.')
      return
    }

    setIsSubmitting(true)

    try {
      // Subir archivo
      const uploaded = await uploadImage(file)
      if (!uploaded.success || !uploaded.url) {
        alert(`❌ Error al subir el archivo: ${uploaded.error || "Intenta de nuevo"}`)
        return
      }

      // Enviar a backend
      const result = await submitEntry({
        ticketNumbers: selectedTickets,
        fullName: personalData.fullName.trim(),
        idNumber: personalData.idNumber.trim(),
        phone: personalData.phone.trim(),
        countryCode: personalData.countryCode,
        countryName: personalData.countryName,
        paymentReference: personalData.paymentReference?.trim() || "",
        accountHolder: personalData.accountHolder?.trim() || "",
        fileUrl: uploaded.url,
        fileName: file.name,
        mimeType: file.type,
        comment: comment.trim(),
      })

      if (result.success) {
        alert("✅ ¡Compra registrada exitosamente!")
        setFile(null)
        setPreviewUrl(null)
        setComment("")
        if (onSuccess) onSuccess()
      } else {
        alert(`❌ ${result.message || "Error al registrar la compra"}`)
      }
    } catch (error: any) {
      console.error("Error inesperado:", error)
      alert(`❌ Error inesperado: ${error.message || "Intenta más tarde"}`)
    } finally {
      setIsSubmitting(false)
    }
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
          element: '#payment-proof-title',
          popover: {
            title: 'Bienvenido al comprobante de pago',
            description: 'Aquí debes subir la captura o imagen que prueba que realizaste el pago por tus boletos.',
            side: 'bottom',
            align: 'center',
          },
        },
        {
          element: '#file-upload-area',
          popover: {
            title: 'Selecciona tu comprobante',
            description: 'Haz clic aquí para elegir una imagen desde tu dispositivo. Solo se aceptan JPG, PNG o WEBP, hasta 1MB.',
            side: 'top',
            align: 'center',
          },
        },
        {
          element: '#compression-tip',
          popover: {
            title: '¿Tu imagen es muy grande?',
            description: 'Si tu captura pesa más de 1MB, usa este enlace para comprimirla fácilmente sin perder calidad.',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '#optional-comment',
          popover: {
            title: 'Comentario opcional',
            description: 'Puedes dejar un mensaje adicional aquí, por ejemplo: “Pago por Zelle” o “Referencia: 1234”.',
            side: 'left',
            align: 'start',
          },
        },
        {
          element: '#submit-button',
          popover: {
            title: 'Enviar comprobante',
            description: 'Al hacer clic aquí, se verificará todo y se enviará tu compra. ¡Asegúrate de que todo esté correcto!',
            side: 'top',
            align: 'center',
          },
        },
        {
          element: '#help-button-proof',
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
  //   const seen = localStorage.getItem('seenPaymentProofTour')
  //   if (!seen) {
  //     setTimeout(startTour, 1000)
  //     localStorage.setItem('seenPaymentProofTour', 'true')
  //   }
  // }, [isClient])

  return (
    <div className="mb-8 p-[1px] rounded-xl bg-[linear-gradient(to_right,_#ec4899,_#facc15,_#60a5fa,_#22c55e)]">
      <Card className="p-6 border-0 space-y-4">
        {/* Título con botón de ayuda */}
        <div className="text-center mb-6">
          <div className="p-[1px] rounded-full bg-[linear-gradient(to_right,_#ec4899,_#facc15,_#60a5fa,_#22c55e)] inline-block mb-4 shadow-lg">
            <div className="bg-stone-950 w-fit text-s text-white py-3 px-6 rounded-full flex items-center space-x-2">
              <h2
                id="payment-proof-title"
                className="text-lg sm:text-2xl font-black flex items-center justify-center space-x-2"
              >
                📄 Comprobante de Pago
              </h2>
              <button
                id="help-button-proof"
                onClick={startTour}
                className="ml-4 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm py-1 px-3 rounded-full flex items-center gap-1 transition-all duration-300 shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-help-circle">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <line x1="12" y1="17" x2="12" y2="17"></line>
                </svg>
                ¿Cómo enviar?
              </button>
            </div>
          </div>
        </div>

        {/* Subida de archivo + Vista previa */}
        <label
          id="file-upload-area"
          htmlFor="file-upload"
          className="cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-6 text-center block hover:border-yellow-500 transition relative"
        >
          {previewUrl && (
            <div className="mb-4 flex justify-center">
              <img
                src={previewUrl}
                alt="Vista previa"
                className="max-h-48 max-w-full rounded-lg shadow-md border border-gray-200 object-contain"
              />
            </div>
          )}

          <div className="text-red-500 text-4xl mb-2">⚠️</div>
          {file ? (
            <p className="text-sm text-gray-700 font-bold">{file.name}</p>
          ) : (
            <>
              <p className="text-sm text-gray-600 mb-2">SELECCIONA UN ARCHIVO DE PAGO</p>
              <p className="text-xs text-gray-500 mb-2">Ejemplo: PAGOMÓVIL / ZELLE</p>
              <p className="text-xs text-gray-400">Formatos aceptados: JPG, PNG, WEBP</p>
              <p className="text-xs text-gray-400">Tamaño máximo: 1MB</p>
              <p id="compression-tip" className="text-xs text-orange-600 mt-1">
                ¿Tu imagen es muy grande?{" "}
                <a
                  href="https://tinypng.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  ¡Comprímela aquí!
                </a>
              </p>
            </>
          )}
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>

        {/* Comentario opcional */}
        <Textarea
          id="optional-comment"
          placeholder="Comentario opcional..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="bg-yellow-100 text-stone-950"
        />

        {/* Botón enviar con confirmación */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              id="submit-button"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-bold py-3 rounded-xl"
            >
              {isSubmitting ? "Enviando..." : "Enviar comprobante"}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="rounded-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-lg font-bold">
                ⚠ Verifica tu pago
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600">
                Verifica que el monto enviado sea el correcto del de los tickets
                comprados.  
                Si todo está bien, presiona <strong>Aceptar</strong> para continuar.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleSubmit}
                className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl"
              >
                Aceptar y enviar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Card>
    </div>
  )
}
