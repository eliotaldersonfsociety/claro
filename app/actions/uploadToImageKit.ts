// /app/actions/services.ts
"use server"

import ImageKit from "imagekit"

// Initialize ImageKit with your credentials
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
})

// Function to upload image using ImageKit SDK
export async function uploadImage(
  file: File,
  options?: {
    folder?: string
    fileName?: string
  }
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Generate a unique file name if not provided
    const fileName = options?.fileName || `service-${Date.now()}-${Math.random().toString(36).substring(2)}.jpg`

    // Upload the file to ImageKit
    const upload = await imagekit.upload({
      file: buffer,
      fileName,
      folder: options?.folder || "/services", // Optional: specify folder
      useUniqueFileName: true, // Optional: ensure unique file names
    })

    return { success: true, url: upload.url }
  } catch (err: any) {
    console.error("❌ Error uploading image with ImageKit SDK:", err.message)
    return { success: false, error: err.message }
  }
}
