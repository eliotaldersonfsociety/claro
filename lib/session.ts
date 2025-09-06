// lib/session.ts
import { cookies } from "next/headers";

export async function getSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");

  if (!sessionCookie) return null;

  try {
    const session = JSON.parse(sessionCookie.value);

    // Verificar si la sesión expiró
    if (new Date(session.expires) < new Date()) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

// Opcional: obtener usuario completo
export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;

  const { db } = await import("./db");
  const result = await db.execute({
    sql: "SELECT id, username FROM users WHERE id = ?",
    args: [session.userId],
  });

  return result.rows[0] || null;
}
