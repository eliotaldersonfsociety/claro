// src/components/PaymentProof.tsx
"use client"

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { submitEntry } from '@/app/actions/submitEntry'
import { uploadImage } from '@/app/actions/uploadToImageKit'

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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null) // 👈 Para la miniatura
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Limpiar URL de preview cuando cambia el archivo
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    setFile(selectedFile)

    if (selectedFile) {
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = () => {
          setPreviewUrl(reader.result as string)
        }
        reader.readAsDataURL(selectedFile)
      } else if (selectedFile.type === 'application/pdf') {
        setPreviewUrl('/pdf-icon.png') // 👈 Puedes poner un ícono de PDF
      } else {
        setPreviewUrl(null)
      }
    } else {
      setPreviewUrl(null)
    }
  }

  const handleSubmit = async () => {
    if (!file) return alert('⚠️ Debes seleccionar un archivo de comprobante')
    if (selectedTickets.length === 0) return alert('⚠️ Debes seleccionar al menos un boleto')
    if (!personalData.fullName || !personalData.idNumber)
      return alert('⚠️ Completa todos los campos del formulario de datos personales')

    setIsSubmitting(true)

    try {
      const uploaded = await uploadImage(file)
      if (!uploaded.success || !uploaded.url) {
        return alert(`❌ Error subiendo archivo: ${uploaded.error || "URL no generada"}`)
      }

      const result = await submitEntry({
        ticketNumbers: selectedTickets,
        fullName: personalData.fullName,
        idNumber: personalData.idNumber,
        phone: personalData.phone,
        countryCode: personalData.countryCode,
        countryName: personalData.countryName,
        paymentReference: personalData.paymentReference,
        accountHolder: personalData.accountHolder,
        fileUrl: uploaded.url,
        fileName: file.name,
        mimeType: file.type,
        comment,
      })

      if (result.success) {
        alert('✅ Compra registrada exitosamente')
        setFile(null)
        setPreviewUrl(null) // 👈 Limpiar preview
        setComment('')
        if (onSuccess) onSuccess()
      } else {
        alert(`❌ Error: ${result.message}`)
      }
    } catch (error: any) {
      console.error(error)
      alert(`❌ ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mb-8 p-[1px] rounded-xl bg-[linear-gradient(to_right,_#ec4899,_#facc15,_#60a5fa,_#22c55e)]">
      <Card className="p-6 border-0 space-y-4">
        {/* Subida de archivo + Vista previa */}
        <label
          htmlFor="file-upload"
          className="cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-6 text-center block hover:border-yellow-500 transition relative"
        >
          {previewUrl && (
            <div className="mb-4 flex justify-center">
              {file?.type === 'application/pdf' ? (
                <div className="flex flex-col items-center">
                  <img
                    src="/pdf-icon.png"
                    alt="PDF"
                    className="w-16 h-16 mb-2"
                  />
                  <span className="text-xs text-gray-600">{file.name}</span>
                </div>
              ) : (
                <img
                  src={previewUrl}
                  alt="Vista previa"
                  className="max-h-48 max-w-full rounded-lg shadow-md border border-gray-200 object-contain"
                />
              )}
            </div>
          )}

          <div className="text-red-500 text-4xl mb-2">⚠️</div>
          {file ? (
            <p className="text-sm text-gray-700 font-bold">{file.name}</p>
          ) : (
            <>
              <p className="text-sm text-gray-600 mb-2">SELECCIONA UN ARCHIVO DE PAGO</p>
              <p className="text-xs text-gray-500 mb-2">Ejemplo: PAGOMÓVIL / ZELLE</p>
              <p className="text-xs text-gray-400">Formatos aceptados: JPG, PNG, PDF</p>
            </>
          )}
          <input
            id="file-upload"
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={handleFileChange} // 👈 Usamos la nueva función
          />
        </label>

        {/* Comentario opcional */}
        <Textarea
          placeholder="Comentario opcional..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="bg-stone-950 text-white"
        />

        {/* Botón enviar */}
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-bold py-3 rounded-xl"
        >
          {isSubmitting ? "Enviando..." : "Enviar comprobante"}
        </Button>
      </Card>
    </div>
  )
}
