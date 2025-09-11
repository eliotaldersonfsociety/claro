"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function ImageGallery() {
  const [images, setImages] = useState<string[]>([
    "/klr0.png",
    "/klr1.png",
    "/klr2.png",
    "/fantasticos.jpg",
  ])

  const [selectedImage, setSelectedImage] = useState<string | null>(null)


  return (
    <div className="mb-8 p-[1px] rounded-xl bg-[linear-gradient(to_right,_#ec4899,_#facc15,_#60a5fa,_#22c55e)]">
    <Card className="p-4 md:p-8 border-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black shadow-2xl">
      <div className="text-center">
              <div className="p-[1px] rounded-full bg-[linear-gradient(to_right,_#ec4899,_#facc15,_#60a5fa,_#22c55e)] inline-block mb-4 shadow-lg">
                <div className="bg-stone-950 w-fit text-s text-white py-3 px-6 rounded-full flex items-center space-x-2">
                  <h2 className="text-lg sm:text-3xl font-black flex items-center justify-center space-x-1 sm:space-x-3">
                    <img src="/moto.png" alt="Boletas" className="w-8 h-8" />
                    <span className="text-balance"><b>Galeria de la Moto</b></span>
                  </h2>
                </div>
              </div>
            </div>

      <div className="mb-6">
        {images.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* First image - large on mobile */}
            <div className="relative group cursor-pointer md:col-span-1" onClick={() => setSelectedImage(images[0])}>
              <img
                src={images[0] || "/placeholder.svg"}
                alt="Imagen principal"
                className="w-full h-64 md:h-48 object-cover rounded-xl shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl border-2 border-gray-600 group-hover:border-orange-400"
              />
            </div>

            {/* Remaining images - small grid on mobile */}
            <div className="grid grid-cols-3 md:col-span-2 lg:col-span-3 gap-2 md:gap-4">
              {images.slice(1).map((image, index) => (
                <div key={index + 1} className="relative group cursor-pointer" onClick={() => setSelectedImage(image)}>
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Imagen ${index + 2}`}
                    className="w-full h-20 md:h-48 object-cover rounded-xl shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl border-2 border-gray-600 group-hover:border-orange-400"
                  />
                  </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={selectedImage || "/placeholder.svg"}
              alt="Imagen ampliada"
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-xl shadow-lg"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </Card>
    </div>
  )
}
