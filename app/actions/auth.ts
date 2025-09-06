// app/actions/auth-actions.ts
"use server";

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

// Tipado opcional (mejora DX)
type LoginResult =
  | { success: true }
  | { error: string };

export async function loginAction(formData: FormData): Promise<LoginResult> {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { error: "Usuario y contraseña son requeridos" };
  }

  try {
    // Buscar usuario en Turso
    const result = await db.execute({
      sql: "SELECT id, username, password_hash FROM users WHERE username = ? LIMIT 1",
      args: [username],
    });

    const user = result.rows[0];

    if (!user) {
      return { error: "Credenciales incorrectas" };
    }

    // Verificar hash
    const isValid = await bcrypt.compare(password, user.password_hash as string);
    if (!isValid) {
      return { error: "Credenciales incorrectas" };
    }

    // Crear sesión segura
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 días

    const session = {
      userId: user.id,
      username: user.username,
      expires: expires.toISOString(),
    };

    (await cookies()).set({
      name: "session",
      value: JSON.stringify(session),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires,
      path: "/",
    });

    // ✅ NO REDIRECCIONAMOS AQUÍ — solo indicamos éxito
    return { success: true };

  } catch (error) {
    console.error("Error en loginAction:", error);
    return { error: "Error interno del servidor" };
  }
}
