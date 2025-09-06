// app/dashboard/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashboardClient from "@/components/DashboardClient";
import { getEntries } from "@/app/actions/getEntries";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");

  if (!sessionCookie) {
    redirect("/login"); // Si no hay cookie, redirige
  }

  const session = JSON.parse(sessionCookie.value);

  const resultEntries = await getEntries(); // puedes filtrar por session.userId si lo necesitas
  if (!resultEntries.success) {
    throw new Error(resultEntries.message);
  }
  const entries = resultEntries.data;

  return <DashboardClient entries={entries || []} user={session} />;
}
