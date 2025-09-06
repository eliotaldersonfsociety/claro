"use server"

import crypto from "crypto"

export type ImageKitAuthResult =
  | { success: true; token: string; expire: number; signature: string; publicKey: string }
  | { success: false; message: string }

export async function getImageKitAuth(): Promise<ImageKitAuthResult> {
  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY

  if (!publicKey || !privateKey) {
    return { success: false, message: "⚠️ Configuración de ImageKit no encontrada" }
  }

  // Genera token único
  const token = Date.now().toString() + Math.random().toString(36).slice(2)
  const expire = Math.floor(Date.now() / 1000) + 600 // 10 minutos en segundos

  // Hacer HMAC-SHA1 con la privateKey
  const hmac = crypto.createHmac("sha1", privateKey)
  hmac.update(token + expire)
  const signature = hmac.digest("hex") // ✅ firma correcta

  return {
    success: true,
    token,
    expire,
    signature,
    publicKey,
  }
}
